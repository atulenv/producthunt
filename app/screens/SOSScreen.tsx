// UI Revamp – new SOS screen layout and styles.
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/theme';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';

const facilityContacts = [
  {
    id: 'hospital',
    title: 'Nearest hospital',
    name: 'RML Emergency & Trauma',
    detail: '24/7 bilingual triage desk',
    distance: '1.8 km',
    phone: '011-23365555',
    icon: 'medkit-outline',
  },
  {
    id: 'police',
    title: 'Nearest police post',
    name: 'Connaught Place Station',
    detail: 'Tourist assistance unit',
    distance: '0.9 km',
    phone: '011-23412341',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'pharmacy',
    title: '24x7 pharmacy',
    name: 'Apollo Pharmacy, Janpath',
    detail: 'Emergency meds + delivery',
    distance: '1.1 km',
    phone: '011-22221111',
    icon: 'bag-handle-outline',
  },
];

const sosGuides = [
  {
    id: 'location',
    icon: 'navigate-outline',
    title: 'Share live location',
    description: 'Send a continuous GPS link to trusted contacts and command desk.',
  },
  {
    id: 'checklist',
    icon: 'document-text-outline',
    title: 'Emergency checklist',
    description: 'Keep ID, hotel keycard, and last known location handy for responders.',
  },
  {
    id: 'broadcast',
    icon: 'radio-outline',
    title: 'Broadcast update',
    description: 'Send a single update to notify police, hospital, and your watchers.',
  },
];

const dispatchTimeline = [
  { id: 'start', title: 'SOS armed', detail: 'Location + trail packet sent to command desk', time: '00:00' },
  { id: 'ops', title: 'Command handshake', detail: 'Ops desk verifies safe word + identity', time: '00:35' },
  { id: 'dispatch', title: 'Responder assigned', detail: 'Bravo-3 patrol routed through KG Marg', time: '01:10' },
  { id: 'support', title: 'Concierge follow-up', detail: 'Guide texts translation + instructions', time: '02:05' },
];

const emergencyKits = [
  {
    id: 'documents',
    icon: 'document-text-outline',
    title: 'Docs & ID vault',
    items: ['Passport copy', 'Visa letter', 'Insurance card'],
  },
  {
    id: 'contacts',
    icon: 'people-outline',
    title: 'Emergency contacts',
    items: ['Sapphire concierge', 'Delhi police desk', 'Embassy hotline'],
  },
  {
    id: 'health',
    icon: 'bandage-outline',
    title: 'Medical profile',
    items: ['Blood type O+', 'Allergies: peanuts', 'Medication list'],
  },
];

