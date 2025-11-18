import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

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

  const textColor = completed || isPressing ? Theme.colors.white : Theme.colors.text;

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolation }]} />
        <Text style={[styles.text, { color: textColor }]}>
          {completed ? 'SOS dispatched' : isPressing ? 'Keep holding…' : label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  track: {
    height: 56,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(15,23,42,0.08)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.danger,
  },
  text: {
    fontFamily: Theme.font.family.sansBold,
    zIndex: 1,
  },
});

export default PanicSlider;
