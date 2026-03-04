import {
  AppointmentRepository,
  DoctorRepository,
  SpecialtyRepository,
  TimeSlotRepository,
} from '../data/repositories';
import { AbacatePayService, NotificationService } from '../data/services';
import {
  CancelAppointmentUseCase,
  CreateAppointmentUseCase,
  GetAppointmentsUseCase,
  GetAvailableDatesUseCase,
  GetDoctorByIdUseCase,
  GetDoctorsUseCase,
  GetSpecialtiesUseCase,
  GetTimeSlotsUseCase,
} from './usecases';

// ─── Repositories ─────────────────────────────────────────────────────────────
const specialtyRepository = new SpecialtyRepository();
const doctorRepository = new DoctorRepository();
const timeSlotRepository = new TimeSlotRepository();
const appointmentRepository = new AppointmentRepository();

// ─── Services ─────────────────────────────────────────────────────────────────
const paymentService = new AbacatePayService();
export const notificationService = new NotificationService();

// ─── Use Cases ────────────────────────────────────────────────────────────────
export const getSpecialtiesUseCase = new GetSpecialtiesUseCase(specialtyRepository);
export const getDoctorsUseCase = new GetDoctorsUseCase(doctorRepository);
export const getDoctorByIdUseCase = new GetDoctorByIdUseCase(doctorRepository);
export const getTimeSlotsUseCase = new GetTimeSlotsUseCase(timeSlotRepository);
export const getAvailableDatesUseCase = new GetAvailableDatesUseCase(timeSlotRepository);
export const getAppointmentsUseCase = new GetAppointmentsUseCase(appointmentRepository);
export const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepository,
  timeSlotRepository,
  paymentService,
  notificationService
);
export const cancelAppointmentUseCase = new CancelAppointmentUseCase(
  appointmentRepository,
  notificationService
);
