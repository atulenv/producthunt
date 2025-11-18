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

  const trendColor =
    metric.trend === 'up'
      ? Theme.colors.success
      : metric.trend === 'down'
        ? Theme.colors.warning
        : Theme.colors.subtleText;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{metric.label}</Text>
        <View style={[styles.trendPill, { borderColor: trendColor }]}>
          <Text style={[styles.trendIcon, { color: trendColor }]}>
            {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '•'}
          </Text>
          <Text style={[styles.trendCopy, { color: trendColor }]}>{metric.trend.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.metricRow}>
        <Text style={styles.value}>{metric.value}</Text>
        <View style={[styles.scoreChip, { backgroundColor: `${progressColor}20` }]}>
          <Text style={[styles.scoreValue, { color: progressColor }]}>{metric.score}</Text>
          <Text style={[styles.scoreLabel, { color: progressColor }]}>/100</Text>
        </View>
      </View>
      <Text style={styles.detail}>{metric.detail}</Text>
      <Progress.Bar
        progress={progress}
        color={progressColor}
        unfilledColor="rgba(15,23,42,0.08)"
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
    width: 240,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    gap: 4,
  },
  trendIcon: {
    fontSize: 12,
  },
  trendCopy: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xs,
  },
  metricRow: {
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
  scoreChip: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  scoreValue: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
  },
  scoreLabel: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xs,
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
