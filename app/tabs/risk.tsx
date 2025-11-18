import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Theme } from '../../constants/theme';
import { HEAT_LEGEND, RISK_ZONES, RiskCategory, RiskZone } from '../../src/lib/risk-heatmap';

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

const categoryFill = (category: RiskCategory) => {
  if (category === 'theft') return 'rgba(244,67,54,0.32)';
  if (category === 'harassment') return 'rgba(255,152,0,0.32)';
  return 'rgba(116,63,181,0.32)';
};

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={StyleSheet.absoluteFillObject}
            initialRegion={fallbackRegion}
            customMapStyle={mapStyle}
            showsUserLocation
          >
            {filteredZones.map((zone) => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={{ latitude: zone.latitude, longitude: zone.longitude }}
                  radius={350 + zone.intensity * 350}
                  fillColor={categoryFill(zone.category)}
                  strokeColor="transparent"
                />
                <Marker coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}>
                  <View style={styles.markerBadge}>
                    <Text style={styles.markerTitle}>{zone.label}</Text>
                    <Text style={styles.markerNote}>{zone.note}</Text>
                  </View>
                </Marker>
              </React.Fragment>
            ))}
          </MapView>
        </View>
        <View style={styles.legendRow}>
          {HEAT_LEGEND.map((entry) => (
            <View key={entry.id} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: entry.color }]} />
              <Text style={styles.legendLabel}>{entry.label}</Text>
            </View>
          ))}
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
        <View style={styles.zoneList}>
          {filteredZones.map((zone) => (
            <View key={`${zone.id}-row`} style={styles.zoneRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.zoneTitle}>{zone.label}</Text>
                <Text style={styles.zoneMeta}>{zone.note}</Text>
                <Text style={styles.zoneUpdate}>Updated {zone.lastUpdate}</Text>
              </View>
              <View style={styles.zoneBadge}>
                <Text style={styles.zoneBadgeValue}>{Math.round(zone.intensity * 100)}%</Text>
                <Text style={styles.zoneBadgeLabel}>intensity</Text>
              </View>
            </View>
          ))}
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
    paddingBottom: Theme.spacing.xl,
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
  mapWrapper: {
    height: 320,
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
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
  zoneUpdate: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.primary,
    marginTop: 2,
    fontSize: Theme.font.size.xs,
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
