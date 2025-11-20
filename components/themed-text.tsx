import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TextType = 'default' | 'defaultSemiBold' | 'subtitle' | 'title';

type Props = TextProps & {
  type?: TextType;
};

const typeStyles: Record<TextType, { fontFamily: string; fontSize: number }> = {
  default: {
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.md,
  },
  defaultSemiBold: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
  },
  subtitle: {
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.sm,
  },
  title: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
  },
};

export function ThemedText({ style, type = 'default', ...rest }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const color = colorScheme === 'dark' ? Theme.colors.white : Theme.colors.text;

  return <Text {...rest} style={[styles.base, { color }, typeStyles[type], style]} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
