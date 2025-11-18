// UI Revamp – immersive traveler profile with itinerary + suggestions.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import AppButton from '../../components/ui/AppButton';
import { PREPAREDNESS } from '../../src/lib/safety-data';
import { useTranslate } from '../../src/hooks/use-translate';
import { Collapsible } from '../../components/ui/collapsible';

const UserProfileScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { userProfile, trustedContacts, incidentReports, savedPlaces, trips, language, updateUserProfile } = useAppStore();

  const stats = [
    { label: 'Trips planned', value: trips.length },
    { label: 'Trusted circle', value: trustedContacts.length },
    { label: 'Saved places', value: savedPlaces.length },
  ];

  const upcomingTrip = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];

  const checklistPreview = upcomingTrip?.checklist.slice(0, 4) ?? [];

  const renderDetailField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    props?: Partial<React.ComponentProps<typeof TextInput>>
  ) => (
    <View style={styles.detailField} key={label}>
      <Text style={styles.detailLabel}>{label}</Text>
      <TextInput
        style={[styles.detailInput, props?.multiline && styles.detailInputMultiline]}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor={Theme.colors.subtleText}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.identityCard}>
          <SectionHeader title={t('profile.identity')} subtitle={userProfile.tagline} />
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{userProfile.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileMeta}>Language: {language.toUpperCase()}</Text>
              <Text style={styles.profileMeta}>Membership: Sapphire Concierge</Text>
              <Text style={styles.profileMeta}>Reports logged: {incidentReports.length}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/tabs/settings')}>
              <Ionicons name="create-outline" size={18} color={Theme.colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={18} color={Theme.colors.primary} />
              <Text style={styles.badgeText}>Verified ID</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="leaf-outline" size={18} color={Theme.colors.secondary} />
              <Text style={styles.badgeText}>{t('profile.badges')}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statBlock}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.detailCard}>
          <SectionHeader title="Traveler dossier" subtitle="Tap to expand sections" />
          <Collapsible title={t('profile.personalDetails')}>
            <View style={styles.detailGrid}>
              {renderDetailField('Home base', userProfile.homeBase, (text) => updateUserProfile({ homeBase: text }))}
              {renderDetailField('Date of birth', userProfile.dateOfBirth, (text) => updateUserProfile({ dateOfBirth: text }))}
            </View>
            <View style={styles.detailGrid}>
              {renderDetailField('Gender', userProfile.gender, (text) => updateUserProfile({ gender: text }))}
              {renderDetailField('Pronouns', userProfile.pronouns, (text) => updateUserProfile({ pronouns: text }))}
            </View>
            <View style={styles.detailGrid}>
              {renderDetailField('Nationality', userProfile.nationality, (text) => updateUserProfile({ nationality: text }))}
              {renderDetailField('Passport number', userProfile.passportNumber, (text) => updateUserProfile({ passportNumber: text }))}
            </View>
            {renderDetailField('Document expiry', userProfile.travelDocumentExpiry, (text) => updateUserProfile({ travelDocumentExpiry: text }))}
            <View style={styles.detailGrid}>
              {renderDetailField('Email', userProfile.email, (text) => updateUserProfile({ email: text }))}
              {renderDetailField('Phone', userProfile.phone, (text) => updateUserProfile({ phone: text }))}
            </View>
            {renderDetailField('Languages spoken', userProfile.languagesSpoken, (text) => updateUserProfile({ languagesSpoken: text }))}
          </Collapsible>

          <Collapsible title={t('profile.emergencyDetails')}>
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Primary contact name',
                userProfile.emergencyContact.name,
                (text) => updateUserProfile({ emergencyContact: { name: text } })
              )}
              {renderDetailField(
                'Relationship',
                userProfile.emergencyContact.relation,
                (text) => updateUserProfile({ emergencyContact: { relation: text } })
              )}
            </View>
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Contact phone',
                userProfile.emergencyContact.phone,
                (text) => updateUserProfile({ emergencyContact: { phone: text } })
              )}
              {renderDetailField(
                'Contact email',
                userProfile.emergencyContact.email,
                (text) => updateUserProfile({ emergencyContact: { email: text } })
              )}
            </View>
            {renderDetailField(
              'Contact address',
              userProfile.emergencyContact.address,
              (text) => updateUserProfile({ emergencyContact: { address: text } }),
              { multiline: true }
            )}
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Blood type',
                userProfile.medicalInfo.bloodType,
                (text) => updateUserProfile({ medicalInfo: { bloodType: text } })
              )}
              {renderDetailField(
                'Insurance provider',
                userProfile.medicalInfo.insuranceProvider,
                (text) => updateUserProfile({ medicalInfo: { insuranceProvider: text } })
              )}
            </View>
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Policy number',
                userProfile.medicalInfo.insurancePolicy,
                (text) => updateUserProfile({ medicalInfo: { insurancePolicy: text } })
              )}
              {renderDetailField(
                'Physician contact',
                userProfile.medicalInfo.physicianContact,
                (text) => updateUserProfile({ medicalInfo: { physicianContact: text } })
              )}
            </View>
            {renderDetailField(
              'Allergies',
              userProfile.medicalInfo.allergies,
              (text) => updateUserProfile({ medicalInfo: { allergies: text } }),
              { multiline: true }
            )}
            {renderDetailField(
              'Medications',
              userProfile.medicalInfo.medications,
              (text) => updateUserProfile({ medicalInfo: { medications: text } }),
              { multiline: true }
            )}
            {renderDetailField(
              'Medical notes',
              userProfile.medicalInfo.medicalNotes,
              (text) => updateUserProfile({ medicalInfo: { medicalNotes: text } }),
              { multiline: true }
            )}
          </Collapsible>

          <Collapsible title={t('profile.travelPreferences')}>
            {renderDetailField(
              'Travel style',
              userProfile.travelPreferences.travelStyle,
              (text) => updateUserProfile({ travelPreferences: { travelStyle: text } }),
              { multiline: true }
            )}
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Accommodation',
                userProfile.travelPreferences.accommodation,
                (text) => updateUserProfile({ travelPreferences: { accommodation: text } })
              )}
              {renderDetailField(
                'Preferred transport',
                userProfile.travelPreferences.transport,
                (text) => updateUserProfile({ travelPreferences: { transport: text } })
              )}
            </View>
            <View style={styles.detailGrid}>
              {renderDetailField(
                'Dietary notes',
                userProfile.travelPreferences.dietary,
                (text) => updateUserProfile({ travelPreferences: { dietary: text } })
              )}
              {renderDetailField(
                'Mobility needs',
                userProfile.travelPreferences.mobilityNeeds,
                (text) => updateUserProfile({ travelPreferences: { mobilityNeeds: text } })
              )}
            </View>
            {renderDetailField(
              'Preferred communication',
              userProfile.travelPreferences.communication,
              (text) => updateUserProfile({ travelPreferences: { communication: text } }),
              { multiline: true }
            )}
            {renderDetailField(
              'Verification notes',
              userProfile.verificationNotes,
              (text) => updateUserProfile({ verificationNotes: text }),
              { multiline: true }
            )}
          </Collapsible>
        </Card>

        <Card style={styles.itineraryCard}>
          <SectionHeader title={t('profile.itinerary')} subtitle="Syncs with your Trips tab" />
          {upcomingTrip ? (
            <>
              <View style={styles.itineraryHeader}>
                <View>
                  <Text style={styles.itineraryCity}>{upcomingTrip.city}</Text>
                  <Text style={styles.itineraryDates}>
                    {upcomingTrip.startDate} → {upcomingTrip.endDate}
                  </Text>
                </View>
                <View style={[styles.riskPill, styles[`risk${upcomingTrip.riskLevel}` as const]]}>
                  <Text style={styles.riskPillText}>{upcomingTrip.riskLevel.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.itineraryTimeline}>
                {checklistPreview.length === 0 ? (
                  <Text style={styles.itineraryEmpty}>Add checklist tasks to prep smarter.</Text>
                ) : (
                  checklistPreview.map((item, index) => (
                    <View key={item.id} style={styles.timelineItem}>
                      <View style={styles.timelineIndicator}>
                        <View style={[styles.timelineDot, item.completed && styles.timelineDotDone]} />
                        {index !== checklistPreview.length - 1 ? (
                          <View style={styles.timelineLine} />
                        ) : null}
                      </View>
                      <View style={styles.timelineCopy}>
                        <Text style={styles.timelineTask}>{item.task}</Text>
                        <Text style={styles.timelineStatus}>
                          {item.completed ? 'Checked' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
              <AppButton
                title="View full itinerary"
                variant="ghost"
                onPress={() => router.push('/tabs/trips')}
                textStyle={{ color: Theme.colors.primary }}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.itineraryEmpty}>No upcoming trips synced yet.</Text>
              <AppButton title="Plan a trip" onPress={() => router.push('/screens/PlanTrip')} />
            </View>
          )}
        </Card>

        <Card style={styles.documentsCard}>
          <SectionHeader title={t('profile.documents')} subtitle="Encrypted vault stored offline" />
          {PREPAREDNESS.slice(0, 2).map((section) => (
            <View key={section.id} style={styles.docRow}>
              <View style={styles.docIcon}>
                <Ionicons name="document-text-outline" size={18} color={Theme.colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.docTitle}>{section.title}</Text>
                {section.items.map((item) => (
                  <Text key={item} style={styles.docItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          ))}
          <AppButton
            title="Upload new document"
            variant="ghost"
            icon={<Ionicons name="cloud-upload-outline" size={16} color={Theme.colors.primary} />}
            onPress={() => Alert.alert('Coming soon', 'Doc upload integrations arriving shortly.')}
            textStyle={{ color: Theme.colors.primary }}
          />
        </Card>

        <Card style={styles.identityCard}>
          <SectionHeader title="Quick links" subtitle="Jump to other sections" />
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/tabs/settings')}>
              <Ionicons name="settings-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.quickText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/tabs/trips')}>
              <Ionicons name="map-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.quickText}>Trips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/screens/Reports')}>
              <Ionicons name="warning-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.quickText}>Reports</Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  identityCard: {
    gap: Theme.spacing.md,
  },
  detailCard: {
    gap: Theme.spacing.md,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  detailField: {
    flex: 1,
    gap: Theme.spacing.xs,
  },
  detailLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
    textTransform: 'uppercase',
  },
  detailInput: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    minHeight: 46,
  },
  detailInputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  profileRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
  },
  profileName: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  profileMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  editButtonText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: 'rgba(0,191,165,0.08)',
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  statLabel: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  itineraryCard: {
    gap: Theme.spacing.md,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itineraryCity: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  itineraryDates: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  riskPill: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  risklow: {
    backgroundColor: 'rgba(0,191,165,0.15)',
  },
  riskmedium: {
    backgroundColor: 'rgba(255,193,7,0.15)',
  },
  riskhigh: {
    backgroundColor: 'rgba(244,67,54,0.15)',
  },
  riskPillText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  itineraryTimeline: {
    gap: Theme.spacing.md,
  },
  itineraryEmpty: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.colors.subtleText,
  },
  timelineDotDone: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(15,23,42,0.12)',
    marginTop: 2,
  },
  timelineCopy: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    paddingBottom: Theme.spacing.sm,
  },
  timelineTask: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  timelineStatus: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  emptyState: {
    alignItems: 'flex-start',
    gap: Theme.spacing.sm,
  },
  documentsCard: {
    gap: Theme.spacing.md,
  },
  docRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(63,81,181,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  docItem: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickLink: {
    flex: 1,
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  quickText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
});

export default UserProfileScreen;
