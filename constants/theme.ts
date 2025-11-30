// Enhanced Safety Theme - Tourist Safety App for India
import { Platform } from 'react-native';

const COLORS = {
  // Primary - Trust & Safety
  primary: '#1E40AF', // Deep blue - trust, safety
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  
  // Secondary - Calm & Support  
  secondary: '#0D9488', // Teal - calm, supportive
  secondaryLight: '#14B8A6',
  secondaryDark: '#0F766E',
  
  // Accent
  accent: '#6366F1', // Indigo
  
  // Emergency Colors
  emergency: '#DC2626', // Bright red for SOS
  emergencyLight: '#EF4444',
  emergencyDark: '#B91C1C',
  emergencyBg: '#FEE2E2',
  
  // Warning
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  warningBg: '#FEF3C7',
  
  // Success/Safe
  success: '#059669',
  successLight: '#10B981',
  successDark: '#047857',
  successBg: '#D1FAE5',
  
  // Risk Zone Colors
  riskCritical: '#DC2626',
  riskHigh: '#EA580C',
  riskMedium: '#F59E0B',
  riskLow: '#22C55E',
  
  // Backgrounds
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  
  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  subtleText: '#64748B',
  mutedText: '#94A3B8',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#0F172A',
  lightGray: '#E2E8F0',
  mediumGray: '#CBD5E1',
  darkGray: '#334155',
  
  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',
  
  // Legacy compatibility
  danger: '#DC2626',
  riskLowLegacy: '#FFD700',
  riskMediumLegacy: '#FFA500',
  riskHighLegacy: '#FF4500',
};

const FONT_FAMILY = {
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  sansBold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
};

const FONT_WEIGHT = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  emergency: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Theme = {
  colors: COLORS,
  font: {
    family: FONT_FAMILY,
    size: FONT_SIZE,
    weight: FONT_WEIGHT,
  },
  spacing: SPACING,
  radius: BORDER_RADIUS,
  shadows: SHADOWS,
};

export const Colors = {
  light: COLORS,
  dark: COLORS,
};
