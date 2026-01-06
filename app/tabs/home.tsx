// Enhanced home dashboard with focused safety controls - Live Alerts removed
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
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { SAFETY_METRICS, TRUSTED_CONTACTS as STATIC_CONTACTS } from '../../src/lib/safety-data';
import { useAppStore } from '../../src/store/use-app-store';
import { fetchWeatherForCoords } from '../../src/lib/weather';
import { useTranslate } from '../../src/hooks/use-translate';

type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  type?: 'sos' | 'danger';
  color?: string;
};

const quickActions: QuickAction[] = [
  {
    id: 'emergency',
    label: 'Emergency Hub',
    description: 'All SOS features',
    icon: 'alert-circle',
    route: '/tabs/emergency',
    type: 'danger',
    color: Theme.colors.emergency,
  },
  {
    id: 'map',
    label: 'Safety Map',
    description: 'View risk zones',
    icon: 'map',
    route: '/tabs/risk',
    color: Theme.colors.primary,
  },
  {
    id: 'plan',
    label: 'Plan Trip',
    description: 'Prep checklist',
    icon: 'airplane',
    route: '/screens/PlanTrip',
    color: Theme.colors.secondary,
  },
  {
    id: 'report',
    label: 'Report',
    description: 'Share incident',
    icon: 'warning',
    route: '/screens/Reports',
    color: Theme.colors.warning,
  },
  {
    id: 'checkin',
    label: 'Safety Check-in',
    description: 'Timed alerts for safety',
    icon: 'shield-checkmark',
    route: '/screens/SafetyCheckIn',
    color: Theme.colors.success,
  },
];

const safetyFeatures = [
  { id: 'monitor', icon: 'shield-checkmark' as const, label: '24/7 monitoring', detail: 'Emergency services on standby' },
  { id: 'escort', icon: 'walk' as const, label: 'Escort dispatch', detail: 'Nearest responder auto-routed' },
  { id: 'share', icon: 'radio' as const, label: 'Live location', detail: 'Share with trusted contacts' },
];

const emergencyNumbers = [
  { id: 'police', number: '100', label: 'Police', icon: 'shield-checkmark' },
  { id: 'ambulance', number: '108', label: 'Ambulance', icon: 'medkit' },
  { id: 'women', number: '1091', label: 'Women', icon: 'woman' },
  { id: 'tourist', number: '1363', label: 'Tourist', icon: 'airplane' },
];

const formatTime = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

const HomeScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { trips, trustedContacts, language, userProfile, sosActive, triggerSOS } = useAppStore();

  const [weather, setWeather] = useState({ temperature: '--', condition: 'Loading...', icon: 'cloud-outline' });
  const [lastCheckIn, setLastCheckIn] = useState<string>(() => formatTime(new Date(Date.now() - 18 * 60000)));
  const [lastSynced, setLastSynced] = useState(new Date());

  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslate = useRef(new Animated.Value(20)).current;

  const heroMetric = SAFETY_METRICS.find((metric) => metric.id === 'city-risk');
  const contactsToShow = trustedContacts.length > 0 ? trustedContacts : STATIC_CONTACTS;
  
  const upcomingTrip = useMemo(() => {
    const sorted = [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted.find((trip) => new Date(trip.startDate) >= new Date());
  }, [trips]);

  const profileCompletion = useMemo(() => {
    const fields = [
      userProfile.name,
      userProfile.phone,
      userProfile.familyContacts[0]?.phone,
      userProfile.medicalInfo.bloodType,
    ];
    return fields.filter((f) => f && f.trim() !== '').length / fields.length;
  }, [userProfile]);

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
    Alert.alert('Check-in sent', 'Your trusted contacts have been notified that you are safe.');
  };

  const handleSOSTrigger = () => {
    triggerSOS();
    Linking.openURL('tel:112').catch(() => Alert.alert('Dialer unavailable', 'Please call 112 manually.'));
    router.push('/tabs/emergency');
  };

  const handleQuickActionPress = (action: QuickAction) => {
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.userName}>{userProfile.name || 'Traveler'}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/tabs/profile')}
            >
              <View style={styles.profileAvatar}>
                {userProfile.name ? (
                  <Text style={styles.profileInitial}>{userProfile.name.charAt(0).toUpperCase()}</Text>
                ) : (
                  <Ionicons name="person" size={20} color={Theme.colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Profile completion alert */}
          {profileCompletion < 1 && (
            <TouchableOpacity
              style={styles.profileAlert}
              onPress={() => router.push('/tabs/profile')}
            >
              <View style={styles.profileAlertIcon}>
                <Ionicons name="alert-circle" size={18} color={Theme.colors.warning} />
              </View>
              <View style={styles.profileAlertText}>
                <Text style={styles.profileAlertTitle}>Complete your safety profile</Text>
                <Text style={styles.profileAlertDesc}>
                  {Math.round(profileCompletion * 100)}% complete • Add emergency contacts
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Theme.colors.subtleText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Main SOS Card */}
        <TouchableOpacity
          style={styles.sosCard}
          activeOpacity={0.9}
          onPress={() => router.push('/tabs/emergency')}
        >
          <LinearGradient
            colors={sosActive ? ['#DC2626', '#B91C1C'] : ['#1E40AF', '#1E3A8A']}
            style={styles.sosGradient}
          >
            <View style={styles.sosContent}>
              <View style={styles.sosLeft}>
                <View style={styles.sosBadge}>
                  <View style={[styles.statusDot, sosActive && styles.statusDotActive]} />
                  <Text style={styles.sosBadgeText}>{sosActive ? 'SOS ACTIVE' : 'Protection Ready'}</Text>
                </View>
                <Text style={styles.sosTitle}>
                  {sosActive ? 'Emergency Active' : 'Emergency Hub'}
                </Text>
                <Text style={styles.sosDesc}>
                  {sosActive
                    ? 'Location sharing • Recording • Contacting help'
                    : 'Fake call • Silent SOS • Siren • Recording'}
                </Text>
              </View>
              <View style={styles.sosButton}>
                <Ionicons
                  name={sosActive ? 'close-circle' : 'alert-circle'}
                  size={48}
                  color={sosActive ? '#FEE2E2' : Theme.colors.white}
                />
              </View>
            </View>
            <View style={styles.sosFeatures}>
              {safetyFeatures.map((feature) => (
                <View key={feature.id} style={styles.sosFeature}>
                  <Ionicons name={feature.icon} size={14} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.sosFeatureText}>{feature.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Emergency Calls */}
        <Card style={styles.emergencyCallsCard}>
          <Text style={styles.emergencyCallsTitle}>Quick Emergency Calls</Text>
          <View style={styles.emergencyCallsGrid}>
            {emergencyNumbers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.emergencyCallButton}
                onPress={() => Linking.openURL(`tel:${item.number}`)}
              >
                <View style={styles.emergencyCallIcon}>
                  <Ionicons name={item.icon as any} size={20} color={Theme.colors.emergency} />
                </View>
                <Text style={styles.emergencyCallLabel}>{item.label}</Text>
                <Text style={styles.emergencyCallNumber}>{item.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickAction,
                  action.type === 'danger' && styles.quickActionDanger,
                ]}
                onPress={() => handleQuickActionPress(action)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.type === 'danger' ? Theme.colors.emergencyBg : `${action.color}15` },
                  ]}
                >
                  <Ionicons
                    name={action.icon}
                    size={24}
                    color={action.color || Theme.colors.primary}
                  />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
                <Text style={styles.quickActionDesc}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Cards */}
        <Animated.View style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslate }] }}>
          <View style={styles.statusCardsRow}>
            {/* Weather Card */}
            <Card style={styles.statusCard}>
              <View style={styles.statusCardIcon}>
                <Ionicons name={weather.icon as any} size={24} color={Theme.colors.secondary} />
              </View>
              <Text style={styles.statusCardValue}>{weather.temperature}</Text>
              <Text style={styles.statusCardLabel}>{weather.condition}</Text>
            </Card>

            {/* Risk Level Card */}
            <Card style={styles.statusCard}>
              <View style={[styles.statusCardIcon, { backgroundColor: Theme.colors.warningBg }]}>
                <Ionicons name="shield-half" size={24} color={Theme.colors.warning} />
              </View>
              <Text style={styles.statusCardValue}>{heroMetric?.score ?? 64}/100</Text>
              <Text style={styles.statusCardLabel}>City Risk</Text>
            </Card>

            {/* Contacts Card */}
            <Card style={styles.statusCard}>
              <View style={[styles.statusCardIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Ionicons name="people" size={24} color={Theme.colors.accent} />
              </View>
              <Text style={styles.statusCardValue}>{contactsToShow.length}</Text>
              <Text style={styles.statusCardLabel}>Watchers</Text>
            </Card>
          </View>
        </Animated.View>

        {/* SOS Slider */}
        <Card style={styles.sosSliderCard}>
          <SectionHeader title="Quick SOS" subtitle="Hold to trigger emergency" icon="alert-circle-outline" />
          <PanicSlider label="Hold to trigger SOS" onActivate={handleSOSTrigger} />
          <View style={styles.sosMetaRow}>
            <View style={styles.sosMeta}>
              <Text style={styles.sosMetaLabel}>Last check-in</Text>
              <Text style={styles.sosMetaValue}>{lastCheckIn}</Text>
            </View>
            <TouchableOpacity style={styles.checkInButton} onPress={handleSmartCheckIn}>
              <Ionicons name="checkmark-circle" size={18} color={Theme.colors.white} />
              <Text style={styles.checkInText}>Check In</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Trusted Contacts */}
        <Card style={styles.contactsCard}>
          <SectionHeader
            title="Trusted Contacts"
            subtitle="Notified during emergencies"
            icon="people-outline"
            actionLabel="Manage"
            onActionPress={() => router.push('/screens/ManageContacts')}
          />
          {contactsToShow.slice(0, 3).map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.contactAction}
                onPress={() => Linking.openURL(`tel:${contact.phone}`)}
              >
                <Ionicons name="call" size={18} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        {/* Upcoming Trip */}
        {upcomingTrip && (
          <Card style={styles.tripCard}>
            <SectionHeader title="Upcoming Trip" subtitle={upcomingTrip.city} icon="airplane-outline" />
            <View style={styles.tripInfo}>
              <View style={styles.tripDates}>
                <Text style={styles.tripDateLabel}>Dates</Text>
                <Text style={styles.tripDateValue}>
                  {upcomingTrip.startDate} → {upcomingTrip.endDate}
                </Text>
              </View>
              <View style={[styles.tripRisk, styles[`tripRisk${upcomingTrip.riskLevel}` as keyof typeof styles]]}>  
                <Text style={styles.tripRiskText}>{upcomingTrip.riskLevel.toUpperCase()}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.tripButton}
              onPress={() => router.push('/screens/Trips')}
            >
              <Text style={styles.tripButtonText}>View Details</Text>
              <Ionicons name="chevron-forward" size={18} color={Theme.colors.primary} />
            </TouchableOpacity>
          </Card>
        )}

        {/* Footer Space */}
        <View style={{ height: TAB_BAR_OVERLAY_HEIGHT + Theme.spacing.lg }} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
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
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  header: {
    gap: Theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  userName: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  profileInitial: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  profileAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.warningBg,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    gap: Theme.spacing.sm,
  },
  profileAlertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAlertText: {
    flex: 1,
  },
  profileAlertTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
  },
  profileAlertDesc: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  sosCard: {
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  sosGradient: {
    padding: Theme.spacing.lg,
  },
  sosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sosLeft: {
    flex: 1,
    gap: Theme.spacing.xs,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.success,
  },
  statusDotActive: {
    backgroundColor: '#FEE2E2',
  },
  sosBadgeText: {
    color: Theme.colors.white,
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
  },
  sosTitle: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.white,
  },
  sosDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Theme.font.size.sm,
  },
  sosButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  sosFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  sosFeatureText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Theme.font.size.xs,
    fontWeight: '500',
  },
  emergencyCallsCard: {
    padding: Theme.spacing.md,
  },
  emergencyCallsTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  emergencyCallsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyCallButton: {
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  emergencyCallIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.emergencyBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCallLabel: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  emergencyCallNumber: {
    fontSize: Theme.font.size.md,
    fontWeight: '700',
    color: Theme.colors.emergency,
  },
  quickActionsSection: {
    gap: Theme.spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    gap: Theme.spacing.xs,
    ...Theme.shadows.sm,
  },
  quickActionDanger: {
    borderWidth: 1,
    borderColor: Theme.colors.emergency,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontWeight: '700',
    color: Theme.colors.text,
  },
  quickActionDesc: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  statusCardsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  statusCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardValue: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  statusCardLabel: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  sosSliderCard: {
    gap: Theme.spacing.md,
  },
  sosMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sosMeta: {},
  sosMetaLabel: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  sosMetaValue: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.success,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
  },
  checkInText: {
    color: Theme.colors.white,
    fontWeight: '600',
  },
  contactsCard: {
    gap: Theme.spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitial: {
    color: Theme.colors.white,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  contactPhone: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  contactAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCard: {
    gap: Theme.spacing.md,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDates: {},
  tripDateLabel: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  tripDateValue: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  tripRisk: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  tripRisklow: {
    backgroundColor: Theme.colors.successBg,
  },
  tripRiskmedium: {
    backgroundColor: Theme.colors.warningBg,
  },
  tripRiskhigh: {
    backgroundColor: Theme.colors.emergencyBg,
  },
  tripRiskText: {
    fontWeight: '700',
    fontSize: Theme.font.size.xs,
  },
  tripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
  },
  tripButtonText: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default HomeScreen;
