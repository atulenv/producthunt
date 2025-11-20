import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Heatmap, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { MapHeatmapProps } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { HEAT_LEGEND, RISK_ZONES, RiskCategory, RiskZone } from '../../src/lib/risk-heatmap';

type HeatPoint = NonNullable<MapHeatmapProps['points']>[number];

const fallbackRegion = {
  latitude: 28.6325,
  longitude: 77.2194,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const formatTime = (date: Date) => `${date.getHours().toString().padStart(2, '0')}:${date
  .getMinutes()
  .toString()
  .padStart(2, '0')}`;

type LiveRiskZone = RiskZone & { lastUpdate: string };

const createLiveZones = (): LiveRiskZone[] =>
  RISK_ZONES.map((zone) => ({
    ...zone,
    lastUpdate: `${Math.floor(Math.random() * 4) + 1} min ago`,
  }));

const categories: { id: RiskCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'theft', label: 'Theft' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'danger', label: 'Danger' },
];

const categoryRgb: Record<RiskCategory, string> = {
  theft: '244,67,54',
  harassment: '255,152,0',
  danger: '116,63,181',
};

const categoryHex: Record<RiskCategory, string> = {
  theft: '#f44336',
  harassment: '#ff9800',
  danger: '#743fb5',
};

const categoryFill = (category: RiskCategory, opacity = 0.32) => `rgba(${categoryRgb[category]},${opacity})`;

const severityLabel = (intensity: number) => {
  if (intensity >= 0.75) return 'Critical';
  if (intensity >= 0.5) return 'Elevated';
  return 'Watch';
};

const fallbackHeatSteps = [1, 1.45, 2];

const heatmapGradient: MapHeatmapProps['gradient'] = {
  colorMapSize: 512,
  colors: ['rgba(0,191,165,0.05)', 'rgba(0,191,165,0.45)', '#FFB300', '#E53935'],
  startPoints: [0.1, 0.4, 0.7, 0.95],
};

// Native heatmaps crash on iOS/Apple Maps, so gate behind Android-only support and
// fall back to our manual circle layers elsewhere.
const supportsNativeHeatmap = Platform.OS === 'android';
const { height: screenHeight } = Dimensions.get('window');
const mapHeight = Math.min(screenHeight * 0.6, 520);

const providerLogos = [
  { id: 'google', icon: 'logo-google' as const, label: 'Google Safety' },
  { id: 'delhi', icon: 'shield-checkmark-outline' as const, label: 'Delhi Police' },
  { id: 'who', icon: 'medkit-outline' as const, label: 'WHO Clinics' },
  { id: 'aro', icon: 'pulse-outline' as const, label: 'Aro Command' },
];

const RiskZoneMapScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const [filter, setFilter] = useState<RiskCategory | 'all'>('all');
  const [zones, setZones] = useState<LiveRiskZone[]>(createLiveZones);
  const [lastSynced, setLastSynced] = useState(new Date());

  const filteredZones = useMemo(
    () => (filter === 'all' ? zones : zones.filter((zone) => zone.category === filter)),
    [zones, filter]
  );

  const focusRegion = useMemo(() => {
    if (filteredZones.length === 0) {
      return fallbackRegion;
    }
    const avgLat = filteredZones.reduce((sum, zone) => sum + zone.latitude, 0) / filteredZones.length;
    const avgLng = filteredZones.reduce((sum, zone) => sum + zone.longitude, 0) / filteredZones.length;
    return { latitude: avgLat, longitude: avgLng, latitudeDelta: 0.04, longitudeDelta: 0.04 };
  }, [filteredZones]);

  useEffect(() => {
    if (mapRef.current && focusRegion) {
      mapRef.current.animateToRegion(focusRegion, 600);
    }
  }, [focusRegion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((zone) => {
          const delta = (Math.random() - 0.5) * 0.2;
          const intensity = Math.max(0.2, Math.min(1, zone.intensity + delta));
          return {
            ...zone,
            intensity,
            lastUpdate: `${Math.floor(Math.random() * 5) + 1} min ago`,
          };
        })
      );
      setLastSynced(new Date());
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const summary = useMemo(
    () =>
      (['theft', 'harassment', 'danger'] as RiskCategory[]).map((category) => {
        const categoryZones = zones.filter((zone) => zone.category === category);
        const peak = categoryZones.reduce((acc, zone) => Math.max(acc, zone.intensity), 0);
        return { id: category, count: categoryZones.length, peak };
      }),
    [zones]
  );

  const heatPoints = useMemo<HeatPoint[]>(
    () =>
      filteredZones.map((zone) => ({
        latitude: zone.latitude,
        longitude: zone.longitude,
        weight: Math.max(0.3, zone.intensity * 1.6),
      })),
    [filteredZones]
  );

  const highlightedZones = useMemo(
    () =>
      filteredZones
        .slice()
        .sort((a, b) => b.intensity - a.intensity)
        .slice(0, 3),
    [filteredZones]
  );

  const avgIntensity = useMemo(() => {
    if (filteredZones.length === 0) return 0;
    const total = filteredZones.reduce((sum, zone) => sum + zone.intensity, 0);
    return total / filteredZones.length;
  }, [filteredZones]);

  const severeCount = useMemo(
    () => filteredZones.filter((zone) => zone.intensity >= 0.75).length,
    [filteredZones]
  );

  const topHotspot = highlightedZones[0];
  const minutesSinceSync = Math.max(1, Math.round((Date.now() - lastSynced.getTime()) / 60000));
  const dataConfidence = minutesSinceSync <= 3 ? 'High' : minutesSinceSync <= 6 ? 'Medium' : 'Low';
  const fusionStats = useMemo(
    () => [
      { id: 'signal', label: 'Threat index', value: `${Math.round(avgIntensity * 100)}%`, hint: `${severeCount} critical` },
      { id: 'zones', label: 'Hotspots live', value: filteredZones.length, hint: `${highlightedZones.length} tracked` },
      { id: 'confidence', label: 'Confidence', value: dataConfidence, hint: `Synced ${formatTime(lastSynced)}` },
    ],
    [avgIntensity, dataConfidence, filteredZones.length, highlightedZones.length, lastSynced, severeCount]
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapShell}>
          <LinearGradient colors={['rgba(99,102,241,0.25)', 'rgba(244,114,182,0.12)']} style={styles.mapGlow} />
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={fallbackRegion}
              customMapStyle={mapStyle}
              showsUserLocation
            >
              {supportsNativeHeatmap && heatPoints.length > 0 && (
                <Heatmap points={heatPoints} radius={45} opacity={0.85} gradient={heatmapGradient} />
              )}
              {!supportsNativeHeatmap &&
                filteredZones.map((zone) =>
                  fallbackHeatSteps.map((step, index) => (
                    <Circle
                      key={`${zone.id}-heat-${index}`}
                      center={{ latitude: zone.latitude, longitude: zone.longitude }}
                      radius={(260 + zone.intensity * 280) * step}
                      fillColor={categoryFill(zone.category, Math.max(0.08, 0.28 - index * 0.07))}
                      strokeColor="transparent"
                    />
                  ))
                )}
              {highlightedZones.map((zone) => (
                <Marker key={`${zone.id}-marker`} coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}>
                  <View style={styles.markerBadge}>
                    <Text style={styles.markerTitle}>{zone.label}</Text>
                    <Text style={styles.markerNote}>{zone.note}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapOverlay} pointerEvents="none">
              <View style={styles.overlayCardRow}>
                <View style={styles.overlayCard}>
                  <Text style={styles.overlayLabel}>Threat index</Text>
                  <Text style={styles.overlayValue}>{Math.round(avgIntensity * 100)}%</Text>
                  <Text style={styles.overlayMeta}>Average intensity for this filter</Text>
                </View>
                {topHotspot && (
                  <View style={[styles.overlayCard, styles.overlayAlert]}>
                    <Text style={styles.overlayLabel}>Critical focus</Text>
                    <Text style={styles.overlayPlace}>{topHotspot.label}</Text>
                    <Text style={styles.overlayMeta}>Updated {topHotspot.lastUpdate}</Text>
                  </View>
                )}
              </View>
              <View style={styles.overlayPills}>
                <View style={styles.overlayPill}>
                  <Text style={styles.overlayPillLabel}>Hotspots</Text>
                  <Text style={styles.overlayPillValue}>{filteredZones.length}</Text>
                </View>
                <View style={styles.overlayPill}>
                  <Text style={styles.overlayPillLabel}>Critical</Text>
                  <Text style={styles.overlayPillValue}>{severeCount}</Text>
                </View>
                <View style={styles.overlayPill}>
                  <Text style={styles.overlayPillLabel}>Confidence</Text>
                  <Text style={styles.overlayPillValue}>{dataConfidence}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.providerRow}>
            {providerLogos.map((provider) => (
              <View key={provider.id} style={styles.providerChip}>
                <Ionicons name={provider.icon} size={14} color={Theme.colors.primary} />
                <Text style={styles.providerText}>{provider.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <LinearGradient colors={['#1b1c3a', '#312e81', '#4c1d95']} style={styles.heroBanner}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroEyebrow}>Aro scope · city loop</Text>
              <Text style={styles.heroTitle}>Risk fusion center</Text>
              <Text style={styles.heroSubtitle}>Live telemetry for Connaught Place radius</Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>{filter === 'all' ? 'Citywide feed' : `${filter} focus`}</Text>
            </View>
          </View>
          <View style={styles.heroMetricsRow}>
            {fusionStats.map((metric) => (
              <View key={metric.id} style={styles.heroMetric}>
                <Text style={styles.heroMetricLabel}>{metric.label}</Text>
                <Text style={styles.heroMetricValue}>{metric.value}</Text>
                <Text style={styles.heroMetricHint}>{metric.hint}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        <View style={styles.header}>
          <Text style={styles.title}>Live risk intelligence</Text>
          <Text style={styles.subtitle}>Synced {formatTime(lastSynced)}</Text>
        </View>
        <View style={styles.filterRow}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.filterChip, filter === category.id && styles.filterChipActive]}
              onPress={() => setFilter(category.id)}
            >
              <Text style={[styles.filterText, filter === category.id && styles.filterTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterMetaRow}>
          <Text style={styles.filterMetaLabel}>Current scope</Text>
          <View style={styles.filterMetaPill}>
            <Text style={styles.filterMetaValue}>{filter === 'all' ? 'Citywide' : filter}</Text>
          </View>
          <View style={styles.filterMetaPillAlt}>
            <Text style={styles.filterMetaValue}>{filteredZones.length} zones</Text>
          </View>
        </View>
        <View style={styles.heroMetricsStrip}>
          {fusionStats.map((metric) => (
            <View key={`${metric.id}-strip`} style={styles.heroMetricStrip}>
              <Text style={styles.heroMetricStripLabel}>{metric.label}</Text>
              <Text style={styles.heroMetricStripValue}>{metric.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          {HEAT_LEGEND.map((entry) => (
            <View key={entry.id} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: entry.color }]} />
              <Text style={styles.legendLabel}>{entry.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.mapMetaRow}>
          <View style={styles.mapMetaCard}>
            <Text style={styles.mapMetaLabel}>Active hotspots</Text>
            <Text style={styles.mapMetaValue}>{filteredZones.length}</Text>
            <Text style={styles.mapMetaHint}>Within current filter</Text>
          </View>
          <View style={[styles.mapMetaCard, styles.mapMetaCardAccent]}>
            <Text style={styles.mapMetaLabel}>Critical clusters</Text>
            <Text style={styles.mapMetaValue}>{severeCount}</Text>
            <Text style={styles.mapMetaHint}>{'>= 75% intensity'}</Text>
          </View>
          <View style={styles.mapMetaCard}>
            <Text style={styles.mapMetaLabel}>Data confidence</Text>
            <Text style={styles.mapMetaValue}>{dataConfidence}</Text>
            <Text style={styles.mapMetaHint}>Synced {formatTime(lastSynced)}</Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category breakdown</Text>
          <Text style={styles.sectionHint}>Peak intensity from the live feed</Text>
        </View>
        <View style={styles.summaryRow}>
          {summary.map((item) => (
            <View key={item.id} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.id.toUpperCase()}</Text>
              <Text style={styles.summaryValue}>{item.count}</Text>
              <Text style={styles.summaryMeta}>Peak {(item.peak * 100).toFixed(0)}%</Text>
            </View>
          ))}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actionable focus</Text>
          <Text style={styles.sectionHint}>Auto-ranked by severity and recency</Text>
        </View>
        <View style={styles.zoneList}>
          {highlightedZones.length > 0 ? (
            highlightedZones.map((zone) => (
              <View key={`${zone.id}-row`} style={styles.zoneRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.zoneTitle}>{zone.label}</Text>
                  <Text style={styles.zoneMeta}>{zone.note}</Text>
                  <View style={styles.zoneMetaRow}>
                    <Text style={styles.zoneUpdate}>Updated {zone.lastUpdate}</Text>
                    <View style={[styles.zoneCategoryTag, { backgroundColor: categoryFill(zone.category, 0.18) }]}>
                      <Text style={[styles.zoneCategoryText, { color: categoryHex[zone.category] }]}>
                        {zone.category}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneBadgeValue}>{Math.round(zone.intensity * 100)}%</Text>
                  <Text style={styles.zoneBadgeLabel}>{severityLabel(zone.intensity)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Map layer looks calm</Text>
              <Text style={styles.emptyStateText}>Select All to review the full network of alerts.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl + TAB_BAR_OVERLAY_HEIGHT,
  },
  mapShell: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.xs,
    borderRadius: Theme.radius.xl,
  },
  mapGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: Theme.radius.xl,
    opacity: 0.7,
  },
  heroBanner: {
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: Theme.font.size.xs,
    fontFamily: Theme.font.family.sansBold,
  },
  heroTitle: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xl,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Theme.font.family.sans,
    marginTop: 4,
  },
  heroChip: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroChipText: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.sm,
  },
  heroMetricsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    flexWrap: 'wrap',
  },
  heroMetric: {
    flex: 1,
    minWidth: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
  },
  heroMetricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.sm,
  },
  heroMetricValue: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    marginTop: 4,
  },
  heroMetricHint: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Theme.font.family.sans,
    marginTop: 2,
  },
  header: {
    gap: 2,
  },
  title: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.1)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(0,191,165,0.12)',
    borderColor: Theme.colors.primary,
  },
  filterText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.subtleText,
  },
  filterTextActive: {
    color: Theme.colors.primary,
  },
  filterMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  filterMetaLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  filterMetaPill: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: 'rgba(91,33,182,0.12)',
  },
  filterMetaPillAlt: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: 'rgba(0,191,165,0.15)',
  },
  filterMetaValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  heroMetricsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  heroMetricStrip: {
    flex: 1,
    minWidth: 120,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.05)',
  },
  heroMetricStripLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  heroMetricStripValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  mapWrapper: {
    height: mapHeight,
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: Theme.colors.white,
    position: 'relative',
    shadowColor: '#1e1b4b',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 8,
  },
  providerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
  },
  providerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  providerText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  mapOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  overlayCardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  overlayCard: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.sm,
    gap: 4,
    minWidth: 140,
  },
  overlayAlert: {
    backgroundColor: 'rgba(244,67,54,0.85)',
  },
  overlayLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.xs,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  overlayValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.xl,
  },
  overlayPlace: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.md,
  },
  overlayMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.white,
    opacity: 0.85,
    fontSize: Theme.font.size.xs,
  },
  overlayPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  overlayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
  },
  overlayPillLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  overlayPillValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  mapMetaRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    flexWrap: 'wrap',
  },
  mapMetaCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: Theme.spacing.md,
    gap: 2,
  },
  mapMetaCardAccent: {
    backgroundColor: 'rgba(244,63,94,0.08)',
    borderColor: 'rgba(244,63,94,0.32)',
  },
  mapMetaLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
    textTransform: 'uppercase',
  },
  mapMetaValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.lg,
  },
  mapMetaHint: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  sectionHint: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: Theme.spacing.md,
    gap: 4,
  },
  summaryLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.subtleText,
  },
  summaryValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.xl,
  },
  summaryMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  zoneList: {
    gap: Theme.spacing.sm,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
  },
  zoneTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  zoneMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    marginTop: 2,
  },
  zoneMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginTop: 4,
  },
  zoneUpdate: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.primary,
    marginTop: 0,
    fontSize: Theme.font.size.xs,
  },
  zoneCategoryTag: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
  },
  zoneCategoryText: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xs,
    textTransform: 'capitalize',
  },
  zoneBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,191,165,0.1)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.md,
  },
  zoneBadgeValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.lg,
  },
  zoneBadgeLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  emptyStateTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  emptyStateText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    textAlign: 'center',
  },
  markerBadge: {
    backgroundColor: Theme.colors.white,
    padding: 8,
    borderRadius: Theme.radius.md,
    maxWidth: 160,
  },
  markerTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  markerNote: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
});

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export default RiskZoneMapScreen;
