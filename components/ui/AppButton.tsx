// UI Revamp - New AppButton component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { Theme } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  const iconElement = icon ? <View style={styles.iconSlot}>{icon}</View> : null;
  return (
    <TouchableOpacity style={[styles.button, styles[variant], fullWidth && styles.fullWidth, style]} onPress={onPress}>
      {iconPosition === 'left' ? iconElement : null}
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
      {iconPosition === 'right' ? iconElement : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Theme.spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sansBold,
  },
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  primaryText: {
    color: Theme.colors.white,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  secondaryText: {
    color: Theme.colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
  },
  ghostText: {
    color: Theme.colors.primary,
  },
  iconSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppButton;
