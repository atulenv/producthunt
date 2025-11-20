import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, actionLabel, onActionPress, style, icon }) => {
  const renderIndicator = () => {
    if (icon) {
      return (
        <View style={styles.iconBubble}>
          <Ionicons name={icon} size={16} color={Theme.colors.primary} />
        </View>
      );
    }
    return <View style={styles.pulse} />;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textBlock}>
        <View style={styles.titleWrap}>
          {renderIndicator()}
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
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
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
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(85,99,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SectionHeader;
