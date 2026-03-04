import React, { useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme, useAppointments } from '../../src/presentation/hooks';
import { Spacing, Typography, BorderRadius } from '../../src/presentation/theme';
import { LoadingSpinner, EmptyState, Button } from '../../src/presentation/components/common';
import { AppointmentCard } from '../../src/presentation/components/scheduling';
import { Appointment } from '../../src/domain/entities';

type FilterType = 'upcoming' | 'past' | 'cancelled';

export default function AppointmentsScreen() {
  const { colors } = useTheme();
  const { appointments, loading, cancel, reload } = useAppointments();
  const [filter, setFilter] = useState<FilterType>('upcoming');

  const now = new Date();

  const filtered = appointments.filter(a => {
    const apptDate = parseISO(`${a.date}T${a.startTime}`);
    switch (filter) {
      case 'upcoming':
        return a.status !== 'cancelled' && isAfter(apptDate, now);
      case 'past':
        return a.status !== 'cancelled' && !isAfter(apptDate, now);
      case 'cancelled':
        return a.status === 'cancelled';
    }
  });

  const handleCancel = (appointment: Appointment) => {
    Alert.alert(
      'Cancelar Consulta',
      `Deseja cancelar a consulta com ${appointment.doctorName}?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Cancelar Consulta',
          style: 'destructive',
          onPress: () => cancel(appointment.id, appointment.notificationId),
        },
      ]
    );
  };

  const FILTERS: { id: FilterType; label: string }[] = [
    { id: 'upcoming', label: 'Próximas' },
    { id: 'past', label: 'Anteriores' },
    { id: 'cancelled', label: 'Canceladas' },
  ];

  if (loading) return <LoadingSpinner message="Carregando consultas..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
        <Text style={{ ...Typography.displaySmall, color: colors.text, marginBottom: Spacing.md }}>
          Minhas Consultas
        </Text>

        {/* Filter Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.md,
          padding: 4,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: Spacing.md,
        }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: BorderRadius.sm,
                backgroundColor: filter === f.id ? colors.primary : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontWeight: '600', fontSize: 13,
                color: filter === f.id ? '#FFFFFF' : colors.textSecondary,
              }}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingHorizontal: Spacing.md,
          paddingBottom: 100,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => {}}
            onCancel={
              item.status === 'scheduled' || item.status === 'confirmed'
                ? () => handleCancel(item)
                : undefined
            }
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon={
              filter === 'upcoming' ? 'calendar-outline' :
              filter === 'past' ? 'time-outline' : 'close-circle-outline'
            }
            title={
              filter === 'upcoming' ? 'Nenhuma consulta agendada' :
              filter === 'past' ? 'Sem consultas anteriores' : 'Nenhuma consulta cancelada'
            }
            subtitle={
              filter === 'upcoming'
                ? 'Agende sua primeira consulta e cuide da sua saúde!'
                : undefined
            }
            action={
              filter === 'upcoming'
                ? { label: 'Agendar Consulta', onPress: () => router.push('/(tabs)/specialties') }
                : undefined
            }
          />
        )}
      />
    </SafeAreaView>
  );
}
