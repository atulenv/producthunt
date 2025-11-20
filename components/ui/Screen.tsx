// UI Revamp - New Screen component
import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  footerInset?: number;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  contentStyle,
  footerInset = 0,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const footerSpacing = footerInset + insets.bottom;

  return (
    <LinearGradient colors={['#eef2ff', '#f5e9ff', '#fff4eb']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.screen, { paddingBottom: Theme.spacing.md + footerSpacing }, style]} {...props}>
          <View style={[styles.content, contentStyle]}>{children}</View>
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
    gap: Theme.spacing.md,
  },
  content: {
    flex: 1,
    width: '100%',
  },
});

export default Screen;
