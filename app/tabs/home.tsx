// Streamlined home dashboard with focused safety controls.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import PanicSlider from '../../components/ui/PanicSlider';
import BrandMark from '../../components/ui/BrandMark';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { SAFETY_ALERTS, SAFETY_METRICS, TRUSTED_CONTACTS as STATIC_CONTACTS } from '../../src/lib/safety-data';
import { useAppStore } from '../../src/store/use-app-store';
import { fetchWeatherForCoords } from '../../src/lib/weather';
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

const safetyFeatures = [
  { id: 'monitor', icon: 'shield-checkmark-outline' as const, label: '24/7 command monitoring', detail: 'Ops desk tracks SOS once armed.' },
  { id: 'escort', icon: 'walk-outline' as const, label: 'Escort dispatch', detail: 'Nearest responder auto-routed to you.' },
  { id: 'share', icon: 'radio-outline' as const, label: 'Live trail share', detail: 'Trusted network sees real-time movement.' },
  { id: 'police', icon: 'business-outline' as const, label: 'Nearest police desk', detail: 'Connaught Place station · 0.9 km · 112' },
  { id: 'hospital', icon: 'medkit-outline' as const, label: 'Trauma & clinics', detail: 'RML ER · bilingual desk · 1.8 km' },
  { id: 'pharmacy', icon: 'bandage-outline' as const, label: '24x7 pharmacy', detail: 'Apollo Janpath · meds + delivery · 1.1 km' },
  { id: 'helpdesk', icon: 'flag-outline' as const, label: 'Tourist helpdesk', detail: '1363 tourism line patched into SOS' },
];

const responderFeed = [
  { id: 'ops', title: 'Ops desk synced', detail: 'Command linked your live location', time: '22:18' },
  { id: 'dispatch', title: 'Responder routed', detail: 'Bravo-3 dispatched from Janpath post', time: '22:19' },
  { id: 'checkin', title: 'Check-in sent', detail: 'Trusted contacts acknowledged receipt', time: '22:21' },
];

const safetyNetwork = [
  { id: 'police', icon: 'shield-checkmark-outline' as const, label: 'Connaught Place Police', distance: '0.9 km', contact: '112' },
  { id: 'hospital', icon: 'medkit-outline' as const, label: 'RML Emergency & Trauma', distance: '1.8 km', contact: '011-23365555' },
  { id: 'pharmacy', icon: 'bandage-outline' as const, label: 'Apollo 24x7 Pharmacy', distance: '1.1 km', contact: '011-22221111' },
  { id: 'embassy', icon: 'flag-outline' as const, label: 'Tourist assistance desk', distance: '1.4 km', contact: '1363' },
];

