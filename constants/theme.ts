// UI Revamp – new theme styles.
import { Platform } from 'react-native';

const COLORS = {
  primary: '#5563FF',
  secondary: '#FF8DA1',
  accent: '#7C3AED',

  background: '#EEF2FF',
  card: '#FFFFFF',
  text: '#121826',
  subtleText: '#5F6B8A',

  white: '#FFFFFF',
  lightGray: '#E4E8F6',
  mediumGray: '#C7CEF0',
  darkGray: '#3E4A66',

  black: '#0F172A',

  // Risk-related colors
  riskLow: '#FFD700', // Gold/Yellow
  riskMedium: '#FFA500', // Orange
  riskHigh: '#FF4500', // OrangeRed

  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F43F5E',
};

const FONT_FAMILY = {
  sans: Platform.select({
    ios: 'Roboto-Regular',
    android: 'Roboto-Regular',
    default: 'sans-serif',
  }),
  sansBold: Platform.select({
    ios: 'Roboto-Bold',
    android: 'Roboto-Bold',
    default: 'sans-serif-bold',
  }),
  mono: Platform.select({
    ios: 'Menlo-Regular',
    android: 'monospace',
    default: 'monospace',
  }),
};

const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

const FONT_WEIGHT = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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

// Provide a light/dark colors object for legacy helpers that expect Colors.light / Colors.dark
export const Colors = {
  light: COLORS,
  dark: COLORS,
};
