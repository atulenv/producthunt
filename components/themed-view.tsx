import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function ThemedView({ style, ...rest }: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundStyle = colorScheme === 'dark' ? styles.dark : styles.light;

  return <View {...rest} style={[backgroundStyle, style]} />;
}

const styles = StyleSheet.create({
  light: {
    backgroundColor: Theme.colors.card,
  },
  dark: {
    backgroundColor: Theme.colors.black,
  },
});
