import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../theme';
import { useEffect, useState, useCallback } from 'react';
import { Appointment, Doctor, Specialty, TimeSlot } from '../../domain/entities';
import {
  cancelAppointmentUseCase,
  createAppointmentUseCase,
  getAppointmentsUseCase,
  getAvailableDatesUseCase,
  getDoctorByIdUseCase,
  getDoctorsUseCase,
  getSpecialtiesUseCase,
  getTimeSlotsUseCase,
} from '../../domain/container';
import { CreateAppointmentInput } from '../../domain/usecases';

// ─── useTheme ─────────────────────────────────────────────────────────────────
export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: Colors[isDark ? 'dark' : 'light'], isDark };
}

// ─── useSpecialties ───────────────────────────────────────────────────────────
export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpecialtiesUseCase.execute();
      setSpecialties(data);
    } catch (e) {
      setError('Erro ao carregar especialidades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { specialties, loading, error, reload: load };
}

// ─── useDoctors ───────────────────────────────────────────────────────────────
export function useDoctors(specialtyId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorsUseCase.execute(specialtyId);
      setDoctors(data);
    } catch (e) {
      setError('Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  }, [specialtyId]);

  useEffect(() => { load(); }, [load]);
  return { doctors, loading, error, reload: load };
}

// ─── useDoctor ────────────────────────────────────────────────────────────────
export function useDoctor(doctorId: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorByIdUseCase.execute(doctorId).then(d => {
      setDoctor(d);
      setLoading(false);
    });
  }, [doctorId]);

  return { doctor, loading };
}

// ─── useTimeSlots ─────────────────────────────────────────────────────────────
export function useTimeSlots(doctorId: string, date: string) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!doctorId || !date) return;
    setLoading(true);
    try {
      const data = await getTimeSlotsUseCase.execute(doctorId, date);
      setSlots(data);
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => { load(); }, [load]);
  return { slots, loading };
}

// ─── useAvailableDates ────────────────────────────────────────────────────────
export function useAvailableDates(doctorId: string, month: string) {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    if (!doctorId || !month) return;
    getAvailableDatesUseCase.execute(doctorId, month).then(setDates);
  }, [doctorId, month]);

  return dates;
}

// ─── useAppointments ──────────────────────────────────────────────────────────
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsUseCase.execute();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = useCallback(async (id: string, notificationId?: string) => {
    await cancelAppointmentUseCase.execute(id, notificationId);
    await load();
  }, [load]);

  return { appointments, loading, reload: load, cancel };
}

// ─── useCreateAppointment ─────────────────────────────────────────────────────
export function useCreateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (input: CreateAppointmentInput): Promise<Appointment | null> => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await createAppointmentUseCase.execute(input);
      return appointment;
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao criar agendamento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}
