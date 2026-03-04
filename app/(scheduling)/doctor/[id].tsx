import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, useDoctor } from '../../../src/presentation/hooks';
import { Spacing, Typography, BorderRadius } from '../../../src/presentation/theme';
import { Button, Card, LoadingSpinner, StarRating, PriceTag } from '../../../src/presentation/components/common';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { doctor, loading } = useDoctor(id);

  if (loading || !doctor) return <LoadingSpinner message="Carregando médico..." />;

  const initials = doctor.name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ ...Typography.headlineSmall, color: colors.text, flex: 1 }}>
          Perfil do Médico
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={{
          backgroundColor: colors.primary,
          paddingHorizontal: Spacing.md,
          paddingTop: Spacing.xl,
          paddingBottom: 36,
          alignItems: 'center',
        }}>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
            marginBottom: Spacing.md,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '700' }}>{initials}</Text>
          </View>
          <Text style={{ ...Typography.headlineLarge, color: '#FFFFFF', textAlign: 'center' }}>
            {doctor.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 4 }}>
            {doctor.specialtyName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>
            {doctor.crm}
          </Text>
          <View style={{ flexDirection: 'row', gap: 20, marginTop: Spacing.md }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18 }}>
                  {doctor.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                {doctor.reviewCount} avaliações
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18 }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(doctor.consultationPrice / 100)}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                por consulta
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: Spacing.md, gap: Spacing.md }}>
          {/* Bio */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 8 }}>
              Sobre o Médico
            </Text>
            <Text style={{ color: colors.textSecondary, lineHeight: 22, fontSize: 15 }}>
              {doctor.bio}
            </Text>
          </Card>

          {/* Formation */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 12 }}>
              Formação
            </Text>
            {doctor.education.map((edu, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                <View style={{
                  width: 6, height: 6, borderRadius: 3, marginTop: 8,
                  backgroundColor: colors.primary,
                }} />
                <Text style={{ color: colors.textSecondary, flex: 1, fontSize: 14, lineHeight: 20 }}>
                  {edu}
                </Text>
              </View>
            ))}
          </Card>

          {/* Languages */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 12 }}>
              Idiomas
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {doctor.languages.map((lang, i) => (
                <View key={i} style={{
                  backgroundColor: `${colors.primary}15`,
                  borderRadius: BorderRadius.full,
                  paddingHorizontal: 14, paddingVertical: 6,
                }}>
                  <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Schedule info */}
          <Card>
            <Text style={{ ...Typography.headlineSmall, color: colors.text, marginBottom: 12 }}>
              Disponibilidade
            </Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => {
                const available = doctor.availableDays.includes(i);
                return (
                  <View key={i} style={{
                    width: 36, height: 36, borderRadius: 8,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: available ? `${colors.primary}20` : colors.borderLight,
                    borderWidth: 1,
                    borderColor: available ? `${colors.primary}40` : colors.border,
                  }}>
                    <Text style={{
                      fontSize: 11, fontWeight: '600',
                      color: available ? colors.primary : colors.textMuted,
                    }}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.md,
        borderTopWidth: 1, borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Button
          title="Agendar Consulta"
          onPress={() => router.push({
            pathname: '/(scheduling)/booking',
            params: {
              doctorId: doctor.id,
              doctorName: doctor.name,
              specialtyId: doctor.specialtyId,
              specialtyName: doctor.specialtyName,
              consultationPrice: doctor.consultationPrice.toString(),
            }
          })}
          size="lg"
          fullWidth
          icon="calendar"
        />
      </View>
    </SafeAreaView>
  );
}