const SOSScreen = () => {
  const handleSosPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Linking.openURL('tel:112').catch(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    );
  };

  const handleFacilityPress = (phone: string) => {
    const normalized = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${normalized}`).catch(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    );
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Card style={styles.contentCard}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSosPress} activeOpacity={0.85}>
            <Ionicons name="call-outline" size={80} color={Theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Hold to call 112</Text>
          <Text style={styles.description}>
            We auto ping Delhi Police, share your live trail, and alert your trusted circle. Keep the line open
            for responder verification.
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>4 min</Text>
              <Text style={styles.statLabel}>Responder ETA</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Watchers live</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>High</Text>
              <Text style={styles.statLabel}>Signal quality</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <SectionHeader title="SOS playbook" subtitle="Follow these quick actions" icon="flash-outline" />
          <View style={styles.guideGrid}>
            {sosGuides.map((guide) => (
              <View key={guide.id} style={styles.guideCard}>
                <View style={styles.guideIcon}>
                  <Ionicons name={guide.icon as any} size={18} color={Theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDescription}>{guide.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.facilityCard}>
          <SectionHeader title="Nearby assistance" subtitle="Hospitals, police and pharmacies" icon="location-outline" />
          {facilityContacts.map((facility) => (
            <View key={facility.id} style={styles.facilityRow}>
              <View style={styles.facilityIcon}>
                <Ionicons name={facility.icon as any} size={20} color={Theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.facilityEyebrow}>{facility.title}</Text>
                <Text style={styles.facilityName}>{facility.name}</Text>
                <Text style={styles.facilityDetail}>{facility.detail}</Text>
                <Text style={styles.facilityDistance}>{facility.distance} away</Text>
              </View>
              <TouchableOpacity style={styles.facilityAction} onPress={() => handleFacilityPress(facility.phone)}>
                <Ionicons name="call" size={18} color={Theme.colors.white} />
                <Text style={styles.facilityActionText}>Call</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        <Card style={styles.tipCard}>
          <SectionHeader title="Resource center" subtitle="Extra support when SOS is live" icon="help-buoy-outline" />
          <View style={styles.tipRow}>
            <Ionicons name="chatbubbles-outline" size={20} color={Theme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Concierge chat</Text>
              <Text style={styles.tipDescription}>Need translation or check a route? Ping the Help tab and we will patch a guide.</Text>
            </View>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="cloud-upload-outline" size={20} color={Theme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Share evidence</Text>
              <Text style={styles.tipDescription}>Upload pictures, plate numbers, or audio snippets for the command file.</Text>
            </View>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="shield-outline" size={20} color={Theme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Safe meeting spot</Text>
              <Text style={styles.tipDescription}>Head to the highlighted café or metro gate while the responder reaches you.</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.timelineCard}>
          <SectionHeader title="Live dispatch feed" subtitle="What happens after you press SOS" icon="time-outline" />
          {dispatchTimeline.map((entry, index) => (
            <View key={entry.id} style={styles.timelineRow}>
              <View style={styles.timelineMarkers}>
                <View style={styles.timelineDot} />
                {index !== dispatchTimeline.length - 1 ? <View style={styles.timelineLine} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{entry.title}</Text>
                  <Text style={styles.timelineTime}>{entry.time}</Text>
                </View>
                <Text style={styles.timelineDetail}>{entry.detail}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.kitCard}>
          <SectionHeader title="Quick references" subtitle="Keep this intel handy" icon="briefcase-outline" />
          <View style={styles.kitGrid}>
            {emergencyKits.map((kit) => (
              <View key={kit.id} style={styles.kitCardItem}>
                <View style={styles.kitIcon}>
                  <Ionicons name={kit.icon as any} size={18} color={Theme.colors.primary} />
                </View>
                <Text style={styles.kitTitle}>{kit.title}</Text>
                {kit.items.map((item) => (
                  <Text key={item} style={styles.kitItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl * 2,
  },
  contentCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  sosButton: {
    backgroundColor: Theme.colors.danger,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.lg,
  },
  title: {
    fontSize: Theme.font.size['2xl'],
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    textAlign: 'center',
    lineHeight: Theme.font.size.lg * 1.4,
  },
  statRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.lightGray,
  },
  statValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.lg,
  },
  statLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  infoCard: {
    gap: Theme.spacing.md,
  },
  guideGrid: {
    gap: Theme.spacing.sm,
  },
  guideCard: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  guideIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(85,99,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  guideDescription: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    marginTop: 2,
  },
  facilityCard: {
    gap: Theme.spacing.md,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityEyebrow: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
    textTransform: 'uppercase',
  },
  facilityName: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.lg,
  },
  facilityDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  facilityDistance: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
    marginTop: 4,
  },
  facilityAction: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  facilityActionText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  tipCard: {
    gap: Theme.spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  tipTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  tipDescription: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  timelineCard: {
    gap: Theme.spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  timelineMarkers: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(15,23,42,0.1)',
    marginTop: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
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
    fontSize: Theme.font.size.sm,
    marginTop: 2,
  },
  kitCard: {
    gap: Theme.spacing.md,
  },
  kitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  kitCardItem: {
    flex: 1,
    minWidth: 150,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.background,
  },
  kitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(85,99,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  kitItem: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
});

export default SOSScreen;
