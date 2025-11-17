import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/theme';
import { SafetyAlert } from '@/src/lib/safety-data';

type Props = {
  alert: SafetyAlert;
  onViewMap?: (alert: SafetyAlert) => void;
};

const AlertCard: React.FC<Props> = ({ alert, onViewMap }) => {
  return (
    <View style={[styles.card, styles[alert.level]]}>
      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="warning-outline" size={18} color={Theme.colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.meta}>{alert.distanceKm} km · Updated {alert.updatedAt}</Text>
        </View>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <Text style={styles.guidance}>{alert.guidance}</Text>
      {onViewMap ? (
        <TouchableOpacity style={styles.button} onPress={() => onViewMap(alert)}>
          <Text style={styles.buttonText}>View on map</Text>
          <Ionicons name="navigate-outline" size={16} color={Theme.colors.white} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
    color: Theme.colors.white,
  },
  meta: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.85)',
    fontSize: Theme.font.size.sm,
  },
  description: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  guidance: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Theme.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.radius.full,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: Theme.spacing.xs,
  },
  buttonText: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
  },
  critical: {
    backgroundColor: Theme.colors.danger,
  },
  warning: {
    backgroundColor: Theme.colors.warning,
  },
  info: {
    backgroundColor: Theme.colors.secondary,
  },
});

export default AlertCard;
