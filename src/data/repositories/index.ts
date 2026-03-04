import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, Doctor, Specialty, TimeSlot } from '../../domain/entities';
import {
  IAppointmentRepository,
  IDoctorRepository,
  ISpecialtyRepository,
  ITimeSlotRepository,
} from '../../domain/repositories';
import {
  MOCK_DOCTORS,
  MOCK_SPECIALTIES,
  generateAvailableDates,
  generateTimeSlots,
} from '../mock/data';

const APPOINTMENTS_KEY = '@clinica:appointments';

// ─── SpecialtyRepository ──────────────────────────────────────────────────────
export class SpecialtyRepository implements ISpecialtyRepository {
  async getAll(): Promise<Specialty[]> {
    return MOCK_SPECIALTIES;
  }

  async getById(id: string): Promise<Specialty | null> {
    return MOCK_SPECIALTIES.find(s => s.id === id) ?? null;
  }
}

// ─── DoctorRepository ─────────────────────────────────────────────────────────
export class DoctorRepository implements IDoctorRepository {
  async getAll(): Promise<Doctor[]> {
    return MOCK_DOCTORS;
  }

  async getById(id: string): Promise<Doctor | null> {
    return MOCK_DOCTORS.find(d => d.id === id) ?? null;
  }

  async getBySpecialty(specialtyId: string): Promise<Doctor[]> {
    return MOCK_DOCTORS.filter(d => d.specialtyId === specialtyId);
  }
}

// ─── TimeSlotRepository ───────────────────────────────────────────────────────
export class TimeSlotRepository implements ITimeSlotRepository {
  async getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    return generateTimeSlots(doctorId, date);
  }

  async getAvailableDates(doctorId: string, month: string): Promise<string[]> {
    return generateAvailableDates(doctorId, month);
  }

  async markSlotUnavailable(_slotId: string): Promise<void> {
    // In a real app, this would update backend
  }
}

// ─── AppointmentRepository ────────────────────────────────────────────────────
export class AppointmentRepository implements IAppointmentRepository {
  private async load(): Promise<Appointment[]> {
    try {
      const raw = await AsyncStorage.getItem(APPOINTMENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private async save(appointments: Appointment[]): Promise<void> {
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }

  async getAll(): Promise<Appointment[]> {
    return this.load();
  }

  async getById(id: string): Promise<Appointment | null> {
    const all = await this.load();
    return all.find(a => a.id === id) ?? null;
  }

  async create(appointment: Appointment): Promise<void> {
    const all = await this.load();
    all.push(appointment);
    await this.save(all);
  }

  async update(appointment: Appointment): Promise<void> {
    const all = await this.load();
    const idx = all.findIndex(a => a.id === appointment.id);
    if (idx !== -1) {
      all[idx] = appointment;
      await this.save(all);
    }
  }

  async cancel(id: string): Promise<void> {
    const all = await this.load();
    const idx = all.findIndex(a => a.id === id);
    if (idx !== -1) {
      all[idx].status = 'cancelled';
      await this.save(all);
    }
  }

  async delete(id: string): Promise<void> {
    const all = await this.load();
    await this.save(all.filter(a => a.id !== id));
  }
}
