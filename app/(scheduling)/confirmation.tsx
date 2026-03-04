import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Animated, Platform,
  Share, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme, useCreateAppointment } from '../../src/presentation/hooks';
import { Spacing, Typography, BorderRadius } from '../../src/presentation/theme';
import { Button, Card, Divider, LoadingSpinner, PriceTag, StatusBadge } from '../../src/presentation/components/common';
import { Appointment } from '../../src/domain/entities';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{
    doctorId: string; doctorName: string; specialtyId: string;
    specialtyName: string; consultationPrice: string; date: string;
    startTime: string; endTime: string; patientName: string;
    patientPhone: string; patientEmail: string; patientCpf: string;
    notes: string; paymentMethod: string;
  }>();

  const { colors } = useTheme();
  const { create, loading } = useCreateAppointment();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAppointment = async () => {
      const result = await create({
        doctorId: params.doctorId,
        doctorName: params.doctorName,
        specialtyId: params.specialtyId,
        specialtyName: params.specialtyName,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        patientName: params.patientName,
        patientPhone: params.patientPhone,
        patientEmail: params.patientEmail,
        patientCpf: params.patientCpf,
        notes: params.notes,
        consultationPrice: parseInt(params.consultationPrice ?? '0'),
        paymentMethod: params.paymentMethod as any,
        });

      if (result) {
        setAppointment(result);
        if (params.paymentMethod === 'pix') {
          // Simulate pix code from the mock
          setPixCode('00020126580014BR.GOV.BCB.PIX0136mock-pix-key-123456789012345678901234562040000530398654061000.005802BR5925Clinica Saude Ltda6009SAO PAULO6304ABCD');
        }
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      } else {
        setError('Ocorreu um erro ao criar o agendamento. Tente novamente.');
      }
    };

    createAppointment();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: `${colors.primary}15`,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="time-outline" size={36} color={colors.primary} />
          </View>
          <Text style={{ ...Typography.headlineSmall, color: colors.text }}>
            Processando agendamento...
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 32 }}>
            Aguarde enquanto confirmamos sua consulta e processamos o pagamento
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !appointment) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 16 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: `${colors.error}15`,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="close-circle" size={40} color={colors.error} />
          </View>
          <Text style={{ ...Typography.headlineMedium, color: colors.text, textAlign: 'center' }}>
            Erro no Agendamento
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: 'center', fontSize: 14 }}>
            {error}
          </Text>
          <Button title="Tentar Novamente" onPress={() => router.back()} />
          <Button title="Ir para o Início" onPress={() => router.replace('/(tabs)')} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const apptDate = new Date(`${appointment.date}T${appointment.startTime}`);

  const handleShare = async () => {
    const message = `🏥 Consulta Agendada!\n\nMédico: ${appointment.doctorName}\nEspecialidade: ${appointment.specialtyName}\nData: ${format(apptDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}\nHorário: ${appointment.startTime} – ${appointment.endTime}\n\nClínica Saúde – (11) 3000-0000`;
    await Share.share({ message });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Success hero */}
        <Animated.View style={{
          alignItems: 'center', paddingVertical: Spacing.xxl,
          backgroundColor: colors.primary,
          paddingHorizontal: Spacing.md,
          opacity: opacityAnim,
        }}>
          <Animated.View style={{
            transform: [{ scale: scaleAnim }],
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
            marginBottom: Spacing.md,
          }}>
            <Ionicons name="checkmark" size={52} color="#FFFFFF" />
          </Animated.View>

          <Text style={{ ...Typography.displaySmall, color: '#FFFFFF', textAlign: 'center' }}>
            Consulta Agendada!
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center', marginTop: 8 }}>
            Você receberá um lembrete 2 horas antes
          </Text>
          <StatusBadge status={appointment.status} />
        </Animated.View>

        <View style={{ padding: Spacing.md, gap: Spacing.md }}>
          {/* Appointment details */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 14 }}>
              Detalhes da Consulta
            </Text>
            <View style={{ gap: 12 }}>
              <DetailRow icon="person" label="Médico" value={appointment.doctorName} colors={colors} />
              <DetailRow icon="medical" label="Especialidade" value={appointment.specialtyName} colors={colors} />
              <DetailRow
                icon="calendar"
                label="Data"
                value={format(apptDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                colors={colors}
              />
              <DetailRow
                icon="time"
                label="Horário"
                value={`${appointment.startTime} – ${appointment.endTime}`}
                colors={colors}
              />
              <Divider />
              <DetailRow icon="person-circle" label="Paciente" value={appointment.patientName} colors={colors} />
              <DetailRow icon="call" label="Telefone" value={appointment.patientPhone} colors={colors} />
            </View>
          </Card>

          {/* Payment */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 14 }}>
              Pagamento
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: colors.textSecondary }}>Valor da consulta</Text>
              <PriceTag amountCents={appointment.consultationPrice} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Status</Text>
              <StatusBadge status={appointment.paymentStatus} />
            </View>

            {/* PIX code if pending */}
            {appointment.paymentStatus === 'pending' && pixCode && (
              <View style={{
                marginTop: Spacing.md,
                padding: Spacing.md,
                backgroundColor: `${colors.primary}08`,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: `${colors.primary}20`,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Ionicons name="qr-code" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>
                    Pague com Pix
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 10 }}>
                  Copie o código abaixo e pague no seu banco:
                </Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Código Pix Copiado!', 'Cole no seu aplicativo de banco.')}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: BorderRadius.sm,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 11, fontFamily: 'monospace' }} numberOfLines={3}>
                    {pixCode}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    <Ionicons name="copy-outline" size={14} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                      Toque para copiar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          {/* Notification info */}
          {appointment.notificationId && (
            <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: `${colors.success}15`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="notifications" size={24} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: colors.text, fontSize: 14 }}>
                  Lembrete Ativado
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                  Você será notificado 2 horas antes da consulta
                </Text>
              </View>
            </Card>
          )}

          {/* Actions */}
          <TouchableOpacity onPress={handleShare}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: 14,
              borderRadius: BorderRadius.md,
              borderWidth: 1.5, borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 15 }}>
              Compartilhar Consulta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
        borderTopWidth: 1, borderTopColor: colors.border,
        backgroundColor: colors.surface,
        flexDirection: 'row', gap: 10,
      }}>
        <Button
          title="Ver Consultas"
          onPress={() => router.replace('/(tabs)/appointments')}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title="Início"
          onPress={() => router.replace('/(tabs)')}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value, colors }: {
  icon: string; label: string; value: string; colors: any;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
      <View style={{
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: `${colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name={icon as any} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '500', textTransform: 'capitalize' }}>
          {label}
        </Text>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500', marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
