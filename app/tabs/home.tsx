// Streamlined home dashboard with focused safety controls.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import PanicSlider from '../../components/ui/PanicSlider';
import { Theme } from '../../constants/theme';
import {
  RESOURCE_LINKS,
  SAFETY_ALERTS,
  SAFETY_METRICS,
  TRUSTED_CONTACTS as STATIC_CONTACTS,
  SAFE_SPOTS,
  PREPAREDNESS,
} from '../../src/lib/safety-data';
import { useAppStore } from '../../src/store/use-app-store';
import { fetchWeatherForCoords } from '../../src/lib/weather';
import { HEAT_LEGEND, RISK_ZONES, RiskCategory } from '../../src/lib/risk-heatmap';
import { useTranslate } from '../../src/hooks/use-translate';

type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  type?: 'sos';
};

const quickActions: QuickAction[] = [
  {
    id: 'sos-primary',
    label: 'SOS dispatch',
    description: 'Trigger calls + live tracking',
    icon: 'alert-circle-outline',
    type: 'sos',
  },
  { id: 'plan', label: 'Plan trip', description: 'Prep checklist + docs', icon: 'map-outline', route: '/screens/PlanTrip' },
  { id: 'routes', label: 'Safe routes', description: 'Best-lit paths nearby', icon: 'navigate-outline', route: '/screens/TravelRoutes' },
  { id: 'reports', label: 'Report incident', description: 'Share what you saw', icon: 'megaphone-outline', route: '/screens/Reports' },
];

const menuItems = [
  { id: 'profile', label: 'Profile', description: 'Identity & travel dossier', icon: 'person-circle-outline', route: '/tabs/profile' },
  { id: 'trips', label: 'Trips', description: 'Upcoming journeys + history', icon: 'briefcase-outline', route: '/tabs/trips' },
  { id: 'help', label: 'Help desk', description: 'Chat with concierge', icon: 'chatbubbles-outline', route: '/tabs/help' },
  { id: 'settings', label: 'Settings', description: 'Language + preferences', icon: 'settings-outline', route: '/tabs/settings' },
];

const heatFilters: { id: RiskCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'theft', label: 'Theft' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'danger', label: 'Danger' },
];

const categoryColors: Record<RiskCategory, string> = {
  theft: 'rgba(244,67,54,0.35)',
  harassment: 'rgba(255,152,0,0.35)',
  danger: 'rgba(116,63,181,0.35)',
};

