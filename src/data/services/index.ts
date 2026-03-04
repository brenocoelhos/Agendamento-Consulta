import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Appointment, PaymentRequest, PaymentResponse, ScheduledNotification } from '../../domain/entities';
import { INotificationService, IPaymentService } from '../../domain/repositories';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── AbacatePay Mock Service ───────────────────────────────────────────────────
// This simulates Abacate Pay API integration.
// Replace base URL and add real API key when integrating with production.
const ABACATE_PAY_BASE_URL = 'https://api.abacatepay.com/v1'; // Mock

export class AbacatePayService implements IPaymentService {
  private apiKey = 'mock_abacate_key_xxxxx'; // Replace with real key

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 800));

    if (request.method === 'pix') {
      // Mock Pix response
      return {
        id: `pay_${uuidv4()}`,
        status: 'pending',
        pixCode: this.generatePixCode(request),
        pixQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          `00020126580014BR.GOV.BCB.PIX0136${uuidv4()}5204000053039865406${(request.amount / 100).toFixed(2)}5802BR5925Clínica Saúde Ltda6009SAO PAULO62070503***6304ABCD`
        )}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    }

    // Credit/Debit card - simulate instant approval
    return {
      id: `pay_${uuidv4()}`,
      status: 'paid',
      paidAt: new Date().toISOString(),
    };
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    await new Promise(r => setTimeout(r, 300));
    return {
      id: paymentId,
      status: 'paid',
      paidAt: new Date().toISOString(),
    };
  }

  private generatePixCode(request: PaymentRequest): string {
    // Simplified EMV Pix code structure (mock)
    const amount = (request.amount / 100).toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX013636401c2d-mock-${uuidv4().slice(0, 8)}5204000053039865406${amount}5802BR5925Clinica Saude Ltda6009SAO PAULO6304A1B2`;
  }
}

// ─── NotificationService ──────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService implements INotificationService {
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) return false;

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Consultas',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0A5C8A',
      });
    }

    return true;
  }

  async scheduleAppointmentReminder(
    appointment: Appointment
  ): Promise<ScheduledNotification | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    try {
      const appointmentDateTime = parseISO(`${appointment.date}T${appointment.startTime}:00`);
      const reminderTime = subHours(appointmentDateTime, 2); // 2h before

      if (reminderTime <= new Date()) return null;

      const formattedDate = format(appointmentDateTime, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏥 Lembrete de Consulta',
          body: `Sua consulta com ${appointment.doctorName} é ${formattedDate}. Não esqueça!`,
          data: { appointmentId: appointment.id },
          sound: true,
          ...(Platform.OS === 'android' && { channelId: 'appointments' }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderTime,
        },
      });

      return {
        appointmentId: appointment.id,
        notificationId,
        scheduledFor: reminderTime.toISOString(),
      };
    } catch (error) {
      console.warn('Failed to schedule notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}
