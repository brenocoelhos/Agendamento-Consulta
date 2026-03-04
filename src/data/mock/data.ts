import { Doctor, Specialty, TimeSlot } from '../../domain/entities';
import { format, addDays, startOfToday } from 'date-fns';

// ─── Specialties ──────────────────────────────────────────────────────────────
export const MOCK_SPECIALTIES: Specialty[] = [
  {
    id: 'sp-001',
    name: 'Cardiologia',
    icon: 'heart',
    description: 'Diagnóstico e tratamento de doenças do coração e sistema circulatório.',
    color: '#E53E3E',
  },
  {
    id: 'sp-002',
    name: 'Dermatologia',
    icon: 'body',
    description: 'Cuidados com a pele, cabelos e unhas.',
    color: '#D69E2E',
  },
  {
    id: 'sp-003',
    name: 'Neurologia',
    icon: 'cellular',
    description: 'Tratamento de doenças do sistema nervoso.',
    color: '#805AD5',
  },
  {
    id: 'sp-004',
    name: 'Ortopedia',
    icon: 'fitness',
    description: 'Diagnóstico e tratamento do aparelho locomotor.',
    color: '#3182CE',
  },
  {
    id: 'sp-005',
    name: 'Pediatria',
    icon: 'happy',
    description: 'Saúde integral de crianças e adolescentes.',
    color: '#38A169',
  },
  {
    id: 'sp-006',
    name: 'Ginecologia',
    icon: 'woman',
    description: 'Saúde da mulher em todas as fases da vida.',
    color: '#D53F8C',
  },
  {
    id: 'sp-007',
    name: 'Oftalmologia',
    icon: 'eye',
    description: 'Cuidados com a saúde visual e doenças dos olhos.',
    color: '#319795',
  },
  {
    id: 'sp-008',
    name: 'Psiquiatria',
    icon: 'medical',
    description: 'Saúde mental, diagnóstico e tratamento de transtornos psiquiátricos.',
    color: '#E67E22',
  },
];

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'dr-001',
    name: 'Dr. Carlos Eduardo Mendes',
    crm: 'CRM/SP 123456',
    specialtyId: 'sp-001',
    specialtyName: 'Cardiologia',
    rating: 4.9,
    reviewCount: 312,
    bio: 'Cardiologista com 18 anos de experiência, especializado em insuficiência cardíaca e arritmias. Formado pela USP com residência no InCor.',
    education: ['USP – Faculdade de Medicina', 'Residência no InCor – SP', 'Doutorado em Cardiologia – UNIFESP'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    consultationPrice: 35000,
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'dr-002',
    name: 'Dra. Ana Lívia Ferreira',
    crm: 'CRM/SP 234567',
    specialtyId: 'sp-001',
    specialtyName: 'Cardiologia',
    rating: 4.7,
    reviewCount: 198,
    bio: 'Especialista em cardiologia preventiva e ecocardiografia. Atua no atendimento de pacientes adultos e idosos.',
    education: ['UNICAMP – Medicina', 'Especialização em Ecocardiografia – SBC'],
    languages: ['Português', 'Inglês'],
    consultationPrice: 28000,
    availableDays: [1, 3, 5],
  },
  {
    id: 'dr-003',
    name: 'Dra. Patrícia Gomes',
    crm: 'CRM/SP 345678',
    specialtyId: 'sp-002',
    specialtyName: 'Dermatologia',
    rating: 4.8,
    reviewCount: 427,
    bio: 'Dermatologista com foco em dermatologia estética e tratamento de psoríase, vitiligo e acne.',
    education: ['FMUSP – Medicina', 'Residência em Dermatologia – Hospital das Clínicas'],
    languages: ['Português', 'Inglês', 'Francês'],
    consultationPrice: 32000,
    availableDays: [1, 2, 4],
  },
  {
    id: 'dr-004',
    name: 'Dr. Rodrigo Albuquerque',
    crm: 'CRM/SP 456789',
    specialtyId: 'sp-003',
    specialtyName: 'Neurologia',
    rating: 4.9,
    reviewCount: 256,
    bio: 'Neurologista especializado em cefaleia, epilepsia e doenças neurodegenerativas como Alzheimer e Parkinson.',
    education: ['UNIFESP – Medicina', 'Residência em Neurologia – EPM'],
    languages: ['Português', 'Inglês'],
    consultationPrice: 40000,
    availableDays: [2, 3, 4, 5],
  },
  {
    id: 'dr-005',
    name: 'Dr. Marcos Vinicius Santos',
    crm: 'CRM/SP 567890',
    specialtyId: 'sp-004',
    specialtyName: 'Ortopedia',
    rating: 4.6,
    reviewCount: 183,
    bio: 'Ortopedista com especialização em joelho e quadril. Realiza procedimentos artroscópicos e cirurgias de mínima invasão.',
    education: ['PUC-SP – Medicina', 'Fellowship em Cirurgia do Joelho – IOT-HCFMUSP'],
    languages: ['Português'],
    consultationPrice: 30000,
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'dr-006',
    name: 'Dra. Juliana Rocha',
    crm: 'CRM/SP 678901',
    specialtyId: 'sp-005',
    specialtyName: 'Pediatria',
    rating: 5.0,
    reviewCount: 541,
    bio: 'Pediatra com 12 anos de experiência no atendimento de recém-nascidos, bebês, crianças e adolescentes.',
    education: ['USP – Medicina', 'Residência em Pediatria – ICr-HCFMUSP'],
    languages: ['Português', 'Inglês'],
    consultationPrice: 25000,
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'dr-007',
    name: 'Dra. Fernanda Lima',
    crm: 'CRM/SP 789012',
    specialtyId: 'sp-006',
    specialtyName: 'Ginecologia',
    rating: 4.8,
    reviewCount: 389,
    bio: 'Ginecologista e obstetra com foco em saúde da mulher, climatério, endometriose e planejamento familiar.',
    education: ['UNIFESP – Medicina', 'Residência em Ginecologia e Obstetrícia – UNIFESP'],
    languages: ['Português', 'Inglês'],
    consultationPrice: 33000,
    availableDays: [1, 3, 4, 5],
  },
  {
    id: 'dr-008',
    name: 'Dr. André Takahashi',
    crm: 'CRM/SP 890123',
    specialtyId: 'sp-007',
    specialtyName: 'Oftalmologia',
    rating: 4.7,
    reviewCount: 274,
    bio: 'Oftalmologista especializado em cirurgia refrativa (LASIK), catarata e glaucoma.',
    education: ['UNICAMP – Medicina', 'Residência em Oftalmologia – UNICAMP'],
    languages: ['Português', 'Inglês', 'Japonês'],
    consultationPrice: 29000,
    availableDays: [2, 3, 4],
  },
  {
    id: 'dr-009',
    name: 'Dra. Camila Nunes',
    crm: 'CRM/SP 901234',
    specialtyId: 'sp-008',
    specialtyName: 'Psiquiatria',
    rating: 4.9,
    reviewCount: 318,
    bio: 'Psiquiatra com expertise em transtorno bipolar, depressão, ansiedade e transtorno do espectro autista.',
    education: ['FMUSP – Medicina', 'Residência em Psiquiatria – IPq-HCFMUSP'],
    languages: ['Português', 'Inglês'],
    consultationPrice: 38000,
    availableDays: [1, 2, 4, 5],
  },
];

