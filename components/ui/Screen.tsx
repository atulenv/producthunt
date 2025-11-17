// UI Revamp - New Screen component
import React from 'react';
import { View, StyleSheet, ViewProps, SafeAreaView } from 'react-native';
import { Theme } from '@/constants/theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

const Screen: React.FC<ScreenProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  screen: {
    flex: 1,
    padding: Theme.spacing.md,
  },
});

export default Screen;
