import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

type Props = {
  size?: number;
  label?: string;
  style?: ViewStyle;
  showLabel?: boolean;
  variant?: 'primary' | 'ghost';
};

const gradientMap = {
  primary: ['#4A5BFF', '#7C3AED'],
  ghost: ['rgba(74,91,255,0.15)', 'rgba(124,58,237,0.15)'],
} as const;

const BrandMark: React.FC<Props> = ({
  size = 40,
  label = 'AroVate Command',
  style,
  showLabel = true,
  variant = 'primary',
}) => {
  const badgeSize = size;
  const iconSize = Math.round(size * 0.58);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientMap[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.badge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}
      >
        <Ionicons name="shield-checkmark" size={iconSize} color={Theme.colors.white} />
      </LinearGradient>
      {showLabel ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.sm,
    color: Theme.colors.text,
    letterSpacing: 0.5,
  },
});

export default BrandMark;
