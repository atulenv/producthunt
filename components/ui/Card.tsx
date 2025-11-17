// UI Revamp - New Card component
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Theme } from '@/constants/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.md,
  },
});

export default Card;
