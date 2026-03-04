import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, TimeSlot } from '../../../domain/entities';
import { useTheme } from '../../hooks';
import { BorderRadius, Spacing, Typography } from '../../theme';
import { Card, StatusBadge } from '../common';

// ─── TimeSlotGrid ─────────────────────────────────────────────────────────────
interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotGrid({ slots, selectedSlot, onSelect }: TimeSlotGridProps) {
  const { colors } = useTheme();

  const morning = slots.filter(s => parseInt(s.startTime) < 12);
  const afternoon = slots.filter(s => parseInt(s.startTime) >= 12);

  const renderGroup = (label: string, icon: string, group: TimeSlot[]) => {
    if (group.length === 0) return null;
    return (
      <View style={{ marginBottom: Spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Ionicons name={icon as any} size={16} color={colors.textSecondary} />
          <Text style={{ ...Typography.labelMedium, color: colors.textSecondary }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {group.map(slot => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAvailable = slot.isAvailable;
            return (
              <Pressable
                key={slot.id}
                onPress={() => isAvailable && onSelect(slot)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: BorderRadius.md,
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? colors.primary
                    : isAvailable
                    ? colors.border
                    : 'transparent',
                  backgroundColor: isSelected
                    ? colors.primary
                    : isAvailable
                    ? colors.surface
                    : `${colors.border}60`,
                  opacity: isAvailable ? 1 : 0.5,
                  minWidth: 76,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#FFFFFF' : isAvailable ? colors.text : colors.textMuted,
                  textDecorationLine: isAvailable ? 'none' : 'line-through',
                }}>
                  {slot.startTime}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  if (slots.length === 0) {
    return (
      <View style={{ padding: Spacing.xl, alignItems: 'center' }}>
        <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, marginTop: 8, textAlign: 'center' }}>
          Nenhum horário disponível nesta data
        </Text>
      </View>
    );
  }

  return (
    <View>
      {renderGroup('Manhã', 'sunny-outline', morning)}
      {renderGroup('Tarde', 'partly-sunny-outline', afternoon)}
    </View>
  );
}

// ─── WeekDayPicker ────────────────────────────────────────────────────────────
interface WeekDayPickerProps {
  selectedDate: string;
  availableDates: string[];
  onSelect: (date: string) => void;
}

export function WeekDayPicker({ selectedDate, availableDates, onSelect }: WeekDayPickerProps) {
  const { colors } = useTheme();
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  const formatDayLabel = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, 'EEE', { locale: ptBR });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}>
      {days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isAvailable = availableDates.includes(dateStr);
        const isSelected = selectedDate === dateStr;

        return (
          <Pressable
            key={dateStr}
            onPress={() => isAvailable && onSelect(dateStr)}
            style={{
              width: 56,
              paddingVertical: 10,
              borderRadius: BorderRadius.md,
              borderWidth: 1.5,
              borderColor: isSelected ? colors.primary : isAvailable ? colors.border : 'transparent',
              backgroundColor: isSelected ? colors.primary : isAvailable ? colors.surface : `${colors.border}40`,
              alignItems: 'center',
              opacity: isAvailable ? 1 : 0.45,
            }}
          >
            <Text style={{
              fontSize: 11, fontWeight: '600', textTransform: 'capitalize',
              color: isSelected ? '#FFFFFF' : isAvailable ? colors.textSecondary : colors.textMuted,
              marginBottom: 4,
            }}>
              {formatDayLabel(day)}
            </Text>
            <Text style={{
              fontSize: 18, fontWeight: '700',
              color: isSelected ? '#FFFFFF' : isAvailable ? colors.text : colors.textMuted,
            }}>
              {format(day, 'd')}
            </Text>
            {isAvailable && !isSelected && (
              <View style={{
                width: 4, height: 4, borderRadius: 2,
                backgroundColor: colors.secondary, marginTop: 3,
              }} />
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── AppointmentCard ──────────────────────────────────────────────────────────
interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  onCancel?: () => void;
}

export function AppointmentCard({ appointment, onPress, onCancel }: AppointmentCardProps) {
  const { colors } = useTheme();

  const date = parseISO(`${appointment.date}T${appointment.startTime}`);
  const dateLabel = isToday(date) ? 'Hoje' : isTomorrow(date) ? 'Amanhã'
    : format(date, "d 'de' MMMM", { locale: ptBR });
  const dayOfWeek = format(date, 'EEEE', { locale: ptBR });

  const initials = appointment.doctorName
    .split(' ')
    .filter((_, i) => i === 0 || i === 1)
    .map(n => n[0])
    .join('');

  const canCancel = appointment.status === 'scheduled' || appointment.status === 'confirmed';

  return (
    <Card onPress={onPress} style={{ marginBottom: Spacing.sm }}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm }}>
        <StatusBadge status={appointment.status} />
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {appointment.startTime} – {appointment.endTime}
        </Text>
      </View>

      {/* Doctor row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.sm }}>
        <View style={{
          width: 44, height: 44, borderRadius: 22,
          backgroundColor: `${colors.primary}20`,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.headlineSmall, color: colors.text }} numberOfLines={1}>
            {appointment.doctorName}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            {appointment.specialtyName}
          </Text>
        </View>
      </View>

      {/* Date info */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: `${colors.primary}10`,
        borderRadius: BorderRadius.sm,
        padding: 10,
      }}>
        <Ionicons name="calendar" size={16} color={colors.primary} />
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
          {dateLabel}, {dayOfWeek} • {appointment.startTime}
        </Text>
      </View>

      {/* Cancel button */}
      {canCancel && onCancel && (
        <TouchableOpacity
          onPress={onCancel}
          style={{ marginTop: 10, alignItems: 'center', padding: 8 }}
        >
          <Text style={{ color: colors.error, fontSize: 13, fontWeight: '600' }}>
            Cancelar consulta
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

// ─── PaymentMethodPicker ──────────────────────────────────────────────────────
type PaymentMethod = 'pix' | 'credit_card' | 'debit_card';

interface PaymentMethodPickerProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'pix', label: 'Pix', icon: 'qr-code', description: 'Pagamento instantâneo' },
  { id: 'credit_card', label: 'Cartão de Crédito', icon: 'card', description: 'Até 6x sem juros' },
  { id: 'debit_card', label: 'Cartão de Débito', icon: 'card-outline', description: 'Débito à vista' },
];

export function PaymentMethodPicker({ selected, onSelect }: PaymentMethodPickerProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      {PAYMENT_OPTIONS.map(opt => {
        const isSelected = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              padding: 14,
              borderRadius: BorderRadius.md,
              borderWidth: 1.5,
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? `${colors.primary}10` : colors.surface,
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: isSelected ? colors.primary : `${colors.primary}15`,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name={opt.icon as any} size={20}
                color={isSelected ? '#FFFFFF' : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: colors.text, fontSize: 15 }}>{opt.label}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 1 }}>{opt.description}</Text>
            </View>
            <View style={{
              width: 20, height: 20, borderRadius: 10,
              borderWidth: 2,
              borderColor: isSelected ? colors.primary : colors.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              {isSelected && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
