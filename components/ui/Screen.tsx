// UI Revamp - New Screen component
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

const Screen: React.FC<ScreenProps> = ({ children, style, ...props }) => {
  return (
    <LinearGradient colors={['#eef2ff', '#fafbff']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.screen, style]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
    padding: Theme.spacing.md,
  },
});

export default Screen;
