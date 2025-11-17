import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import AppButton from '../../components/ui/AppButton';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';

const TripsScreen = () => {
  const router = useRouter();
  const { trips } = useAppStore();

  const activeTrips = trips.filter((trip) => new Date(trip.endDate) >= new Date());
  const archivedTrips = trips.filter((trip) => new Date(trip.endDate) < new Date());

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#003049', '#1d3557']} style={styles.hero}>
          <Text style={styles.heroTitle}>Your journeys</Text>
          <Text style={styles.heroSubtitle}>Keep routes, checklists, and risk intel organised per city.</Text>
          <View style={styles.heroMetaRow}>
            <View>
              <Text style={styles.heroMetaLabel}>Active</Text>
              <Text style={styles.heroMetaValue}>{activeTrips.length}</Text>
            </View>
            <View>
              <Text style={styles.heroMetaLabel}>Archived</Text>
              <Text style={styles.heroMetaValue}>{archivedTrips.length}</Text>
            </View>
            <View>
              <Text style={styles.heroMetaLabel}>Checklist tasks</Text>
              <Text style={styles.heroMetaValue}>
                {activeTrips.reduce((acc, trip) => acc + trip.checklist.length, 0)}
              </Text>
            </View>
          </View>
          <AppButton title="Plan a trip" variant="ghost" onPress={() => router.push('/screens/PlanTrip')} style={styles.heroButton} />
        </LinearGradient>

        <SectionHeader title="Current plans" subtitle="Auto-syncs with alerts and safe spots" />
        {activeTrips.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No planned trips. Add one to unlock hyperlocal intel.</Text>
          </Card>
        ) : (
          activeTrips.map((trip) => (
            <Card key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View>
                  <Text style={styles.tripCity}>{trip.city}</Text>
                  <Text style={styles.tripDates}>
                    {trip.startDate} → {trip.endDate}
                  </Text>
                </View>
                <View style={[styles.riskBadge, riskVariants[trip.riskLevel]]}>
                  <Text style={styles.riskLabel}>{trip.riskLevel.toUpperCase()}</Text>
                </View>
              </View>
              {trip.checklist.length > 0 ? (
                <View style={styles.checklist}>
                  {trip.checklist.slice(0, 3).map((item) => (
                    <View key={item.id} style={styles.checkItem}>
                      <Ionicons
                        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={item.completed ? Theme.colors.success : Theme.colors.subtleText}
                      />
                      <Text style={styles.checkLabel}>{item.task}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.checkEmpty}>Add pre-departure tasks so nothing slips.</Text>
              )}
            </Card>
          ))
        )}

        <SectionHeader title="Past trips" subtitle="Tap to revisit notes & reports" />
        {archivedTrips.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No archived trips yet.</Text>
          </Card>
        ) : (
          archivedTrips.map((trip) => (
            <TouchableOpacity key={trip.id} onPress={() => router.push('/tabs/profile')}>
              <Card style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View>
                    <Text style={styles.tripCity}>{trip.city}</Text>
                    <Text style={styles.tripDates}>
                      {trip.startDate} → {trip.endDate}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={20} color={Theme.colors.subtleText} />
                </View>
                <Text style={styles.pastSummary}>Reports logged: {trip.checklist.length}</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
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
  },
  heroSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.85)',
    marginVertical: Theme.spacing.sm,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Theme.spacing.md,
  },
  heroMetaLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Theme.font.family.sans,
  },
  heroMetaValue: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
  },
  heroButton: {
    backgroundColor: Theme.colors.white,
  },
  emptyCard: {
    marginBottom: Theme.spacing.lg,
  },
  emptyText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  tripCard: {
    marginBottom: Theme.spacing.lg,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  tripCity: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  tripDates: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  riskBadge: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
  },
  riskLow: {
    backgroundColor: 'rgba(76,175,80,0.15)',
  },
  riskMedium: {
    backgroundColor: 'rgba(255,193,7,0.2)',
  },
  riskHigh: {
    backgroundColor: 'rgba(244,67,54,0.2)',
  },
  riskLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  checklist: {
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  checkLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  checkEmpty: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  pastSummary: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
});

const riskVariants: Record<'low' | 'medium' | 'high', number> = {
  low: styles.riskLow,
  medium: styles.riskMedium,
  high: styles.riskHigh,
};

export default TripsScreen;
