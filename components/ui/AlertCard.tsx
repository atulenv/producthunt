import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/theme';
import { SafetyAlert } from '@/src/lib/safety-data';

type Props = {
  alert: SafetyAlert;
  onViewMap?: (alert: SafetyAlert) => void;
};

const levelConfig = {
  critical: {
    background: 'rgba(244,67,54,0.12)',
    accent: Theme.colors.danger,
    label: 'Critical',
    icon: 'flame-outline',
  },
  warning: {
    background: 'rgba(255,193,7,0.15)',
    accent: Theme.colors.warning,
    label: 'Warning',
    icon: 'alert-circle-outline',
  },
  info: {
    background: 'rgba(63,81,181,0.15)',
    accent: Theme.colors.secondary,
    label: 'Info',
    icon: 'information-circle-outline',
  },
} as const;

const AlertCard: React.FC<Props> = ({ alert, onViewMap }) => {
  const config = levelConfig[alert.level];
  return (
    <View style={[styles.card, { backgroundColor: config.background }]}>
      <View style={styles.header}>
        <View style={[styles.levelPill, { backgroundColor: config.accent }]}>
          <Ionicons name={config.icon as any} size={16} color={Theme.colors.white} />
          <Text style={styles.levelText}>{config.label}</Text>
        </View>
        <Text style={styles.meta}>{alert.distanceKm} km · Updated {alert.updatedAt}</Text>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.guidance}>{alert.guidance}</Text>
        {onViewMap ? (
          <TouchableOpacity style={[styles.button, { borderColor: config.accent }]} onPress={() => onViewMap(alert)}>
            <Ionicons name="map-outline" size={16} color={config.accent} />
            <Text style={[styles.buttonText, { color: config.accent }]}>Map</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {onViewMap ? (
        <TouchableOpacity style={styles.secondaryMeta} onPress={() => onViewMap(alert)}>
          <Ionicons name="navigate-outline" size={16} color={config.accent} />
          <Text style={[styles.viewMore, { color: config.accent }]}>
            Impact radius {Math.round(alert.impactRadius)} m
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
  },
  levelText: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xs,
    color: Theme.colors.white,
  },
  meta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.darkGray,
    fontSize: Theme.font.size.sm,
  },
  description: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  guidance: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderWidth: 1,
    backgroundColor: Theme.colors.white,
  },
  buttonText: {
    fontFamily: Theme.font.family.sansBold,
  },
  secondaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  viewMore: {
    fontFamily: Theme.font.family.sansBold,
  },
});

export default AlertCard;
