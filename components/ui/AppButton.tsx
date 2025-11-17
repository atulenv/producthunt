// UI Revamp - New AppButton component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '@/constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, styles[variant], style]} onPress={onPress}>
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  ghostText: {
    color: Theme.colors.primary,
  },
});

export default AppButton;
