// ─── Specialty ────────────────────────────────────────────────────────────────
export interface Specialty {
  id: string;
  name: string;
  icon: string; // Ionicons name
  description: string;
  color: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialtyId: string;
  specialtyName: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  bio: string;
  education: string[];
  languages: string[];
  consultationPrice: number; // in BRL cents
  availableDays: number[]; // 0=Sun, 1=Mon ... 6=Sat
}

// ─── TimeSlot ─────────────────────────────────────────────────────────────────
export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string; // ISO 8601 YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  notificationId?: string;
  createdAt: string; // ISO
  consultationPrice: number; // BRL cents
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card';

export interface PaymentRequest {
  appointmentId: string;
  amount: number; // BRL cents
  method: PaymentMethod;
  patientName: string;
  patientEmail: string;
  patientCpf: string;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'paid' | 'failed';
  pixCode?: string;
  pixQrCodeUrl?: string;
  expiresAt?: string;
  paidAt?: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface ScheduledNotification {
  appointmentId: string;
  notificationId: string;
  scheduledFor: string; // ISO
}
