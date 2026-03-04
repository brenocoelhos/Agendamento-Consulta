import { Appointment, Doctor, PaymentMethod, Specialty, TimeSlot } from '../entities';
import {
  IAppointmentRepository,
  IDoctorRepository,
  INotificationService,
  IPaymentService,
  ISpecialtyRepository,
  ITimeSlotRepository,
} from '../repositories';
import { v4 as uuidv4 } from 'uuid';

// ─── GetSpecialties ───────────────────────────────────────────────────────────
export class GetSpecialtiesUseCase {
  constructor(private repo: ISpecialtyRepository) {}
  async execute(): Promise<Specialty[]> {
    return this.repo.getAll();
  }
}

// ─── GetDoctors ───────────────────────────────────────────────────────────────
export class GetDoctorsUseCase {
  constructor(private repo: IDoctorRepository) {}
  async execute(specialtyId?: string): Promise<Doctor[]> {
    if (specialtyId) return this.repo.getBySpecialty(specialtyId);
    return this.repo.getAll();
  }
}

export class GetDoctorByIdUseCase {
  constructor(private repo: IDoctorRepository) {}
  async execute(id: string): Promise<Doctor | null> {
    return this.repo.getById(id);
  }
}

// ─── GetTimeSlots ─────────────────────────────────────────────────────────────
export class GetTimeSlotsUseCase {
  constructor(private repo: ITimeSlotRepository) {}
  async execute(doctorId: string, date: string): Promise<TimeSlot[]> {
    return this.repo.getAvailableSlots(doctorId, date);
  }
}

export class GetAvailableDatesUseCase {
  constructor(private repo: ITimeSlotRepository) {}
  async execute(doctorId: string, month: string): Promise<string[]> {
    return this.repo.getAvailableDates(doctorId, month);
  }
}

// ─── CreateAppointment ────────────────────────────────────────────────────────
export interface CreateAppointmentInput {
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  date: string;
  startTime: string;
  endTime: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  notes?: string;
  consultationPrice: number;
  paymentMethod: PaymentMethod;
  patientCpf: string;
}

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private timeSlotRepo: ITimeSlotRepository,
    private paymentService: IPaymentService,
    private notificationService: INotificationService
  ) {}

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    const appointmentId = uuidv4();

    // Process payment first
    const paymentResponse = await this.paymentService.createPayment({
      appointmentId,
      amount: input.consultationPrice,
      method: input.paymentMethod,
      patientName: input.patientName,
      patientEmail: input.patientEmail ?? '',
      patientCpf: input.patientCpf,
    });

    const appointment: Appointment = {
      id: appointmentId,
      doctorId: input.doctorId,
      doctorName: input.doctorName,
      specialtyId: input.specialtyId,
      specialtyName: input.specialtyName,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'scheduled',
      patientName: input.patientName,
      patientPhone: input.patientPhone,
      patientEmail: input.patientEmail,
      notes: input.notes,
      paymentStatus: paymentResponse.status === 'paid' ? 'paid' : 'pending',
      paymentId: paymentResponse.id,
      createdAt: new Date().toISOString(),
      consultationPrice: input.consultationPrice,
    };

    // Schedule notification
    const notification = await this.notificationService.scheduleAppointmentReminder(appointment);
    if (notification) {
      appointment.notificationId = notification.notificationId;
    }

    await this.appointmentRepo.create(appointment);

    return appointment;
  }
}

// ─── GetAppointments ──────────────────────────────────────────────────────────
export class GetAppointmentsUseCase {
  constructor(private repo: IAppointmentRepository) {}
  async execute(): Promise<Appointment[]> {
    const all = await this.repo.getAll();
    return all.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });
  }
}

// ─── CancelAppointment ────────────────────────────────────────────────────────
export class CancelAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private notificationService: INotificationService
  ) {}

  async execute(appointmentId: string, notificationId?: string): Promise<void> {
    if (notificationId) {
      await this.notificationService.cancelNotification(notificationId);
    }
    await this.appointmentRepo.cancel(appointmentId);
  }
}
