// Premium dashboard home with live metrics, alerts, and concierge actions.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import MetricCard from '../../components/ui/MetricCard';
import AlertCard from '../../components/ui/AlertCard';
import MapPreview from '../../components/ui/MapPreview';
import AppButton from '../../components/ui/AppButton';
import { Theme } from '../../constants/theme';
import {
  PREPAREDNESS,
  RESOURCE_LINKS,
  SAFETY_ALERTS,
  SAFETY_METRICS,
  SAFE_SPOTS,
  TRUSTED_CONTACTS as STATIC_CONTACTS,
} from '../../src/lib/safety-data';
import { useAppStore } from '../../src/store/use-app-store';
import { fetchWeatherForCoords } from '../../src/lib/weather';

const quickActions = [
  { id: 'plan', label: 'Plan trip', icon: 'map-outline', route: '/screens/PlanTrip' },
  { id: 'routes', label: 'Safe routes', icon: 'navigate-outline', route: '/screens/TravelRoutes' },
  { id: 'incident', label: 'Report', icon: 'megaphone-outline', route: '/screens/Reports' },
  { id: 'sos', label: 'Emergency', icon: 'alert-circle-outline', route: '/screens/Emergency' },
];

const HomeScreen = () => {
  const router = useRouter();
  const { trips, trustedContacts } = useAppStore();
  const [weather, setWeather] = useState({ temperature: '--', condition: 'Loading...', icon: 'cloud-outline' });

  const upcomingTrip = useMemo(() => {
    const sorted = [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted.find((trip) => new Date(trip.startDate) >= new Date());
  }, [trips]);

  useEffect(() => {
    fetchWeatherForCoords(28.6139, 77.209).then((data) => setWeather(data));
  }, []);

  const contactsToShow = trustedContacts.length > 0 ? trustedContacts : STATIC_CONTACTS;

  const handleDial = (value: string) => {
    Linking.openURL(`tel:${value}`).catch(() => router.push('/screens/Emergency'));
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.hero}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLabel}>New Delhi · Tonight</Text>
              <Text style={styles.heroTitle}>Stay situationally aware</Text>
            </View>
            <View style={styles.weatherCard}>
              <Ionicons name={weather.icon as any} size={20} color={Theme.colors.white} />
              <Text style={styles.weatherValue}>{weather.temperature}</Text>
              <Text style={styles.weatherLabel}>{weather.condition}</Text>
            </View>
          </View>
          {upcomingTrip ? (
            <Text style={styles.heroTrip}>
              Next: {upcomingTrip.city} ({upcomingTrip.startDate} → {upcomingTrip.endDate})
            </Text>
          ) : (
            <Text style={styles.heroTrip}>No active trips. Plan one to unlock tailored alerts.</Text>
          )}
        </LinearGradient>

        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickAction} onPress={() => router.push(action.route)}>
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon as any} size={20} color={Theme.colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="City safety metrics" subtitle="Powered by live crowd data" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsRow}>
          {SAFETY_METRICS.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </ScrollView>

        <SectionHeader title="Live alerts" actionLabel="View reports" onActionPress={() => router.push('/screens/Reports')} />
        {SAFETY_ALERTS.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onViewMap={() => router.push('/screens/Emergency')} />
        ))}

        <Card style={styles.mapCard}>
          <SectionHeader title="Safe zones around you" subtitle="Trust badges updated every 10 min" />
          <MapPreview
            region={{ latitude: 28.6143, longitude: 77.2089, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
            markers={SAFE_SPOTS.map((spot) => ({
              id: spot.id,
              coordinate: { latitude: spot.latitude, longitude: spot.longitude },
              label: spot.name,
            }))}
            circles={SAFETY_ALERTS.map((alert) => ({
              id: alert.id,
              center: { latitude: alert.latitude, longitude: alert.longitude },
              radius: alert.impactRadius,
              strokeColor: Theme.colors.warning,
              fillColor: 'rgba(255,193,7,0.15)',
            }))}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title="Trusted contacts" subtitle="Auto notify when SOS triggers" />
          {contactsToShow.slice(0, 3).map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
              </View>
              <View style={styles.contactBody}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactMeta}>{contact.phone}</Text>
              </View>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Theme.colors.subtleText} />
            </View>
          ))}
          <AppButton title="Manage contacts" variant="ghost" onPress={() => router.push('/tabs/profile')} />
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title="Preparedness" subtitle="Travel kit status" />
          {PREPAREDNESS.map((section) => (
            <View key={section.id} style={styles.prepBlock}>
              <Text style={styles.prepTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <Text key={item} style={styles.prepItem}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title="Hotlines" subtitle="Tap to dial" />
          {RESOURCE_LINKS.map((resource) => (
            <View key={resource.id} style={styles.resourceRow}>
              <View>
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
  },
  hero: {
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Theme.font.family.sans,
  },
  heroTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    minWidth: 90,
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
  heroTrip: {
    marginTop: Theme.spacing.md,
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.9)',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  quickAction: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,191,165,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  quickActionLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  metricsRow: {
    paddingBottom: Theme.spacing.lg,
  },
  mapCard: {
    marginVertical: Theme.spacing.lg,
    paddingBottom: 0,
  },
  sectionCard: {
    marginBottom: Theme.spacing.lg,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  contactInitial: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.primary,
  },
  contactBody: {
    flex: 1,
  },
  contactName: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  contactMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  prepBlock: {
    marginBottom: Theme.spacing.md,
  },
  prepTitle: {
    fontFamily: Theme.font.family.sansBold,
    marginBottom: Theme.spacing.xs,
    color: Theme.colors.text,
  },
  prepItem: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  resourceTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  resourceSummary: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
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