// ─── Time Slot Generator ───────────────────────────────────────────────────────
const TIME_SLOTS_MORNING = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const TIME_SLOTS_AFTERNOON = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

export function generateTimeSlots(doctorId: string, date: string): TimeSlot[] {
  const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);
  if (!doctor) return [];

  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  if (!doctor.availableDays.includes(dayOfWeek)) return [];

  // Deterministically mark some slots as unavailable based on date+doctorId seed
  const seed = parseInt(doctorId.replace(/\D/g, '')) + parseInt(date.replace(/-/g, ''));
  const allSlots = [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON];

  return allSlots.map((time, index) => {
    const isUnavailable = (seed + index * 7) % 5 === 0;
    const [hour, min] = time.split(':').map(Number);
    const endMin = min + 30;
    const endHour = endMin >= 60 ? hour + 1 : hour;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;

    return {
      id: `slot-${doctorId}-${date}-${index}`,
      doctorId,
      date,
      startTime: time,
      endTime,
      isAvailable: !isUnavailable,
    };
  });
}

export function generateAvailableDates(doctorId: string, month: string): string[] {
  const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);
  if (!doctor) return [];

  const [year, mon] = month.split('-').map(Number);
  const dates: string[] = [];
  const daysInMonth = new Date(year, mon, 0).getDate();
  const today = startOfToday();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, mon - 1, day);
    if (date < today) continue;
    const dayOfWeek = date.getDay();
    if (doctor.availableDays.includes(dayOfWeek)) {
      dates.push(format(date, 'yyyy-MM-dd'));
    }
  }

  return dates;
}
