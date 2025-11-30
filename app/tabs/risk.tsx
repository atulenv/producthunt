// Enhanced Risk Zone Map with better visualization for India
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { HEAT_LEGEND, RISK_ZONES, RiskCategory, RiskZone } from '../../src/lib/risk-heatmap';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';

// Conditionally import map components for native only
let MapView: any = null;
let Circle: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Circle = Maps.Circle;
  Marker = Maps.Marker;
  PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
}

type LiveRiskZone = RiskZone & { lastUpdate: string };

// India-focused initial region (Delhi NCR)
const INDIA_REGIONS = {
  delhi: {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
    name: 'Delhi NCR',
  },
  mumbai: {
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
    name: 'Mumbai',
  },
  jaipur: {
    latitude: 26.9124,
    longitude: 75.7873,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
    name: 'Jaipur',
  },
  agra: {
    latitude: 27.1767,
    longitude: 78.0081,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
    name: 'Agra',
  },
};

const categories: { id: RiskCategory | 'all'; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { id: 'all', label: 'All Zones', icon: 'layers-outline', color: Theme.colors.primary },
  { id: 'theft', label: 'Theft', icon: 'bag-remove-outline', color: '#DC2626' },
  { id: 'harassment', label: 'Harassment', icon: 'warning-outline', color: '#F59E0B' },
  { id: 'danger', label: 'Danger', icon: 'skull-outline', color: '#7C3AED' },
];

const categoryColors: Record<RiskCategory, { fill: string; stroke: string; marker: string }> = {
  theft: { fill: 'rgba(220, 38, 38, 0.25)', stroke: '#DC2626', marker: '#DC2626' },
  harassment: { fill: 'rgba(245, 158, 11, 0.25)', stroke: '#F59E0B', marker: '#F59E0B' },
  danger: { fill: 'rgba(124, 58, 237, 0.25)', stroke: '#7C3AED', marker: '#7C3AED' },
};

const severityLabel = (intensity: number) => {
  if (intensity >= 0.75) return { label: 'Critical', color: Theme.colors.emergency };
  if (intensity >= 0.5) return { label: 'High', color: Theme.colors.warning };
  return { label: 'Moderate', color: Theme.colors.success };
};

const createLiveZones = (): LiveRiskZone[] =>
  RISK_ZONES.map((zone) => ({
    ...zone,
    lastUpdate: `${Math.floor(Math.random() * 4) + 1} min ago`,
  }));

const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const { height: screenHeight } = Dimensions.get('window');
const mapHeight = Math.min(screenHeight * 0.5, 400);

const RiskZoneMapScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const [filter, setFilter] = useState<RiskCategory | 'all'>('all');
  const [zones, setZones] = useState<LiveRiskZone[]>(createLiveZones);
  const [lastSynced, setLastSynced] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState<keyof typeof INDIA_REGIONS>('delhi');
  const [selectedZone, setSelectedZone] = useState<LiveRiskZone | null>(null);

  const filteredZones = useMemo(
    () => (filter === 'all' ? zones : zones.filter((zone) => zone.category === filter)),
    [zones, filter]
  );

  const currentRegion = INDIA_REGIONS[selectedCity];

  // Auto-refresh zone data
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((zone) => {
          const delta = (Math.random() - 0.5) * 0.15;
          const intensity = Math.max(0.2, Math.min(1, zone.intensity + delta));
          return {
            ...zone,
            intensity,
            lastUpdate: `${Math.floor(Math.random() * 5) + 1} min ago`,
          };
        })
      );
      setLastSynced(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCityChange = (city: keyof typeof INDIA_REGIONS) => {
    setSelectedCity(city);
    mapRef.current?.animateToRegion(INDIA_REGIONS[city], 800);
  };

  const handleZonePress = (zone: LiveRiskZone) => {
    setSelectedZone(zone);
    mapRef.current?.animateToRegion(
      {
        latitude: zone.latitude,
        longitude: zone.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      600
    );
  };

  const stats = useMemo(() => {
    const critical = filteredZones.filter((z) => z.intensity >= 0.75).length;
    const high = filteredZones.filter((z) => z.intensity >= 0.5 && z.intensity < 0.75).length;
    const avgIntensity = filteredZones.reduce((sum, z) => sum + z.intensity, 0) / (filteredZones.length || 1);
    return { critical, high, total: filteredZones.length, avgIntensity };
  }, [filteredZones]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          <LinearGradient colors={[Theme.colors.background, 'transparent']} style={styles.headerGradient}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Safety Map</Text>
                <Text style={styles.headerSubtitle}>Live risk zones • India</Text>
              </View>
              <View style={styles.syncBadge}>
                <View style={styles.syncDot} />
                <Text style={styles.syncText}>Live • {formatTime(lastSynced)}</Text>
              </View>
            </View>

            {/* City Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.citySelector}>
              {Object.entries(INDIA_REGIONS).map(([key, region]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.cityChip, selectedCity === key && styles.cityChipActive]}
                  onPress={() => handleCityChange(key as keyof typeof INDIA_REGIONS)}
                >
                  <Ionicons
                    name="location"
                    size={14}
                    color={selectedCity === key ? Theme.colors.white : Theme.colors.primary}
                  />
                  <Text style={[styles.cityChipText, selectedCity === key && styles.cityChipTextActive]}>
                    {region.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterChip, filter === cat.id && styles.filterChipActive]}
                  onPress={() => setFilter(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={filter === cat.id ? Theme.colors.white : cat.color}
                  />
                  <Text style={[styles.filterText, filter === cat.id && styles.filterTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            // Web fallback - show placeholder with zone list
            <View style={styles.webMapPlaceholder}>
              <Ionicons name="map" size={48} color={Theme.colors.primary} />
              <Text style={styles.webMapTitle}>Interactive Safety Map</Text>
              <Text style={styles.webMapSubtitle}>
                Full map experience available on mobile app
              </Text>
              <View style={styles.webMapStats}>
                <View style={styles.webMapStat}>
                  <Text style={styles.webMapStatValue}>{stats.total}</Text>
                  <Text style={styles.webMapStatLabel}>Risk Zones</Text>
                </View>
                <View style={styles.webMapStat}>
                  <Text style={[styles.webMapStatValue, { color: Theme.colors.emergency }]}>{stats.critical}</Text>
                  <Text style={styles.webMapStatLabel}>Critical</Text>
                </View>
                <View style={styles.webMapStat}>
                  <Text style={[styles.webMapStatValue, { color: Theme.colors.warning }]}>{stats.high}</Text>
                  <Text style={styles.webMapStatLabel}>High Risk</Text>
                </View>
              </View>
            </View>
          ) : MapView ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={currentRegion}
              showsUserLocation
              showsMyLocationButton={false}
              customMapStyle={mapStyle}
            >
              {/* Risk Zone Circles */}
              {filteredZones.map((zone) => {
                const colors = categoryColors[zone.category];
                const baseRadius = 200 + zone.intensity * 300;
                return (
                  <React.Fragment key={zone.id}>
                    {/* Outer glow */}
                    {Circle && (
                      <Circle
                        center={{ latitude: zone.latitude, longitude: zone.longitude }}
                        radius={baseRadius * 1.5}
                        fillColor={colors.fill.replace('0.25', '0.08')}
                        strokeWidth={0}
                      />
                    )}
                    {/* Main circle */}
                    {Circle && (
                      <Circle
                        center={{ latitude: zone.latitude, longitude: zone.longitude }}
                        radius={baseRadius}
                        fillColor={colors.fill}
                        strokeColor={colors.stroke}
                        strokeWidth={2}
                      />
                    )}
                    {/* Center marker */}
                    {Marker && (
                      <Marker
                        coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                        onPress={() => handleZonePress(zone)}
                      >
                        <View style={[styles.marker, { backgroundColor: colors.marker }]}>
                          <Ionicons
                            name={
                              zone.category === 'theft'
                                ? 'bag-remove'
                                : zone.category === 'harassment'
                                ? 'warning'
                                : 'alert-circle'
                            }
                            size={16}
                            color={Theme.colors.white}
                          />
                        </View>
                      </Marker>
                    )}
                  </React.Fragment>
                );
              })}
            </MapView>
          ) : (
            <View style={styles.webMapPlaceholder}>
              <Text>Map loading...</Text>
            </View>
          )}

          {/* Map Overlay Stats - only on native */}
          {Platform.OS !== 'web' && (
            <View style={styles.mapOverlay}>
              <View style={styles.overlayStats}>
                <View style={styles.overlayStat}>
                  <Text style={styles.overlayStatValue}>{stats.total}</Text>
                  <Text style={styles.overlayStatLabel}>Zones</Text>
                </View>
                <View style={[styles.overlayStat, styles.overlayStatDanger]}>
                  <Text style={[styles.overlayStatValue, { color: Theme.colors.emergency }]}>{stats.critical}</Text>
                  <Text style={styles.overlayStatLabel}>Critical</Text>
                </View>
                <View style={styles.overlayStat}>
                  <Text style={[styles.overlayStatValue, { color: Theme.colors.warning }]}>{stats.high}</Text>
                  <Text style={styles.overlayStatLabel}>High</Text>
                </View>
              </View>
            </View>
          )}

          {/* My Location Button */}
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="locate" size={22} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Selected Zone Info */}
        {selectedZone && (
          <Card style={styles.selectedZoneCard}>
            <View style={styles.selectedZoneHeader}>
              <View style={[styles.selectedZoneIcon, { backgroundColor: categoryColors[selectedZone.category].fill }]}>
                <Ionicons
                  name={
                    selectedZone.category === 'theft'
                      ? 'bag-remove'
                      : selectedZone.category === 'harassment'
                      ? 'warning'
                      : 'alert-circle'
                  }
                  size={24}
                  color={categoryColors[selectedZone.category].marker}
                />
              </View>
              <View style={styles.selectedZoneInfo}>
                <Text style={styles.selectedZoneTitle}>{selectedZone.label}</Text>
                <View style={styles.selectedZoneMeta}>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: severityLabel(selectedZone.intensity).color + '20' },
                    ]}
                  >
                    <Text style={[styles.severityText, { color: severityLabel(selectedZone.intensity).color }]}>
                      {severityLabel(selectedZone.intensity).label}
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{selectedZone.category.toUpperCase()}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedZone(null)}>
                <Ionicons name="close-circle" size={24} color={Theme.colors.subtleText} />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectedZoneNote}>{selectedZone.note}</Text>
            <View style={styles.selectedZoneFooter}>
              <Text style={styles.selectedZoneUpdate}>Updated {selectedZone.lastUpdate}</Text>
              <View style={styles.intensityBar}>
                <View style={[styles.intensityFill, { width: `${selectedZone.intensity * 100}%` }]} />
              </View>
              <Text style={styles.intensityText}>{Math.round(selectedZone.intensity * 100)}% intensity</Text>
            </View>
          </Card>
        )}

        {/* Legend */}
        <Card style={styles.legendCard}>
          <SectionHeader title="Risk Legend" subtitle="Understanding zone colors" icon="information-circle-outline" />
          <View style={styles.legendGrid}>
            {categories.slice(1).map((cat) => (
              <View key={cat.id} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: cat.color }]} />
                <View>
                  <Text style={styles.legendLabel}>{cat.label}</Text>
                  <Text style={styles.legendDesc}>
                    {cat.id === 'theft'
                      ? 'Pickpocket hotspots'
                      : cat.id === 'harassment'
                      ? 'Reported incidents'
                      : 'Unsafe areas'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.intensityLegend}>
            <Text style={styles.legendSectionTitle}>Intensity Levels</Text>
            <View style={styles.intensityLevels}>
              <View style={styles.intensityLevel}>
                <View style={[styles.intensityDot, { backgroundColor: Theme.colors.success }]} />
                <Text style={styles.intensityLevelText}>Moderate (0-50%)</Text>
              </View>
              <View style={styles.intensityLevel}>
                <View style={[styles.intensityDot, { backgroundColor: Theme.colors.warning }]} />
                <Text style={styles.intensityLevelText}>High (50-75%)</Text>
              </View>
              <View style={styles.intensityLevel}>
                <View style={[styles.intensityDot, { backgroundColor: Theme.colors.emergency }]} />
                <Text style={styles.intensityLevelText}>Critical (75%+)</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Zone List */}
        <Card style={styles.zoneListCard}>
          <SectionHeader
            title="Active Risk Zones"
            subtitle={`${filteredZones.length} zones in ${INDIA_REGIONS[selectedCity].name}`}
            icon="list-outline"
          />
          {filteredZones.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark" size={48} color={Theme.colors.success} />
              <Text style={styles.emptyTitle}>No risks detected</Text>
              <Text style={styles.emptyDesc}>This area looks safe based on current data</Text>
            </View>
          ) : (
            filteredZones
              .sort((a, b) => b.intensity - a.intensity)
              .map((zone) => {
                const severity = severityLabel(zone.intensity);
                const colors = categoryColors[zone.category];
                return (
                  <TouchableOpacity
                    key={zone.id}
                    style={styles.zoneItem}
                    onPress={() => handleZonePress(zone)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.zoneIcon, { backgroundColor: colors.fill }]}>
                      <Ionicons
                        name={
                          zone.category === 'theft'
                            ? 'bag-remove'
                            : zone.category === 'harassment'
                            ? 'warning'
                            : 'alert-circle'
                        }
                        size={20}
                        color={colors.marker}
                      />
                    </View>
                    <View style={styles.zoneContent}>
                      <Text style={styles.zoneTitle}>{zone.label}</Text>
                      <Text style={styles.zoneNote} numberOfLines={1}>
                        {zone.note}
                      </Text>
                      <View style={styles.zoneMeta}>
                        <Text style={styles.zoneUpdate}>Updated {zone.lastUpdate}</Text>
                        <View style={[styles.categoryTag, { backgroundColor: colors.fill }]}>
                          <Text style={[styles.categoryTagText, { color: colors.marker }]}>
                            {zone.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.zoneSeverity}>
                      <Text style={[styles.zoneSeverityValue, { color: severity.color }]}>
                        {Math.round(zone.intensity * 100)}%
                      </Text>
                      <Text style={[styles.zoneSeverityLabel, { color: severity.color }]}>{severity.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          )}
        </Card>

        {/* Safety Tips */}
        <Card style={styles.tipsCard}>
          <SectionHeader title="Stay Safe" subtitle="Tips for navigating risk zones" icon="bulb-outline" />
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="eye" size={20} color={Theme.colors.primary} />
              <Text style={styles.tipText}>Stay aware of your surroundings in marked zones</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="people" size={20} color={Theme.colors.primary} />
              <Text style={styles.tipText}>Travel in groups during evening hours</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bag-check" size={20} color={Theme.colors.primary} />
              <Text style={styles.tipText}>Keep valuables secure and out of sight</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="call" size={20} color={Theme.colors.primary} />
              <Text style={styles.tipText}>Save emergency numbers: 100 (Police), 112 (Emergency)</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: TAB_BAR_OVERLAY_HEIGHT + Theme.spacing.xl }} />
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
    gap: Theme.spacing.md,
  },
  stickyHeader: {
    backgroundColor: Theme.colors.background,
    zIndex: 10,
  },
  headerGradient: {
    padding: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.successBg,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.success,
  },
  syncText: {
    color: Theme.colors.success,
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
  },
  citySelector: {
    flexGrow: 0,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    marginRight: Theme.spacing.sm,
  },
  cityChipActive: {
    backgroundColor: Theme.colors.primary,
  },
  cityChipText: {
    color: Theme.colors.primary,
    fontWeight: '600',
    fontSize: Theme.font.size.sm,
  },
  cityChipTextActive: {
    color: Theme.colors.white,
  },
  filterRow: {
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.card,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: Theme.colors.text,
    borderColor: Theme.colors.text,
  },
  filterText: {
    color: Theme.colors.text,
    fontWeight: '600',
    fontSize: Theme.font.size.sm,
  },
  filterTextActive: {
    color: Theme.colors.white,
  },
  mapContainer: {
    marginHorizontal: Theme.spacing.md,
    height: mapHeight,
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  map: {
    flex: 1,
  },
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  webMapTitle: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  webMapSubtitle: {
    fontSize: Theme.font.size.md,
    color: Theme.colors.subtleText,
    textAlign: 'center',
  },
  webMapStats: {
    flexDirection: 'row',
    gap: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  webMapStat: {
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.sm,
  },
  webMapStatValue: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  webMapStatLabel: {
    fontSize: Theme.font.size.sm,
    color: Theme.colors.subtleText,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.white,
    ...Theme.shadows.md,
  },
  mapOverlay: {
    position: 'absolute',
    top: Theme.spacing.sm,
    left: Theme.spacing.sm,
    right: Theme.spacing.sm,
  },
  overlayStats: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  overlayStat: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  overlayStatDanger: {
    backgroundColor: Theme.colors.emergencyBg,
  },
  overlayStatValue: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  overlayStatLabel: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  locationButton: {
    position: 'absolute',
    bottom: Theme.spacing.md,
    right: Theme.spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  selectedZoneCard: {
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.warning,
  },
  selectedZoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  selectedZoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedZoneInfo: {
    flex: 1,
  },
  selectedZoneTitle: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  selectedZoneMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginTop: 4,
  },
  severityBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.radius.full,
  },
  severityText: {
    fontSize: Theme.font.size.xs,
    fontWeight: '700',
  },
  categoryText: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
    fontWeight: '600',
  },
  selectedZoneNote: {
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  selectedZoneFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  selectedZoneUpdate: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  intensityBar: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    backgroundColor: Theme.colors.warning,
    borderRadius: 3,
  },
  intensityText: {
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  legendCard: {
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    minWidth: '45%',
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  legendLabel: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  legendDesc: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  intensityLegend: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.md,
  },
  legendSectionTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  intensityLevels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  intensityLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  intensityLevelText: {
    fontSize: Theme.font.size.sm,
    color: Theme.colors.subtleText,
  },
  zoneListCard: {
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
    gap: Theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  emptyDesc: {
    color: Theme.colors.subtleText,
    textAlign: 'center',
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
  },
  zoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneContent: {
    flex: 1,
  },
  zoneTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  zoneNote: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    marginTop: 2,
  },
  zoneMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginTop: 4,
  },
  zoneUpdate: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.mutedText,
  },
  categoryTag: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.radius.xs,
  },
  categoryTagText: {
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  zoneSeverity: {
    alignItems: 'flex-end',
  },
  zoneSeverityValue: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
  },
  zoneSeverityLabel: {
    fontSize: Theme.font.size.xs,
    fontWeight: '500',
  },
  tipsCard: {
    marginHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  tipsList: {
    gap: Theme.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  tipText: {
    flex: 1,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
});

// Cleaner map style for India
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'simplified' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];

export default RiskZoneMapScreen;
