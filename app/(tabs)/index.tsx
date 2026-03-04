import React from 'react';
import {
  ScrollView, View, Text, Pressable, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme, useSpecialties, useDoctors, useAppointments } from '../../src/presentation/hooks';
import { Spacing, Typography } from '../../src/presentation/theme';
import {
  Card, SectionHeader, LoadingSpinner, EmptyState, StatusBadge,
} from '../../src/presentation/components/common';
import { SpecialtyCard, DoctorCard } from '../../src/presentation/components/doctors';
import { MOCK_DOCTORS } from '../../src/data/mock/data';
import { parseISO, isAfter } from 'date-fns';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { specialties, loading: loadingSpec } = useSpecialties();
  const { doctors } = useDoctors();
  const { appointments, reload } = useAppointments();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const upcomingAppointments = appointments
    .filter(a => a.status !== 'cancelled' && isAfter(
      parseISO(`${a.date}T${a.startTime}`), new Date()
    ))
    .slice(0, 2);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
          tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={{
          backgroundColor: colors.primary,
          paddingHorizontal: Spacing.md,
          paddingTop: Spacing.md,
          paddingBottom: 48,
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textTransform: 'capitalize', marginBottom: 4 }}>
            {today}
          </Text>
          <Text style={{ ...Typography.displaySmall, color: '#FFFFFF' }}>
            Olá! 👋
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4 }}>
            Cuide da sua saúde com facilidade
          </Text>

          {/* Search bar (decorative) */}
          <Pressable
            onPress={() => router.push('/(tabs)/specialties')}
            style={{
              marginTop: Spacing.lg,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 14,
              gap: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
              Buscar especialidade ou médico...
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: -28, paddingHorizontal: Spacing.md }}>
          {/* Quick Actions */}
          <View style={{
            flexDirection: 'row', gap: 10, marginBottom: Spacing.lg,
          }}>
            {[
              { label: 'Agendar\nConsulta', icon: 'add-circle', route: '/(tabs)/specialties', color: colors.primary },
              { label: 'Meus\nAgendamentos', icon: 'calendar', route: '/(tabs)/appointments', color: colors.secondary },
              { label: 'Todas\nEspecialidades', icon: 'medical', route: '/(tabs)/specialties', color: colors.accent },
            ].map((action, i) => (
              <Pressable
                key={i}
                onPress={() => router.push(action.route as any)}
                style={({ pressed }) => ({
                  flex: 1, backgroundColor: colors.card, borderRadius: 14,
                  padding: 14, alignItems: 'center', gap: 8,
                  opacity: pressed ? 0.9 : 1,
                  borderWidth: 1, borderColor: colors.border,
                })}
              >
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: `${action.color}15`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={{
                  color: colors.text, fontSize: 11, fontWeight: '600',
                  textAlign: 'center', lineHeight: 16,
                }}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <View style={{ marginBottom: Spacing.xl }}>
              <SectionHeader
                title="Próximas Consultas"
                action={{ label: 'Ver todas', onPress: () => router.push('/(tabs)/appointments') }}
              />
              {upcomingAppointments.map(appointment => {
                const apptDate = parseISO(`${appointment.date}T${appointment.startTime}`);
                const dateStr = format(apptDate, "d 'de' MMM, HH:mm", { locale: ptBR });
                const initials = appointment.doctorName.split(' ').slice(0, 2).map((n: string) => n[0]).join('');

                return (
                  <Card
                    key={appointment.id}
                    onPress={() => router.push('/(tabs)/appointments')}
                    style={{ marginBottom: Spacing.sm }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{
                        width: 48, height: 48, borderRadius: 24,
                        backgroundColor: `${colors.primary}20`,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>{initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: colors.text, fontSize: 15 }} numberOfLines={1}>
                          {appointment.doctorName}
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                          {appointment.specialtyName}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        <StatusBadge status={appointment.status} />
                        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{dateStr}</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}

          {/* Specialties Horizontal */}
          <View style={{ marginBottom: Spacing.xl }}>
            <SectionHeader
              title="Especialidades"
              action={{ label: 'Ver todas', onPress: () => router.push('/(tabs)/specialties') }}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: Spacing.md }}>
              {specialties.slice(0, 6).map(specialty => {
                const count = doctors.filter(d => d.specialtyId === specialty.id).length;
                return (
                  <SpecialtyCard
                    key={specialty.id}
                    specialty={specialty}
                    doctorCount={count}
                    onPress={() => router.push({
                      pathname: '/(tabs)/specialties',
                      params: { selectedId: specialty.id }
                    })}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* Featured Doctors */}
          <View style={{ marginBottom: Spacing.xl }}>
            <SectionHeader
              title="Médicos em Destaque"
              subtitle="Melhor avaliados pelos pacientes"
            />
            {doctors
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => router.push({
                    pathname: '/(scheduling)/doctor/[id]',
                    params: { id: doctor.id }
                  })}
                />
              ))
            }
          </View>

          {/* Clinic Info Banner */}
          <Card style={{
            marginBottom: Spacing.xl,
            backgroundColor: `${colors.primary}10`,
            borderWidth: 1,
            borderColor: `${colors.primary}30`,
          }}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: `${colors.primary}20`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="business" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...Typography.headlineSmall, color: colors.primary }}>
                  Clínica Saúde
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4, lineHeight: 18 }}>
                  Rua das Flores, 1234 – Centro{'\n'}
                  Seg–Sex: 07h–19h • Sáb: 08h–14h{'\n'}
                  📞 (11) 3000-0000
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
