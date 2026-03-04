import {
  Appointment,
  Doctor,
  PaymentRequest,
  PaymentResponse,
  ScheduledNotification,
  Specialty,
  TimeSlot,
} from '../entities';

// ─── ISpecialtyRepository ─────────────────────────────────────────────────────
export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  getById(id: string): Promise<Specialty | null>;
}

// ─── IDoctorRepository ────────────────────────────────────────────────────────
export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getById(id: string): Promise<Doctor | null>;
  getBySpecialty(specialtyId: string): Promise<Doctor[]>;
}

// ─── ITimeSlotRepository ──────────────────────────────────────────────────────
export interface ITimeSlotRepository {
  getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]>;
  getAvailableDates(doctorId: string, month: string): Promise<string[]>; // YYYY-MM
  markSlotUnavailable(slotId: string): Promise<void>;
}

// ─── IAppointmentRepository ───────────────────────────────────────────────────
export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  getById(id: string): Promise<Appointment | null>;
  create(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
  cancel(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

// ─── IPaymentService ──────────────────────────────────────────────────────────
export interface IPaymentService {
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  checkPaymentStatus(paymentId: string): Promise<PaymentResponse>;
}

// ─── INotificationService ─────────────────────────────────────────────────────
export interface INotificationService {
  requestPermissions(): Promise<boolean>;
  scheduleAppointmentReminder(
    appointment: Appointment
  ): Promise<ScheduledNotification | null>;
  cancelNotification(notificationId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
}
