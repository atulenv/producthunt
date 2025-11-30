import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '../../constants/theme';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined';
};

const Card: React.FC<CardProps> = ({ children, style, radius = 'lg', variant = 'default' }) => {
  const radiusValue = Theme.radius[radius];

  return (
    <View
      style={[
        styles.card,
        { borderRadius: radiusValue },
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  elevated: {
    ...Theme.shadows.lg,
  },
  outlined: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
});

export default Card;
