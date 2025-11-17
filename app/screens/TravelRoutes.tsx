import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../components/ui/Screen';
import SectionHeader from '../../components/ui/SectionHeader';
import { Theme } from '../../constants/theme';
import AppButton from '../../components/ui/AppButton';
import Card from '../../components/ui/Card';
import MapPreview from '../../components/ui/MapPreview';

type RouteOption = {
  id: string;
  label: string;
  duration: string;
  distance: string;
  score: number;
  highlights: string[];
};

const ROUTES: RouteOption[] = [
  {
    id: 'safe',
    label: 'Embassy boulevard',
    duration: '18 min',
    distance: '4.3 km',
    score: 90,
    highlights: ['Well-lit avenue', 'CCTV patrols', '2 safe cafés on route'],
  },
  {
    id: 'scenic',
    label: 'Heritage walk',
    duration: '25 min',
    distance: '4.8 km',
    score: 74,
    highlights: ['Crowd monitored', 'Festival checkpoints', 'Police kiosk at midway'],
  },
];

const TravelRoutesScreen = () => {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(ROUTES[0]);

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f4c75', '#1b262c']} style={styles.hero}>
          <Text style={styles.heroTitle}>Pick the safest route</Text>
          <Text style={styles.heroSubtitle}>We combine live alerts, lighting data, and crowd density to rank your paths.</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaLabel}>Crowd trend</Text>
              <Text style={styles.heroMetaValue}>↓ calming</Text>
            </View>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaLabel}>Last update</Text>
              <Text style={styles.heroMetaValue}>2 min ago</Text>
            </View>
          </View>
        </LinearGradient>

        <SectionHeader title="Recommended" subtitle="Tap to inspect route details." />
        <View style={styles.routeList}>
          {ROUTES.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[styles.routeCard, selectedRoute.id === route.id && styles.routeCardActive]}
              onPress={() => setSelectedRoute(route)}
            >
              <View>
                <Text style={styles.routeLabel}>{route.label}</Text>
                <Text style={styles.routeMeta}>{route.duration} · {route.distance}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeValue}>{route.score}</Text>
                <Text style={styles.scoreBadgeLabel}>safety</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.detailCard}>
          <SectionHeader title="Route intelligence" />
          {selectedRoute.highlights.map((item) => (
            <View key={item} style={styles.highlightRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Theme.colors.primary} />
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
          <AppButton title="Start safe navigation" onPress={() => router.push('/tabs/home')} style={styles.startButton} />
        </Card>

        <SectionHeader title="Preview" subtitle="Impact zones & checkpoints" />
        <Card>
          <MapPreview
            region={{
              latitude: 28.6143,
              longitude: 77.2089,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            markers={[
              { id: 'start', coordinate: { latitude: 28.6143, longitude: 77.2089 }, label: 'You' },
              { id: 'end', coordinate: { latitude: 28.63, longitude: 77.23 }, label: 'Hotel' },
            ]}
            circles={[
              { id: 'zone', center: { latitude: 28.62, longitude: 77.215 }, radius: 600, strokeColor: Theme.colors.warning, fillColor: 'rgba(255,193,7,0.15)' },
            ]}
            height={250}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  hero: {
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  heroTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.sm,
  },
  heroSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Theme.spacing.md,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroMeta: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  heroMetaLabel: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.8)',
    fontSize: Theme.font.size.xs,
  },
  heroMetaValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  routeList: {
    marginBottom: Theme.spacing.md,
  },
  routeCard: {
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  routeCardActive: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.white,
  },
  routeLabel: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
    color: Theme.colors.text,
  },
  routeMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  scoreBadge: {
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  scoreBadgeValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.lg,
  },
  scoreBadgeLabel: {
    color: Theme.colors.white,
    fontSize: Theme.font.size.xs,
    fontFamily: Theme.font.family.sans,
  },
  detailCard: {
    marginBottom: Theme.spacing.lg,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  highlightText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  startButton: {
    marginTop: Theme.spacing.md,
  },
});

export default TravelRoutesScreen;