const formatTime = (date: Date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const HomeScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { trips, trustedContacts, language } = useAppStore();

  const [weather, setWeather] = useState({ temperature: '--', condition: 'Loading...', icon: 'cloud-outline' });
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [sosActivatedAt, setSosActivatedAt] = useState<string | null>(null);
  const [heatFilter, setHeatFilter] = useState<RiskCategory | 'all'>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [liveHeatZones, setLiveHeatZones] = useState(RISK_ZONES);
  const [heatLastUpdated, setHeatLastUpdated] = useState(new Date());

  const heroPulse = useRef(new Animated.Value(0)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslate = useRef(new Animated.Value(20)).current;

  const heroMetric = SAFETY_METRICS.find((metric) => metric.id === 'city-risk');
  const contactsToShow = trustedContacts.length > 0 ? trustedContacts : STATIC_CONTACTS;
  const upcomingTrip = useMemo(() => {
    const sorted = [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted.find((trip) => new Date(trip.startDate) >= new Date());
  }, [trips]);

  const heatZones = useMemo(
    () => (heatFilter === 'all' ? liveHeatZones : liveHeatZones.filter((zone) => zone.category === heatFilter)),
    [heatFilter, liveHeatZones]
  );

  const highlightMetrics = useMemo(
    () => [
      { id: 'risk', label: 'City risk', value: `${heroMetric?.score ?? 60}/100`, detail: heroMetric?.value ?? 'Moderate' },
      { id: 'language', label: 'Language', value: language.toUpperCase(), detail: 'Tap settings to change' },
      {
        id: 'itinerary',
        label: 'Next trip',
        value: upcomingTrip ? upcomingTrip.city : 'Add trip',
        detail: upcomingTrip ? `${upcomingTrip.startDate} → ${upcomingTrip.endDate}` : 'Plan to unlock intel',
      },
    ],
    [heroMetric?.score, heroMetric?.value, language, upcomingTrip]
  );

  const heroChips = useMemo(
    () => [
      { id: 'contacts', icon: 'shield-checkmark-outline' as const, label: `${contactsToShow.length} watchers ready` },
      { id: 'weather', icon: 'cloud-outline' as const, label: weather.condition },
      { id: 'language', icon: 'globe-outline' as const, label: language.toUpperCase() },
    ],
    [contactsToShow.length, language, weather.condition]
  );

  useEffect(() => {
    fetchWeatherForCoords(28.6139, 77.209).then((data) => setWeather(data));
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(heroPulse, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    ).start();

    Animated.parallel([
      Animated.timing(cardsOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(cardsTranslate, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [cardsOpacity, cardsTranslate, heroPulse]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHeatZones((prev) =>
        prev.map((zone) => {
          const noise = (Math.random() - 0.5) * 0.15;
          const intensity = Math.min(1, Math.max(0.25, zone.intensity + noise));
          return { ...zone, intensity };
        })
      );
      setHeatLastUpdated(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDial = (value: string) => {
    Linking.openURL(`tel:${value}`).catch(() => router.push('/screens/Emergency'));
  };

  const handleSmartCheckIn = () => {
    const now = new Date();
    setLastCheckIn(formatTime(now));
    Alert.alert('Check-in sent', 'Trusted contacts were pinged.');
  };

  const handleSOSTrigger = () => {
    const timestamp = formatTime(new Date());
    setSosActivatedAt(timestamp);
    Alert.alert('SOS armed', 'Calling 112 and sharing your live track.');
    router.push('/screens/SOSScreen');
  };

  const handleQuickActionPress = (action: QuickAction) => {
    if (action.type === 'sos') {
      handleSOSTrigger();
      return;
    }
    if (action.route) {
      router.push(action.route);
    }
  };

  const mapRegion = {
    latitude: 28.6325,
    longitude: 77.2194,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const currentFilterLabel = heatFilters.find((option) => option.id === heatFilter)?.label ?? 'All';

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)} activeOpacity={0.8}>
            <Ionicons name="menu-outline" size={22} color={Theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerMeta}>
            <Text style={styles.headerLocation}>Connaught Place · Live feed</Text>
            <Text style={styles.headerSub}>Last sync {formatTime(heatLastUpdated)}</Text>
          </View>
          <TouchableOpacity style={styles.headerQuickAction} onPress={() => router.push('/screens/PlanTrip')} activeOpacity={0.85}>
            <Ionicons name="add-outline" size={18} color={Theme.colors.white} />
            <Text style={styles.headerQuickActionText}>Trip</Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroPulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
              transform: [
                {
                  scale: heroPulse.interpolate({ inputRange: [0, 1], outputRange: [0.99, 1.01] }),
                },
              ],
            },
          ]}
        >
          <LinearGradient colors={['#272B90', '#4F55D7', '#7B83FF']} style={styles.heroGradient}>
            <View style={styles.heroTop}>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroLabel}>New Delhi · Tonight</Text>
                <Text style={styles.heroTitle}>{t('home.nightBriefing')}</Text>
                <Text style={styles.heroSubtitle}>{weather.condition}</Text>
              </View>
              <View style={styles.weatherCard}>
                <Ionicons name={weather.icon as any} size={20} color={Theme.colors.white} />
                <Text style={styles.weatherValue}>{weather.temperature}</Text>
                <Text style={styles.weatherLabel}>Feels safe</Text>
              </View>
            </View>
            <View style={styles.heroChipRow}>
              {heroChips.map((chip) => (
                <View key={chip.id} style={styles.heroChip}>
                  <Ionicons name={chip.icon} size={14} color={Theme.colors.white} />
                  <Text style={styles.heroChipText}>{chip.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.heroStatsRow}>
              {highlightMetrics.map((stat) => (
                <View key={stat.id} style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                  <Text style={styles.heroStatValue}>{stat.value}</Text>
                  <Text style={styles.heroStatMeta}>{stat.detail}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslate }] }}
        >
          <Card radius="xl" style={styles.quickActionCard}>
            <SectionHeader title={t('home.commandCenter')} subtitle="Only the essentials" />
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.quickAction, action.type === 'sos' && styles.quickActionHighlight]}
                  onPress={() => handleQuickActionPress(action)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.quickActionIcon, action.type === 'sos' && styles.quickActionIconDanger]}>
                    <Ionicons
                      name={action.icon as any}
                      size={20}
                      color={action.type === 'sos' ? Theme.colors.danger : Theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                  <Text style={styles.quickActionDesc}>{action.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card style={styles.heatMapCard}>
            <SectionHeader title={t('home.heatMap')} subtitle="Tap a risk to focus the map" />
            <View style={styles.heatFilterRow}>
              {heatFilters.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.heatFilterPill, heatFilter === option.id && styles.heatFilterPillActive]}
                  onPress={() => setHeatFilter(option.id)}
                >
                  <Text style={[styles.heatFilterText, heatFilter === option.id && styles.heatFilterTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.heatMapWrapper}>
              <MapView
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_DEFAULT}
                initialRegion={mapRegion}
                showsUserLocation
                showsCompass={false}
              >
                {heatZones.map((zone) => (
                  <React.Fragment key={zone.id}>
                    <Circle
                      center={{ latitude: zone.latitude, longitude: zone.longitude }}
                      radius={350 + zone.intensity * 250}
                      fillColor={categoryColors[zone.category]}
                      strokeColor="transparent"
                    />
                    <Marker coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}>
                      <View style={styles.heatMarker}>
                        <Text style={styles.heatMarkerLabel}>{zone.label}</Text>
                        <Text style={styles.heatMarkerNote}>{zone.note}</Text>
                      </View>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapView>
            </View>
            <View style={styles.legendRow}>
              {HEAT_LEGEND.map((entry) => (
                <View key={entry.id} style={styles.legendBadge}>
                  <View style={[styles.legendSwatch, { backgroundColor: entry.color }]} />
                  <Text style={styles.legendLabel}>{entry.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.mapMetaRow}>
              <Ionicons name="time-outline" size={16} color={Theme.colors.subtleText} />
              <Text style={styles.mapMetaText}>Live refresh {formatTime(heatLastUpdated)} · {currentFilterLabel}</Text>
            </View>
          </Card>

          <Card style={styles.statusCard}>
            <SectionHeader title="City snapshot" subtitle="Sensors updating quietly" />
            {SAFETY_METRICS.slice(0, 2).map((metric) => (
              <View key={metric.id} style={styles.statusRow}>
                <View style={styles.statusDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.statusLabel}>{metric.label}</Text>
                  <Text style={styles.statusDetail}>{metric.detail}</Text>
                </View>
                <Text style={styles.statusScore}>{metric.value}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.essentialsCard}>
            <SectionHeader title="Local safety essentials" subtitle="Embassy, hospital & police nearby" />
            {SAFE_SPOTS.slice(0, 3).map((spot) => (
              <View key={spot.id} style={styles.essentialRow}>
                <View style={styles.essentialBadge}>
                  <Ionicons
                    name={spot.type === 'embassy' ? 'flag-outline' : spot.type === 'hospital' ? 'medkit-outline' : 'shield-outline'}
                    size={16}
                    color={Theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.essentialTitle}>{spot.name}</Text>
                  <Text style={styles.essentialMeta}>{spot.address}</Text>
                  <Text style={styles.essentialMeta}>{spot.notes}</Text>
                </View>
                <Text style={styles.essentialDistance}>{spot.distanceKm} km</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.prepCard}>
            <SectionHeader title="Readiness kit" subtitle="Keep these in check before you head out" />
            {PREPAREDNESS.slice(0, 2).map((section) => (
              <View key={section.id} style={styles.prepSection}>
                <Text style={styles.prepTitle}>{section.title}</Text>
                {section.items.slice(0, 3).map((item) => (
                  <View key={item} style={styles.prepItem}>
                    <View style={styles.prepDot} />
                    <Text style={styles.prepText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Card>

          <Card style={styles.sosCard}>
            <SectionHeader title={t('home.sosControl')} subtitle="Hold to dispatch" />
            <PanicSlider label="Hold to trigger SOS" onActivate={handleSOSTrigger} />
            <View style={styles.sosMetaRow}>
              <View style={styles.sosMetaBlock}>
                <Text style={styles.sosMetaLabel}>Last dispatch</Text>
                <Text style={styles.sosMetaValue}>{sosActivatedAt ?? 'Not triggered'}</Text>
                <Text style={styles.sosMetaDetail}>Routes shared instantly</Text>
              </View>
              <View style={styles.sosMetaBlock}>
                <Text style={styles.sosMetaLabel}>Check-in</Text>
                <Text style={styles.sosMetaValue}>{lastCheckIn ?? '--:--'}</Text>
                <TouchableOpacity onPress={handleSmartCheckIn}>
                  <Text style={styles.sosLink}>Send smart check-in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </Animated.View>

        <SectionHeader
          title={t('home.liveAlerts')}
          subtitle="Crowd-sourced safety signals"
          actionLabel="Report"
          onActionPress={() => router.push('/screens/Reports')}
        />
        <View style={styles.alertGroup}>
          {SAFETY_ALERTS.slice(0, 3).map((alert) => (
            <Card key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={[styles.alertBadge, alert.level === 'critical' && styles.alertBadgeCritical]}>
                  <Text style={styles.alertBadgeText}>{alert.level.toUpperCase()}</Text>
                </View>
                <Text style={styles.alertDistance}>{alert.distanceKm} km</Text>
              </View>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDescription}>{alert.description}</Text>
              <TouchableOpacity style={styles.alertLink} onPress={() => router.push('/screens/Emergency')}>
                <Text style={styles.alertLinkText}>View guidance</Text>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.primary} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        <Card style={styles.sectionCard}>
          <SectionHeader title={t('home.trustedContacts')} subtitle="Auto notify when SOS triggers" />
          {contactsToShow.slice(0, 3).map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactMeta}>{contact.phone}</Text>
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(`sms:${contact.phone}`)}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={Theme.colors.subtleText} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.ghostButton} onPress={() => router.push('/tabs/profile')}>
            <Text style={styles.ghostButtonText}>Manage contacts</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title={t('home.hotlines')} subtitle="Tap to dial" />
          {RESOURCE_LINKS.slice(0, 3).map((resource) => (
            <View key={resource.id} style={styles.resourceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceSummary}>{resource.summary}</Text>
              </View>
              <TouchableOpacity style={styles.resourceButton} onPress={() => handleDial(resource.contactValue)}>
                <Ionicons name="call-outline" size={18} color={Theme.colors.white} />
                <Text style={styles.resourceButtonText}>{resource.contactValue}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      </ScrollView>

      <TouchableOpacity style={styles.floatingSos} onPress={handleSOSTrigger} activeOpacity={0.9}>
        <Ionicons name="flash-outline" size={20} color={Theme.colors.white} />
        <View>
          <Text style={styles.floatingSosText}>SOS ready</Text>
          <Text style={styles.floatingSosSub}>Tap to dispatch right now</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)} />
          <View style={styles.menuSheet}>
            <View style={styles.menuHeaderRow}>
              <Text style={styles.menuHeaderTitle}>Quick menu</Text>
              <TouchableOpacity style={styles.menuCloseButton} onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={20} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuOption}
                onPress={() => {
                  setMenuVisible(false);
                  router.push(item.route);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon as any} size={18} color={Theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuOptionText}>{item.label}</Text>
                  <Text style={styles.menuOptionDesc}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Theme.colors.subtleText} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl * 3,
    gap: Theme.spacing.md,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMeta: {
    flex: 1,
  },
  headerLocation: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  headerSub: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  headerQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
  },
  headerQuickActionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  hero: {
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: Theme.spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.md,
  },
  heroTitleBlock: {
    flex: 1,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Theme.font.family.sans,
  },
  heroTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
    marginTop: Theme.spacing.xs,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: Theme.spacing.sm,
    fontFamily: Theme.font.family.sans,
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    minWidth: 100,
  },
  weatherValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.lg,
  },
  weatherLabel: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.8)',
  },
  heroChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroChipText: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.xs,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  heroStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
  },
  heroStatLabel: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.7)',
  },
  heroStatValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.lg,
    marginVertical: Theme.spacing.xs,
  },
  heroStatMeta: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.8)',
    fontSize: Theme.font.size.sm,
  },
  quickActionCard: {
    marginTop: Theme.spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  quickActionHighlight: {
    borderColor: 'rgba(244,67,54,0.25)',
    backgroundColor: 'rgba(244,67,54,0.08)',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,191,165,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  quickActionIconDanger: {
    backgroundColor: 'rgba(244,67,54,0.15)',
  },
  quickActionLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  quickActionDesc: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    marginTop: 4,
    fontSize: Theme.font.size.sm,
  },
  heatMapCard: {
    gap: Theme.spacing.md,
  },
  heatFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  heatFilterPill: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.1)',
  },
  heatFilterPillActive: {
    backgroundColor: 'rgba(0,191,165,0.1)',
    borderColor: Theme.colors.primary,
  },
  heatFilterText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  heatFilterTextActive: {
    color: Theme.colors.primary,
  },
  heatMapWrapper: {
    height: 240,
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
  heatMarker: {
    backgroundColor: Theme.colors.white,
    padding: 6,
    borderRadius: Theme.radius.md,
    maxWidth: 140,
  },
  heatMarkerLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  heatMarkerNote: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  legendBadge: {
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
  mapMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  mapMetaText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  statusCard: {
    gap: Theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.secondary,
  },
  statusLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  statusDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  statusScore: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.secondary,
  },
  essentialsCard: {
    gap: Theme.spacing.md,
  },
  essentialRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    paddingBottom: Theme.spacing.sm,
  },
  essentialBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,191,165,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  essentialTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  essentialMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  essentialDistance: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
  },
  prepCard: {
    gap: Theme.spacing.md,
  },
  prepSection: {
    gap: Theme.spacing.xs,
  },
  prepTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  prepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
  },
  prepText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  sosCard: {
    gap: Theme.spacing.md,
  },
  sosMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  sosMetaBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
  },
  sosMetaLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  sosMetaValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.lg,
    marginTop: 4,
  },
  sosMetaDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  sosLink: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    marginTop: Theme.spacing.sm / 2,
  },
  alertGroup: {
    gap: Theme.spacing.sm,
  },
  alertCard: {
    gap: Theme.spacing.xs,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255,193,7,0.15)',
  },
  alertBadgeCritical: {
    backgroundColor: 'rgba(244,67,54,0.15)',
  },
  alertBadgeText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.xs,
  },
  alertDistance: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  alertTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  alertDescription: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  alertLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  alertLinkText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
  },
  sectionCard: {
    gap: Theme.spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitial: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.primary,
  },
  contactName: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  contactMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  ghostButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  ghostButtonText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  resourceTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  resourceSummary: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    marginTop: 4,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    gap: Theme.spacing.xs,
  },
  resourceButtonText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  floatingSos: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.danger,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    ...Theme.shadows.lg,
  },
  floatingSosText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.md,
  },
  floatingSosSub: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.85)',
    fontSize: Theme.font.size.xs,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuHeaderTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  menuCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,191,165,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  menuOptionDesc: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
});

export default HomeScreen;
