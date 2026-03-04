import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor, Specialty } from '../../../domain/entities';
import { useTheme } from '../../hooks';
import { BorderRadius, Spacing, Typography } from '../../theme';
import { Badge, Card, PriceTag, StarRating } from '../common';

// ─── DoctorCard ───────────────────────────────────────────────────────────────
interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  specialty?: Specialty;
}

export function DoctorCard({ doctor, onPress, specialty }: DoctorCardProps) {
  const { colors } = useTheme();
  const initials = doctor.name
    .split(' ')
    .filter((_, i) => i === 0 || i === 1)
    .map(n => n[0])
    .join('');

  return (
    <Card onPress={onPress} style={{ marginBottom: Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        {/* Avatar */}
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: `${colors.primary}20`,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: `${colors.primary}30`,
        }}>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '700' }}>
            {initials}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.headlineSmall, color: colors.text }} numberOfLines={1}>
            {doctor.name}
          </Text>
          <Text style={{ ...Typography.bodySmall, color: colors.textSecondary, marginVertical: 2 }}>
            {doctor.specialtyName} • {doctor.crm}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <StarRating rating={doctor.rating} count={doctor.reviewCount} />
            <PriceTagInline amountCents={doctor.consultationPrice} />
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>

      {specialty && (
        <View style={{ marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: specialty.color,
            }} />
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{specialty.name}</Text>
          </View>
        </View>
      )}
    </Card>
  );
}

function PriceTagInline({ amountCents }: { amountCents: number }) {
  const { colors } = useTheme();
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(amountCents / 100);
  return (
    <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '600' }}>
      {formatted}
    </Text>
  );
}

// ─── SpecialtyCard ────────────────────────────────────────────────────────────
interface SpecialtyCardProps {
  specialty: Specialty;
  onPress: () => void;
  doctorCount?: number;
}

export function SpecialtyCard({ specialty, onPress, doctorCount }: SpecialtyCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Card onPress={onPress} style={{ width: 150, marginRight: Spacing.sm }}>
      <View style={{
        width: 48, height: 48, borderRadius: 16,
        backgroundColor: `${specialty.color}25`,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      }}>
        <Ionicons name={specialty.icon as any} size={26} color={specialty.color} />
      </View>
      <Text style={{ ...Typography.labelLarge, color: colors.text, marginBottom: 4 }} numberOfLines={2}>
        {specialty.name}
      </Text>
      {doctorCount !== undefined && (
        <Text style={{ ...Typography.bodySmall, color: colors.textMuted }}>
          {doctorCount} médico{doctorCount !== 1 ? 's' : ''}
        </Text>
      )}
    </Card>
  );
}

// ─── SpecialtyListItem ────────────────────────────────────────────────────────
export function SpecialtyListItem({
  specialty, onPress, doctorCount,
}: SpecialtyCardProps) {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} style={{ marginBottom: Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <View style={{
          width: 52, height: 52, borderRadius: 16,
          backgroundColor: `${specialty.color}20`,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={specialty.icon as any} size={28} color={specialty.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.headlineSmall, color: colors.text }}>{specialty.name}</Text>
          <Text style={{ ...Typography.bodySmall, color: colors.textSecondary, marginTop: 2 }}
            numberOfLines={1}>
            {specialty.description}
          </Text>
          {doctorCount !== undefined && (
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
              {doctorCount} médico{doctorCount !== 1 ? 's' : ''} disponível{doctorCount !== 1 ? 'is' : ''}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Card>
  );
}
