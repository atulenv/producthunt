import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import { useAppStore } from '../src/store/use-app-store';

const AppLoader = () => {
  const router = useRouter();
  const { onboardingCompleted } = useAppStore();

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace('/tabs/home');
    } else {
      router.replace('/screens/Permissions');
    }
  }, [onboardingCompleted, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.title}>AroVate</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.font.size['2xl'],
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.sm,
  },
});

export default AppLoader;
