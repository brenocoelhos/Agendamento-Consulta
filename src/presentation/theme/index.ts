export const Colors = {
  light: {
    // Brand
    primary: '#0A5C8A',
    primaryLight: '#1A7FBF',
    primaryDark: '#064470',
    secondary: '#00B8A9',
    accent: '#F6A623',

    // Backgrounds
    background: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverted: '#FFFFFF',

    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Status
    scheduled: '#3B82F6',
    confirmed: '#10B981',
    cancelled: '#EF4444',
    completed: '#6B7280',

    // Tab bar
    tabBackground: '#FFFFFF',
    tabBorder: '#E5E7EB',
    tabActive: '#0A5C8A',
    tabInactive: '#9CA3AF',

    // Shadows
    shadowColor: '#000000',
  },
  dark: {
    // Brand
    primary: '#1A7FBF',
    primaryLight: '#2D9FE0',
    primaryDark: '#0A5C8A',
    secondary: '#00B8A9',
    accent: '#F6A623',

    // Backgrounds
    background: '#0F1117',
    surface: '#1A1D2E',
    surfaceElevated: '#21253A',
    card: '#1E2234',

    // Text
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    textInverted: '#111827',

    // Borders
    border: '#2D3148',
    borderLight: '#252840',

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Status
    scheduled: '#3B82F6',
    confirmed: '#10B981',
    cancelled: '#EF4444',
    completed: '#6B7280',

    // Tab bar
    tabBackground: '#1A1D2E',
    tabBorder: '#2D3148',
    tabActive: '#1A7FBF',
    tabInactive: '#6B7280',

    // Shadows
    shadowColor: '#000000',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Typography = {
  displayLarge: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
  displayMedium: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  displaySmall: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  headlineLarge: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  headlineMedium: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  headlineSmall: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  labelLarge: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  labelMedium: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  labelSmall: { fontSize: 10, fontWeight: '600' as const, lineHeight: 14 },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
