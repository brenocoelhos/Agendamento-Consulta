import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme, useAvailableDates, useTimeSlots } from '../../src/presentation/hooks';
import { Spacing, Typography, BorderRadius } from '../../src/presentation/theme';
import { Button, Card, Divider, PriceTag } from '../../src/presentation/components/common';
import {
  WeekDayPicker, TimeSlotGrid, PaymentMethodPicker,
} from '../../src/presentation/components/scheduling';
import { TimeSlot } from '../../src/domain/entities';
import { format as fnsFormat } from 'date-fns';

type Step = 'date' | 'patient' | 'payment';

export default function BookingScreen() {
  const {
    doctorId, doctorName, specialtyId, specialtyName, consultationPrice,
  } = useLocalSearchParams<{
    doctorId: string; doctorName: string; specialtyId: string;
    specialtyName: string; consultationPrice: string;
  }>();

  const { colors } = useTheme();
  const priceInCents = parseInt(consultationPrice ?? '0');
  const currentMonth = fnsFormat(new Date(), 'yyyy-MM');

  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');

  // Patient form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientCpf, setPatientCpf] = useState('');
  const [notes, setNotes] = useState('');

  const availableDates = useAvailableDates(doctorId, currentMonth);
  const { slots, loading: loadingSlots } = useTimeSlots(doctorId, selectedDate);

  const STEPS = [
    { id: 'date' as Step, label: 'Data e Hora', icon: 'calendar' },
    { id: 'patient' as Step, label: 'Seus Dados', icon: 'person' },
    { id: 'payment' as Step, label: 'Pagamento', icon: 'card' },
  ];

  const currentStepIndex = STEPS.findIndex(s => s.id === step);

  const canProceedFromDate = selectedDate !== '' && selectedSlot !== null;
  const canProceedFromPatient = patientName.length > 3 && patientPhone.length >= 10 && patientCpf.length === 11;

  const handleNext = () => {
    if (step === 'date' && canProceedFromDate) setStep('patient');
    else if (step === 'patient' && canProceedFromPatient) setStep('payment');
    else if (step === 'payment') handleConfirm();
  };

  const handleConfirm = () => {
    router.push({
      pathname: '/(scheduling)/confirmation',
      params: {
        doctorId, doctorName, specialtyId, specialtyName,
        consultationPrice,
        date: selectedDate,
        startTime: selectedSlot!.startTime,
        endTime: selectedSlot!.endTime,
        patientName, patientPhone, patientEmail, patientCpf,
        notes, paymentMethod,
      },
    });
  };

  const formatPhoneInput = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return text;
  };

  const formatCpfInput = (text: string) => {
    return text.replace(/\D/g, '').slice(0, 11);
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    marginBottom: 12,
  };

  const labelStyle = {
    color: colors.textSecondary, fontSize: 13, fontWeight: '600' as const,
    marginBottom: 6, letterSpacing: 0.3,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: Spacing.md, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}>
          <TouchableOpacity onPress={() => step === 'date' ? router.back() : setStep(
            step === 'patient' ? 'date' : 'patient'
          )} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ ...Typography.headlineSmall, color: colors.text }}>Agendar Consulta</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{doctorName}</Text>
          </View>
        </View>

        {/* Step indicator */}
        <View style={{
          flexDirection: 'row', paddingHorizontal: Spacing.md,
          paddingVertical: 12, gap: 8, backgroundColor: colors.surface,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}>
          {STEPS.map((s, i) => {
            const isActive = s.id === step;
            const isDone = i < currentStepIndex;
            return (
              <View key={s.id} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <View style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: isActive ? colors.primary : isDone ? colors.success : colors.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDone
                    ? <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    : <Text style={{ color: isActive ? '#FFFFFF' : colors.textMuted, fontSize: 12, fontWeight: '700' }}>
                        {i + 1}
                      </Text>
                  }
                </View>
                <Text style={{
                  fontSize: 10, fontWeight: '600',
                  color: isActive ? colors.primary : isDone ? colors.success : colors.textMuted,
                }}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {step === 'date' && (
            <View style={{ paddingTop: Spacing.md }}>
              <View style={{ paddingHorizontal: Spacing.md, marginBottom: Spacing.md }}>
                <Text style={{ ...Typography.headlineMedium, color: colors.text, marginBottom: 4 }}>
                  Escolha a Data
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                  Selecione um dia disponível para sua consulta
                </Text>
              </View>

              <WeekDayPicker
                selectedDate={selectedDate}
                availableDates={availableDates}
                onSelect={date => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              />

              {selectedDate !== '' && (
                <View style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.lg }}>
                  <Text style={{ ...Typography.headlineMedium, color: colors.text, marginBottom: 4 }}>
                    Horários Disponíveis
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: Spacing.md }}>
                    {format(new Date(selectedDate + 'T12:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </Text>
                  {loadingSlots
                    ? <Text style={{ color: colors.textMuted }}>Carregando horários...</Text>
                    : <TimeSlotGrid slots={slots} selectedSlot={selectedSlot ?? undefined}
                        onSelect={setSelectedSlot} />
                  }
                </View>
              )}
            </View>
          )}

          {step === 'patient' && (
            <View style={{ padding: Spacing.md }}>
              <Text style={{ ...Typography.headlineMedium, color: colors.text, marginBottom: 4 }}>
                Seus Dados
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: Spacing.lg }}>
                Preencha para confirmar o agendamento
              </Text>

              <Text style={labelStyle}>Nome Completo *</Text>
              <TextInput
                style={inputStyle}
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />

              <Text style={labelStyle}>CPF *</Text>
              <TextInput
                style={inputStyle}
                value={patientCpf}
                onChangeText={v => setPatientCpf(formatCpfInput(v))}
                placeholder="00000000000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={11}
              />

              <Text style={labelStyle}>Telefone / WhatsApp *</Text>
              <TextInput
                style={inputStyle}
                value={patientPhone}
                onChangeText={v => setPatientPhone(formatPhoneInput(v))}
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />

              <Text style={labelStyle}>E-mail</Text>
              <TextInput
                style={inputStyle}
                value={patientEmail}
                onChangeText={setPatientEmail}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={labelStyle}>Observações (opcional)</Text>
              <TextInput
                style={[inputStyle, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Sintomas, histórico relevante..."
                placeholderTextColor={colors.textMuted}
                multiline
              />

              {/* Summary */}
              <Card style={{ marginTop: 8, backgroundColor: `${colors.primary}08` }}>
                <Text style={{ ...Typography.labelLarge, color: colors.primary, marginBottom: 10 }}>
                  Resumo da Consulta
                </Text>
                <View style={{ gap: 6 }}>
                  <InfoRow icon="person" label={doctorName ?? ''} colors={colors} />
                  <InfoRow icon="medical" label={specialtyName ?? ''} colors={colors} />
                  <InfoRow icon="calendar"
                    label={`${format(new Date(selectedDate + 'T12:00:00'), "d 'de' MMMM", { locale: ptBR })} às ${selectedSlot?.startTime}`}
                    colors={colors} />
                </View>
              </Card>
            </View>
          )}

          {step === 'payment' && (
            <View style={{ padding: Spacing.md }}>
              <Text style={{ ...Typography.headlineMedium, color: colors.text, marginBottom: 4 }}>
                Forma de Pagamento
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: Spacing.lg }}>
                Escolha como prefere pagar
              </Text>

              {/* Price */}
              <Card style={{
                marginBottom: Spacing.lg,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Valor da consulta</Text>
                <PriceTag amountCents={priceInCents} />
              </Card>

              <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />

              {/* Final summary */}
              <Card style={{ marginTop: Spacing.lg, gap: 8 }}>
                <Text style={{ ...Typography.labelLarge, color: colors.text, marginBottom: 4 }}>
                  Confirmação Final
                </Text>
                <InfoRow icon="person" label={patientName} colors={colors} />
                <InfoRow icon="person-circle" label={doctorName ?? ''} colors={colors} />
                <InfoRow icon="calendar"
                  label={`${format(new Date(selectedDate + 'T12:00:00'), "d 'de' MMMM", { locale: ptBR })} às ${selectedSlot?.startTime}`}
                  colors={colors} />
                <Divider style={{ marginVertical: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '700', color: colors.text, fontSize: 16 }}>Total</Text>
                  <PriceTag amountCents={priceInCents} />
                </View>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: Spacing.md,
          paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
          borderTopWidth: 1, borderTopColor: colors.border,
          backgroundColor: colors.surface,
        }}>
          <Button
            title={
              step === 'date' ? 'Continuar' :
              step === 'patient' ? 'Continuar' : 'Confirmar Agendamento'
            }
            onPress={handleNext}
            size="lg"
            fullWidth
            disabled={
              (step === 'date' && !canProceedFromDate) ||
              (step === 'patient' && !canProceedFromPatient)
            }
            icon={step === 'payment' ? 'checkmark-circle' : 'arrow-forward'}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, colors }: { icon: string; label: string; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon as any} size={14} color={colors.textMuted} />
      <Text style={{ color: colors.textSecondary, fontSize: 13, flex: 1 }}>{label}</Text>
    </View>
  );
}
