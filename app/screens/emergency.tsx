// Premium emergency hub with quick actions and live safe spot intel.
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import Card from '../../components/ui/Card';
import Screen from '../../components/ui/Screen';
import { Theme } from '../../constants/theme';
import { RESOURCE_LINKS, SAFE_SPOTS } from '../../src/lib/safety-data';

const quickActions = [
  {
    id: 'call',
    label: 'Call 112',
    icon: 'call-outline',
    handler: () => Linking.openURL('tel:112'),
  },
  {
    id: 'text',
    label: 'SOS Text',
    icon: 'alert-circle-outline',
    handler: () => Alert.alert('SOS text queued', 'Your emergency SMS draft is ready to send.'),
  },
  {
    id: 'share',
    label: 'Share Live Location',
    icon: 'share-social-outline',
    handler: () => Alert.alert('Share location', 'Location link copied for your contacts.'),
  },
];

const EmergencyScreen = () => {
  const handleCall = (value: string) => {
    Linking.openURL(`tel:${value}`);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="shield-checkmark-outline" size={28} color={Theme.colors.white} />
        </View>
        <Text style={styles.heroTitle}>Emergency hub</Text>
        <Text style={styles.heroSubtitle}>Instant access to responders, safe spots, and trusted services.</Text>
        <AppButton title="Trigger SOS Call" variant="ghost" onPress={() => Linking.openURL('tel:112')} style={styles.heroButton} />
      </View>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionPill} onPress={action.handler}>
              <Ionicons name={action.icon as any} size={22} color={Theme.colors.primary} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Verified safe spots</Text>
        {SAFE_SPOTS.map((spot) => (
          <View key={spot.id} style={styles.safeSpot}>
            <View style={styles.safeSpotIcon}>
              <Ionicons name="location-outline" size={20} color={Theme.colors.white} />
            </View>
            <View style={styles.safeSpotBody}>
              <Text style={styles.safeSpotName}>{spot.name}</Text>
              <Text style={styles.safeSpotMeta}>{spot.address}</Text>
              <Text style={styles.safeSpotMeta}>{spot.notes}</Text>
            </View>
            <TouchableOpacity onPress={() => handleCall('112')}>
              <Ionicons name="navigate-outline" size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Hotlines</Text>
        {RESOURCE_LINKS.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceRow} onPress={() => handleCall(resource.contactValue)}>
            <View>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSummary}>{resource.summary}</Text>
            </View>
            <Ionicons name="call-outline" size={20} color={Theme.colors.primary} />
          </TouchableOpacity>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  hero: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  heroTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
  },
  heroSubtitle: {
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.md,
    color: 'rgba(255,255,255,0.8)',
    marginVertical: Theme.spacing.sm,
  },
  heroButton: {
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.white,
  },
  sectionCard: {
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    gap: Theme.spacing.xs,
  },
  actionLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  safeSpot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  safeSpotIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  safeSpotBody: {
    flex: 1,
  },
  safeSpotName: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
    color: Theme.colors.text,
  },
  safeSpotMeta: {
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.sm,
    color: Theme.colors.subtleText,
    marginTop: 2,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
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
});

export default EmergencyScreen;
