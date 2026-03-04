import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme, useSpecialties, useDoctors } from '../../src/presentation/hooks';
import { Spacing, Typography, BorderRadius } from '../../src/presentation/theme';
import { LoadingSpinner, SectionHeader } from '../../src/presentation/components/common';
import { SpecialtyListItem, DoctorCard } from '../../src/presentation/components/doctors';
import { Specialty } from '../../src/domain/entities';

export default function SpecialtiesScreen() {
  const { colors } = useTheme();
  const { specialties, loading } = useSpecialties();
  const { doctors } = useDoctors();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const filteredSpecialties = specialties.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDoctors = selectedSpecialty
    ? doctors.filter(d => d.specialtyId === selectedSpecialty.id)
    : doctors.filter(d =>
        search.length > 0 && d.name.toLowerCase().includes(search.toLowerCase())
      );

  const getDoctorCount = (specialtyId: string) =>
    doctors.filter(d => d.specialtyId === specialtyId).length;

  if (loading) return <LoadingSpinner message="Carregando especialidades..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm }}>
        {selectedSpecialty ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.md }}>
            <TouchableOpacity
              onPress={() => setSelectedSpecialty(null)}
              style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ ...Typography.headlineMedium, color: colors.text }}>
                {selectedSpecialty.name}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                {getDoctorCount(selectedSpecialty.id)} médico(s)
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ ...Typography.displaySmall, color: colors.text, marginBottom: Spacing.md }}>
            Especialidades
          </Text>
        )}

        {/* Search */}
        {!selectedSpecialty && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: colors.surface, borderRadius: BorderRadius.md,
            paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border,
            height: 48,
          }}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar especialidade ou médico..."
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, color: colors.text, fontSize: 15 }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      {selectedSpecialty ? (
        /* Doctor list for selected specialty */
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => router.push({
                pathname: '/(scheduling)/doctor/[id]',
                params: { id: item.id }
              })}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 15 }}>
                Nenhum médico encontrado
              </Text>
            </View>
          )}
        />
      ) : search.length > 0 && filteredDoctors.length > 0 ? (
        /* Doctor search results */
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item.id}
          ListHeaderComponent={() => (
            <View style={{ paddingHorizontal: Spacing.md, marginBottom: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                {filteredDoctors.length} médico(s) encontrado(s)
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => router.push({
                pathname: '/(scheduling)/doctor/[id]',
                params: { id: item.id }
              })}
            />
          )}
        />
      ) : (
        /* Specialty list */
        <FlatList
          data={filteredSpecialties}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <SpecialtyListItem
              specialty={item}
              doctorCount={getDoctorCount(item.id)}
              onPress={() => setSelectedSpecialty(item)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 15 }}>
                Nenhuma especialidade encontrada
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
