import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';

type Props = {
  label: string;
  onActivate?: () => void;
  duration?: number;
};

const PanicSlider: React.FC<Props> = ({ label, onActivate, duration = 2200 }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  const animateTo = (value: number, animDuration: number) => {
    animationRef.current?.stop();
    animationRef.current = Animated.timing(progress, {
      toValue: value,
      duration: animDuration,
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished && value === 1) {
        setCompleted(true);
        setIsPressing(false);
        onActivate?.();
        setTimeout(() => {
          Animated.timing(progress, {
            toValue: 0,
            duration: 350,
            useNativeDriver: false,
          }).start(() => setCompleted(false));
        }, 600);
      }
    });
  };

  const handlePressIn = () => {
    setIsPressing(true);
    setCompleted(false);
    animateTo(1, duration);
  };

  const handlePressOut = () => {
    setIsPressing(false);
    if (!completed) {
      animateTo(0, 200);
    }
  };

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['rgba(220, 38, 38, 0.1)', 'rgba(220, 38, 38, 0.5)', Theme.colors.emergency],
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolation, backgroundColor }]} />
        <View style={styles.content}>
          <Ionicons
            name={completed ? 'checkmark-circle' : isPressing ? 'time' : 'alert-circle'}
            size={24}
            color={isPressing || completed ? Theme.colors.white : Theme.colors.emergency}
          />
          <Text style={[styles.text, (isPressing || completed) && styles.textActive]}>
            {completed ? 'SOS Dispatched!' : isPressing ? 'Keep holding...' : label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  track: {
    height: 60,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.emergencyBg,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.emergency,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    zIndex: 1,
  },
  text: {
    fontWeight: '700',
    fontSize: Theme.font.size.md,
    color: Theme.colors.emergency,
  },
  textActive: {
    color: Theme.colors.white,
  },
});

export default PanicSlider;
