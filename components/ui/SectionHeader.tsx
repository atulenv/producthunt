import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, actionLabel, onActionPress, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textBlock}>
        <View style={styles.titleWrap}>
          <View style={styles.pulse} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  textBlock: {
    flex: 1,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  actionButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(85,99,255,0.08)',
  },
  actionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.sm,
  },
  pulse: {
    width: 32,
    height: 4,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent,
  },
});

export default SectionHeader;
