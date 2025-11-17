import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { Theme } from '@/constants/theme';
import { SafetyMetric } from '@/src/lib/safety-data';

type Props = {
  metric: SafetyMetric;
};

const MetricCard: React.FC<Props> = ({ metric }) => {
  const progress = Math.min(Math.max(metric.score / 100, 0), 1);
  const progressColor =
    metric.score >= 70 ? Theme.colors.success : metric.score >= 40 ? Theme.colors.warning : Theme.colors.danger;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{metric.label}</Text>
        <Text style={styles.value}>{metric.value}</Text>
      </View>
      <Text style={styles.detail}>{metric.detail}</Text>
      <Progress.Bar
        progress={progress}
        color={progressColor}
        unfilledColor={Theme.colors.lightGray}
        borderWidth={0}
        height={8}
        width={null}
        style={styles.progress}
      />
      <Text style={styles.trend}>{metric.trendLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  label: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
    color: Theme.colors.text,
  },
  value: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
  },
  detail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    marginBottom: Theme.spacing.sm,
  },
  progress: {
    marginBottom: Theme.spacing.xs,
  },
  trend: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
});

export default MetricCard;