const formatTime = (date: Date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const HomeScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { trips, trustedContacts, language } = useAppStore();

  const [weather, setWeather] = useState({ temperature: '--', condition: 'Loading...', icon: 'cloud-outline' });
  const [lastCheckIn, setLastCheckIn] = useState<string>(() => formatTime(new Date(Date.now() - 18 * 60000)));
  const [sosActivatedAt, setSosActivatedAt] = useState<string>(() => formatTime(new Date(Date.now() - 120 * 60000)));
  const [lastSynced, setLastSynced] = useState(new Date());

  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslate = useRef(new Animated.Value(20)).current;

  const heroMetric = SAFETY_METRICS.find((metric) => metric.id === 'city-risk');
  const contactsToShow = trustedContacts.length > 0 ? trustedContacts : STATIC_CONTACTS;
  const upcomingTrip = useMemo(() => {
    const sorted = [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted.find((trip) => new Date(trip.startDate) >= new Date());
  }, [trips]);

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

  const headerStatusPills = useMemo(
    () => [
      { id: 'watchers', icon: 'people-outline' as const, label: `${contactsToShow.length} trusted eyes` },
      { id: 'sync', icon: 'time-outline' as const, label: `Synced ${formatTime(lastSynced)}` },
      { id: 'weather', icon: 'thermometer-outline' as const, label: `${weather.temperature} • comfort` },
    ],
    [contactsToShow.length, lastSynced, weather.temperature]
  );

  useEffect(() => {
    fetchWeatherForCoords(28.6139, 77.209).then((data) => {
      setWeather(data);
      setLastSynced(new Date());
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLastSynced(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardsOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(cardsTranslate, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [cardsOpacity, cardsTranslate]);

  const handleSmartCheckIn = () => {
    const now = new Date();
    setLastCheckIn(formatTime(now));
    Alert.alert('Check-in sent', 'Trusted contacts were pinged.');
  };

  const handleSOSTrigger = () => {
    const timestamp = formatTime(new Date());
    setSosActivatedAt(timestamp);
    Linking.openURL('tel:112').catch(() => Alert.alert('Dialer unavailable', 'Please call 112 manually.'));
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

  return (
    <Screen style={styles.screen} contentStyle={styles.screenContent}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="always"
      >
        <View style={styles.topShell}>
          <View style={styles.headerSurface}>
            <View style={styles.brandRow}>
              <BrandMark size={46} label="Command console" />
              <TouchableOpacity onPress={() => router.push('/tabs/profile')} activeOpacity={0.85} style={styles.brandProfile}>
                <Ionicons name="person-circle-outline" size={26} color={Theme.colors.primary} />
                <Text style={styles.brandProfileText}>{t('profile.identity')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pageHeader}>
              <View style={styles.headerMeta}>
                <Text style={styles.headerLocation}>Connaught Place · Live feed</Text>
                <Text style={styles.headerSub}>Last sync {formatTime(lastSynced)}</Text>
              </View>
              <TouchableOpacity
                style={styles.headerQuickAction}
                onPress={() => router.push('/screens/PlanTrip')}
                activeOpacity={0.85}
              >
                <Ionicons name="add-outline" size={18} color={Theme.colors.white} />
                <Text style={styles.headerQuickActionText}>Trip</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerStatusRow}>
              {headerStatusPills.map((pill) => (
                <View key={pill.id} style={styles.headerStatusChip}>
                  <Ionicons name={pill.icon} size={14} color={Theme.colors.primary} />
                  <Text style={styles.headerStatusText}>{pill.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.hero}>
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
          </View>

          <Card style={styles.sectionCard}>
            <SectionHeader
              title="Nearest help on standby"
              subtitle="Police, hospital, pharmacy, and tourist desk at a glance"
              icon="pulse-outline"
              actionLabel="Open map"
              onActionPress={() => router.push('/tabs/risk')}
            />
            <View style={styles.networkList}>
              {safetyNetwork.map((item) => (
                <View key={item.id} style={styles.networkRow}>
                  <View style={styles.networkIcon}>
                    <Ionicons name={item.icon} size={16} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.networkLabel}>{item.label}</Text>
                    <Text style={styles.networkMeta}>{item.distance} away · tap to call</Text>
                  </View>
                  <TouchableOpacity style={styles.networkAction} onPress={() => Linking.openURL(`tel:${item.contact}`)}>
                    <Ionicons name="call-outline" size={16} color={Theme.colors.white} />
                    <Text style={styles.networkActionText}>Call</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <Animated.View style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslate }] }}>
          <View style={styles.cardStack}>
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

            <Card style={styles.sosCard}>
              <SectionHeader title={t('home.sosControl')} subtitle="Hold to dispatch" icon="pulse-outline" />
              <PanicSlider label="Hold to trigger SOS" onActivate={handleSOSTrigger} />
              <View style={styles.sosMetaRow}>
                <View style={styles.sosMetaBlock}>
                  <Text style={styles.sosMetaLabel}>Last dispatch</Text>
                  <Text style={styles.sosMetaValue}>{sosActivatedAt}</Text>
                  <Text style={styles.sosMetaDetail}>Routes shared instantly</Text>
                </View>
                <View style={styles.sosMetaBlock}>
                  <Text style={styles.sosMetaLabel}>Check-in</Text>
                  <Text style={styles.sosMetaValue}>{lastCheckIn}</Text>
                  <TouchableOpacity onPress={handleSmartCheckIn}>
                    <Text style={styles.sosLink}>Send smart check-in</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.sosMetaBlock, styles.sosMetaBlockAccent]}>
                  <Text style={styles.sosMetaLabel}>Responder ETA</Text>
                  <Text style={styles.sosMetaValue}>4 min</Text>
                  <Text style={styles.sosMetaDetail}>Bravo-3 · Delhi Police</Text>
                </View>
              </View>
              <View style={styles.safetyFeatureGrid}>
                {safetyFeatures.map((feature) => (
                  <View key={feature.id} style={styles.safetyFeature}>
                    <View style={styles.safetyFeatureIcon}>
                      <Ionicons name={feature.icon} size={16} color={Theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.safetyFeatureLabel}>{feature.label}</Text>
                      <Text style={styles.safetyFeatureDetail}>{feature.detail}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.timelineSection}>
                <Text style={styles.timelineTitle}>Dispatch timeline</Text>
                {responderFeed.map((item, index) => (
                  <View key={item.id} style={styles.timelineRow}>
                    <View style={styles.timelineDotWrap}>
                      <View style={styles.timelineDot} />
                      {index !== responderFeed.length - 1 ? <View style={styles.timelineLine} /> : null}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.timelineHeader}>
                        <Text style={styles.timelineEvent}>{item.title}</Text>
                        <Text style={styles.timelineTime}>{item.time}</Text>
                      </View>
                      <Text style={styles.timelineDetail}>{item.detail}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </Animated.View>

        <SectionHeader
          title={t('home.liveAlerts')}
          subtitle="Crowd-sourced safety signals"
          icon="notifications-outline"
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
          <SectionHeader title={t('home.trustedContacts')} subtitle="Auto notify when SOS triggers" icon="people-outline" />
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

      </ScrollView>

    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
    gap: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  screenContent: {
    paddingHorizontal: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl + TAB_BAR_OVERLAY_HEIGHT,
    gap: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  topShell: {
    gap: Theme.spacing.md,
  },
  headerSurface: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(15,23,42,0.05)',
  },
  brandProfileText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.xs,
  },
  cardStack: {
    gap: Theme.spacing.lg,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  headerMeta: {
    flex: 1,
  },
  headerLocation: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
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
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
  },
  headerQuickActionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  headerStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  headerStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  headerStatusText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
  },
  hero: {
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  heroGradient: {
    padding: Theme.spacing.md,
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
  networkList: {
    gap: Theme.spacing.sm,
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.white,
  },
  networkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(85,99,255,0.12)',
  },
  networkLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  networkMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  networkAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  networkActionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
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
  sosCard: {
    gap: Theme.spacing.md,
  },
  sosMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
    flexWrap: 'wrap',
  },
  sosMetaBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.white,
    minWidth: '48%',
  },
  sosMetaBlockAccent: {
    borderColor: 'rgba(0,191,165,0.3)',
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
  safetyFeatureGrid: {
    borderTopWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    paddingTop: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  safetyFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.sm,
  },
  safetyFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(85,99,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyFeatureLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  safetyFeatureDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  timelineSection: {
    borderTopWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    paddingTop: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  timelineTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  timelineDotWrap: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.1)',
    marginTop: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineEvent: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  timelineTime: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  timelineDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
    marginTop: 2,
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
});

export default HomeScreen;
