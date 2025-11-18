// UI Revamp - New Card component
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Theme } from '@/constants/theme';

type CardProps = ViewProps & {
  children: React.ReactNode;
  radius?: 'md' | 'lg' | 'xl';
};

const radiusMap = {
  md: Theme.radius.md,
  lg: Theme.radius.lg,
  xl: Theme.radius.xl,
} as const;

const Card: React.FC<CardProps> = ({ children, style, radius = 'lg', ...props }) => {
  return (
    <View style={[styles.card, { borderRadius: radiusMap[radius] }, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(18,24,38,0.04)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
});

export default Card;
