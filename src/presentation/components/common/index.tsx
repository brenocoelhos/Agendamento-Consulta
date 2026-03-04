import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { BorderRadius, Spacing, Typography } from '../../theme';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title, onPress, variant = 'primary', size = 'md',
  disabled, loading, icon, fullWidth, style,
}: ButtonProps) {
  const { colors } = useTheme();

  const heights = { sm: 36, md: 48, lg: 56 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };
  const paddings = { sm: 12, md: 20, lg: 24 };

  const getBg = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'danger': return colors.error;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      default: return '#FFFFFF';
    }
  };

  const getBorder = () => {
    if (variant === 'outline') return { borderWidth: 1.5, borderColor: colors.primary };
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: getBg(),
          height: heights[size],
          borderRadius: BorderRadius.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: paddings[size],
          opacity: pressed ? 0.85 : 1,
          ...(fullWidth && { width: '100%' }),
          ...getBorder(),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'lg' ? 20 : 18}
              color={getTextColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={{
            color: getTextColor(),
            fontSize: fontSizes[size],
            fontWeight: '600',
            letterSpacing: 0.2,
          }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export function Card({ children, style, onPress, elevated }: CardProps) {
  const { colors, isDark } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: elevated ? colors.surfaceElevated : colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
    ...(Platform.OS === 'ios' && !isDark && {
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    }),
    ...(Platform.OS === 'android' && !isDark && { elevation: 2 }),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.95 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, textColor, size = 'md' }: BadgeProps) {
  const { colors } = useTheme();
  return (
    <View style={{
      backgroundColor: color ? `${color}20` : `${colors.primary}20`,
      borderRadius: BorderRadius.full,
      paddingHorizontal: size === 'sm' ? 8 : 12,
      paddingVertical: size === 'sm' ? 2 : 4,
      alignSelf: 'flex-start',
    }}>
      <Text style={{
        color: textColor ?? color ?? colors.primary,
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: '600',
        letterSpacing: 0.3,
      }}>
        {label}
      </Text>
    </View>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={14} color="#F59E0B" />
      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
        {rating.toFixed(1)}
      </Text>
      {count !== undefined && (
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          ({count})
        </Text>
      )}
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <View style={[{ height: 1, backgroundColor: colors.border }, style]} />
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: Spacing.md }}>
      <View style={{ flex: 1 }}>
        <Text style={{ ...Typography.headlineMedium, color: colors.text }}>{title}</Text>
        {subtitle && (
          <Text style={{ ...Typography.bodySmall, color: colors.textMuted, marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.xl }}>
      <View style={{
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: `${colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: Spacing.md,
      }}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={{ ...Typography.headlineSmall, color: colors.text, textAlign: 'center' }}>{title}</Text>
      {subtitle && (
        <Text style={{ ...Typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
          {subtitle}
        </Text>
      )}
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          style={{ marginTop: Spacing.lg }}
        />
      )}
    </View>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
  pending: 'Pendente',
  paid: 'Pago',
  failed: 'Falhou',
};

export function StatusBadge({ status }: { status: string }) {
  const { colors } = useTheme();
  const colorMap: Record<string, string> = {
    scheduled: colors.scheduled,
    confirmed: colors.confirmed,
    cancelled: colors.cancelled,
    completed: colors.completed,
    pending: colors.warning,
    paid: colors.success,
    failed: colors.error,
  };
  const c = colorMap[status] ?? colors.textMuted;
  return <Badge label={STATUS_LABELS[status] ?? status} color={c} />;
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
export function LoadingSpinner({ message }: { message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{message}</Text>}
    </View>
  );
}

// ─── PriceTag ─────────────────────────────────────────────────────────────────
export function PriceTag({ amountCents }: { amountCents: number }) {
  const { colors } = useTheme();
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(amountCents / 100);
  return (
    <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700' }}>{formatted}</Text>
  );
}
