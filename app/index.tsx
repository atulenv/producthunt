import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import { useTranslate } from '../src/hooks/use-translate';
import { useAppStore } from '../src/store/use-app-store';

const AppLoader = () => {
  const router = useRouter();
  const { onboardingCompleted } = useAppStore();
  const t = useTranslate();
  const glow = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    const dotsAnim = Animated.loop(
      Animated.timing(dots, { toValue: 1, duration: 1800, useNativeDriver: true })
    );
    pulse.start();
    dotsAnim.start();
    return () => {
      pulse.stop();
      dotsAnim.stop();
    };
  }, [glow, dots]);

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace('/tabs/home');
    } else {
      router.replace('/screens/Permissions');
    }
  }, [onboardingCompleted, router]);

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const dotsOpacity = dots.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1, 0.2] });

  return (
    <LinearGradient colors={['#01060f', '#041a2d', '#051f33']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.logoWrapper, { transform: [{ scale: glowScale }] }]}>
            <Text style={styles.logo}>🛡️</Text>
          </Animated.View>
          <Text style={styles.title}>AroVate</Text>
          <Animated.Text style={[styles.tagline, { opacity: dotsOpacity }]}>
            {t('loading.tagline')}
          </Animated.Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    fontSize: 70,
  },
  title: {
    fontSize: Theme.font.size['2xl'],
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Theme.spacing.sm,
  },
});

export default AppLoader;
