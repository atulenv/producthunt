// UI Revamp – immersive traveler profile with itinerary + suggestions.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import AppButton from '../../components/ui/AppButton';
import { PREPAREDNESS } from '../../src/lib/safety-data';
import { useTranslate } from '../../src/hooks/use-translate';
import { Collapsible } from '../../components/ui/collapsible';
import ProgressBar from '../../components/ui/ProgressBar';

type DetailFieldConfig = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  props?: Partial<React.ComponentProps<typeof TextInput>>;
  fullWidth?: boolean;
};

const UserProfileScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { userProfile, trustedContacts, incidentReports, savedPlaces, trips, language, updateUserProfile } = useAppStore();
  const [personaModules, setPersonaModules] = useState([
    {
      id: 'bio',
      label: 'Add a travel bio',
      detail: '30-sec story helps the concierge introduce you to responders.',
      completed: true,
    },
    {
      id: 'safe-word',
      label: 'Set safe word',
      detail: 'Used when you call SOS to verify identity.',
      completed: false,
    },
    {
      id: 'docs',
      label: 'Upload visa copies',
      detail: 'Keeps embassy desk ready with your files.',
      completed: false,
    },
    {
      id: 'alerts',
      label: 'Curate alert focus',
      detail: 'Choose topics that ping you first.',
      completed: false,
    },
  ]);

  const stats = [
    { label: 'Trips planned', value: trips.length },
    { label: 'Trusted circle', value: trustedContacts.length },
    { label: 'Saved places', value: savedPlaces.length },
  ];

  const upcomingTrip = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];

  const checklistPreview = upcomingTrip?.checklist.slice(0, 4) ?? [];
  const moduleProgress = useMemo(() => {
    const complete = personaModules.filter((module) => module.completed).length;
    return personaModules.length === 0 ? 0 : complete / personaModules.length;
  }, [personaModules]);
  const toggleModule = (id: string) => {
    setPersonaModules((prev) =>
      prev.map((module) => (module.id === id ? { ...module, completed: !module.completed } : module))
    );
  };
  const timelineEntries = useMemo(
    () =>
      [...trips]
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 3),
    [trips]
  );

  const renderDetailField = ({ label, value, onChange, props, fullWidth }: DetailFieldConfig, forceFullWidth = false) => {
    const stretch = forceFullWidth || fullWidth || props?.multiline;
    return (
      <View style={[styles.detailField, stretch && styles.detailFieldFull]} key={label}>
        <Text style={styles.detailLabel}>{label}</Text>
        <TextInput
          style={[styles.detailInput, props?.multiline && styles.detailInputMultiline]}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={Theme.colors.subtleText}
          value={value}
          onChangeText={onChange}
          {...props}
        />
      </View>
    );
  };

  const personalRows: DetailFieldConfig[][] = [
    [
      { label: 'Home base', value: userProfile.homeBase, onChange: (text) => updateUserProfile({ homeBase: text }) },
      { label: 'Date of birth', value: userProfile.dateOfBirth, onChange: (text) => updateUserProfile({ dateOfBirth: text }) },
    ],
    [
      { label: 'Gender', value: userProfile.gender, onChange: (text) => updateUserProfile({ gender: text }) },
      { label: 'Pronouns', value: userProfile.pronouns, onChange: (text) => updateUserProfile({ pronouns: text }) },
    ],
    [
      { label: 'Nationality', value: userProfile.nationality, onChange: (text) => updateUserProfile({ nationality: text }) },
      { label: 'Passport number', value: userProfile.passportNumber, onChange: (text) => updateUserProfile({ passportNumber: text }) },
    ],
    [
      {
        label: 'National ID',
        value: userProfile.nationalId,
        onChange: (text) => updateUserProfile({ nationalId: text }),
      },
      {
        label: 'Document expiry',
        value: userProfile.travelDocumentExpiry,
        onChange: (text) => updateUserProfile({ travelDocumentExpiry: text }),
      },
    ],
    [
      { label: 'Email', value: userProfile.email, onChange: (text) => updateUserProfile({ email: text }) },
      { label: 'Phone', value: userProfile.phone, onChange: (text) => updateUserProfile({ phone: text }) },
    ],
    [
      { label: 'Alternate phone', value: userProfile.alternatePhone, onChange: (text) => updateUserProfile({ alternatePhone: text }) },
    ],
    [
      {
        label: 'Languages spoken',
        value: userProfile.languagesSpoken,
        onChange: (text) => updateUserProfile({ languagesSpoken: text }),
        props: { multiline: true },
      },
    ],
  ];

  const emergencyRows: DetailFieldConfig[][] = [
    [
      {
        label: 'Primary contact name',
        value: userProfile.emergencyContact.name,
        onChange: (text) => updateUserProfile({ emergencyContact: { name: text } }),
      },
      {
        label: 'Relationship',
        value: userProfile.emergencyContact.relation,
        onChange: (text) => updateUserProfile({ emergencyContact: { relation: text } }),
      },
    ],
    [
      {
        label: 'Contact phone',
        value: userProfile.emergencyContact.phone,
        onChange: (text) => updateUserProfile({ emergencyContact: { phone: text } }),
      },
      {
        label: 'Contact email',
        value: userProfile.emergencyContact.email,
        onChange: (text) => updateUserProfile({ emergencyContact: { email: text } }),
      },
    ],
    [
      {
        label: 'Contact address',
        value: userProfile.emergencyContact.address,
        onChange: (text) => updateUserProfile({ emergencyContact: { address: text } }),
        props: { multiline: true },
      },
    ],
  ];

  const medicalRows: DetailFieldConfig[][] = [
    [
      {
        label: 'Blood type',
        value: userProfile.medicalInfo.bloodType,
        onChange: (text) => updateUserProfile({ medicalInfo: { bloodType: text } }),
      },
      {
        label: 'Insurance provider',
        value: userProfile.medicalInfo.insuranceProvider,
        onChange: (text) => updateUserProfile({ medicalInfo: { insuranceProvider: text } }),
      },
    ],
    [
      {
        label: 'Policy number',
        value: userProfile.medicalInfo.insurancePolicy,
        onChange: (text) => updateUserProfile({ medicalInfo: { insurancePolicy: text } }),
      },
      {
        label: 'Physician contact',
        value: userProfile.medicalInfo.physicianContact,
        onChange: (text) => updateUserProfile({ medicalInfo: { physicianContact: text } }),
      },
    ],
    [
      {
        label: 'Allergies',
        value: userProfile.medicalInfo.allergies,
        onChange: (text) => updateUserProfile({ medicalInfo: { allergies: text } }),
        props: { multiline: true },
      },
      {
        label: 'Medications',
        value: userProfile.medicalInfo.medications,
        onChange: (text) => updateUserProfile({ medicalInfo: { medications: text } }),
        props: { multiline: true },
      },
    ],
    [
      {
        label: 'Medical notes',
        value: userProfile.medicalInfo.medicalNotes,
        onChange: (text) => updateUserProfile({ medicalInfo: { medicalNotes: text } }),
        props: { multiline: true },
      },
    ],
  ];

  const travelRows: DetailFieldConfig[][] = [
    [
      {
        label: 'Travel style',
        value: userProfile.travelPreferences.travelStyle,
        onChange: (text) => updateUserProfile({ travelPreferences: { travelStyle: text } }),
        props: { multiline: true },
      },
    ],
    [
      {
        label: 'Accommodation',
        value: userProfile.travelPreferences.accommodation,
        onChange: (text) => updateUserProfile({ travelPreferences: { accommodation: text } }),
      },
      {
        label: 'Preferred transport',
        value: userProfile.travelPreferences.transport,
        onChange: (text) => updateUserProfile({ travelPreferences: { transport: text } }),
      },
    ],
    [
      {
        label: 'Dietary notes',
        value: userProfile.travelPreferences.dietary,
        onChange: (text) => updateUserProfile({ travelPreferences: { dietary: text } }),
      },
      {
        label: 'Mobility needs',
        value: userProfile.travelPreferences.mobilityNeeds,
        onChange: (text) => updateUserProfile({ travelPreferences: { mobilityNeeds: text } }),
      },
    ],
    [
      {
        label: 'Preferred communication',
        value: userProfile.travelPreferences.communication,
        onChange: (text) => updateUserProfile({ travelPreferences: { communication: text } }),
        props: { multiline: true },
      },
      {
        label: 'Verification notes',
        value: userProfile.verificationNotes,
        onChange: (text) => updateUserProfile({ verificationNotes: text }),
        props: { multiline: true },
      },
    ],
  ];

  const securityRows: DetailFieldConfig[][] = [
    [
      { label: 'Safe word', value: userProfile.safeWord, onChange: (text) => updateUserProfile({ safeWord: text }) },
      { label: 'Arrival flight', value: userProfile.arrivalFlight, onChange: (text) => updateUserProfile({ arrivalFlight: text }) },
    ],
    [
      { label: 'Departure flight', value: userProfile.departureFlight, onChange: (text) => updateUserProfile({ departureFlight: text }) },
      {
        label: 'Employer / work contact',
        value: userProfile.employerContact,
        onChange: (text) => updateUserProfile({ employerContact: text }),
        props: { multiline: true },
      },
    ],
    [
      {
        label: 'Embassy desk',
        value: userProfile.embassyContact,
        onChange: (text) => updateUserProfile({ embassyContact: text }),
        props: { multiline: true },
      },
    ],
    [
      {
        label: 'Local stay address',
        value: userProfile.localStayAddress,
        onChange: (text) => updateUserProfile({ localStayAddress: text }),
        props: { multiline: true },
      },
      {
        label: 'Host / concierge contact',
        value: userProfile.localHostName,
        onChange: (text) => updateUserProfile({ localHostName: text }),
        props: { multiline: true },
      },
    ],
    [
      {
        label: 'Social handles',
        value: userProfile.socialHandle,
        onChange: (text) => updateUserProfile({ socialHandle: text }),
        props: { multiline: true },
      },
    ],
  ];

  return (
    <Screen style={styles.screen} footerInset={TAB_BAR_OVERLAY_HEIGHT / 2}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.identityCard}>
          <LinearGradient colors={['#312e81', '#5b21b6', '#db2777']} style={styles.identityGradient}>
            <View style={styles.identityHeroRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.identityEyebrow}>{t('profile.identity')}</Text>
                <Text style={styles.identityName}>{userProfile.name}</Text>
                <Text style={styles.identityTagline}>{userProfile.tagline}</Text>
              </View>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarInitial}>{userProfile.name.charAt(0)}</Text>
              </View>
            </View>
            <View style={styles.heroStatsRow}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.heroStatBlock}>
                  <Text style={styles.heroStatValue}>{stat.value}</Text>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.heroEditButton} onPress={() => router.push('/screens/Settings')}>
              <Ionicons name="settings-outline" size={16} color={Theme.colors.white} />
              <Text style={styles.heroEditText}>Customize</Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.identityBody}>
            <View style={styles.identityBodyRow}>
              <Text style={styles.profileMeta}>Language: {language.toUpperCase()}</Text>
              <Text style={styles.profileMeta}>Membership: Sapphire Concierge</Text>
              <Text style={styles.profileMeta}>Reports logged: {incidentReports.length}</Text>
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
          </View>
        </Card>

        <Card style={styles.builderCard}>
          <SectionHeader title="Profile builder" subtitle="Complete your security dossier" icon="finger-print-outline" />
          <View style={styles.builderProgressRow}>
            <ProgressBar progress={moduleProgress} />
            <Text style={styles.builderProgressValue}>{Math.round(moduleProgress * 100)}%</Text>
          </View>
          {personaModules.map((module) => (
            <TouchableOpacity key={module.id} style={styles.moduleRow} onPress={() => toggleModule(module.id)}>
              <Ionicons
                name={module.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={module.completed ? Theme.colors.success : Theme.colors.subtleText}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleLabel}>{module.label}</Text>
                <Text style={styles.moduleDetail}>{module.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Theme.colors.subtleText} />
            </TouchableOpacity>
          ))}
          <Text style={styles.moduleHint}>Tap an item whenever you finish that piece of the profile builder.</Text>
        </Card>

        <Card style={styles.detailCard}>
          <SectionHeader title="Traveler dossier" subtitle="Tap to expand sections" />
          <Collapsible title={t('profile.personalDetails')}>
            <View style={styles.dossierSection}>
              {personalRows.map((row, rowIndex) => (
                <View key={`personal-${rowIndex}`} style={styles.detailGrid}>
                {row.map((field) => renderDetailField(field, row.length === 1))}
              </View>
            ))}
          </View>
        </Collapsible>

          <Collapsible title={t('profile.emergencyDetails')}>
            <View style={styles.dossierSection}>
              {emergencyRows.map((row, rowIndex) => (
                <View key={`emergency-${rowIndex}`} style={styles.detailGrid}>
                {row.map((field) => renderDetailField(field, row.length === 1))}
              </View>
            ))}
            <View style={styles.dossierDivider} />
            {medicalRows.map((row, rowIndex) => (
              <View key={`medical-${rowIndex}`} style={styles.detailGrid}>
                {row.map((field) => renderDetailField(field, row.length === 1))}
              </View>
            ))}
            </View>
          </Collapsible>

          <Collapsible title="Security & logistics">
            <View style={styles.dossierSection}>
              {securityRows.map((row, rowIndex) => (
                <View key={`security-${rowIndex}`} style={styles.detailGrid}>
                  {row.map((field) => renderDetailField(field, row.length === 1))}
                </View>
              ))}
            </View>
          </Collapsible>

          <Collapsible title={t('profile.travelPreferences')}>
            <View style={styles.dossierSection}>
              {travelRows.map((row, rowIndex) => (
                <View key={`travel-${rowIndex}`} style={styles.detailGrid}>
                {row.map((field) => renderDetailField(field, row.length === 1))}
              </View>
            ))}
            </View>
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
                onPress={() => router.push('/screens/Trips')}
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

        <Card style={styles.historyCard}>
          <SectionHeader title="Travel timeline" subtitle="Recent missions with risk context" icon="time-outline" />
          {timelineEntries.length === 0 ? (
            <Text style={styles.historyEmpty}>Add a trip and we will visualise your journey here.</Text>
          ) : (
            timelineEntries.map((entry, index) => (
              <View key={entry.id} style={styles.historyRow}>
                <View style={styles.historyMarkerColumn}>
                  <View style={styles.historyMarker} />
                  {index !== timelineEntries.length - 1 ? <View style={styles.historyLine} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyCity}>{entry.city}</Text>
                  <Text style={styles.historyDates}>
                    {entry.startDate} → {entry.endDate}
                  </Text>
                </View>
                <View style={[styles.historyBadge, styles[`risk${entry.riskLevel}` as const]]}>
                  <Text style={styles.historyBadgeText}>{entry.riskLevel.toUpperCase()}</Text>
                </View>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.historyLink} onPress={() => router.push('/screens/Trips')}>
            <Text style={styles.historyLinkText}>Open Trips hub</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/screens/Settings')}>
              <Ionicons name="settings-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.quickText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/screens/Trips')}>
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
    padding: 0,
    overflow: 'hidden',
  },
  identityGradient: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.lg,
  },
  identityHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  identityEyebrow: {
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: Theme.font.size.xs,
    fontFamily: Theme.font.family.sansBold,
  },
  identityName: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size['2xl'],
  },
  identityTagline: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Theme.font.family.sans,
    marginTop: 4,
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroAvatarInitial: {
    fontSize: Theme.font.size.xl,
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    flexWrap: 'wrap',
  },
  heroStatBlock: {
    flex: 1,
    minWidth: 120,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroStatValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.lg,
  },
  heroStatLabel: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.75)',
    fontSize: Theme.font.size.xs,
  },
  heroEditButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroEditText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  identityBody: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  identityBodyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    justifyContent: 'space-between',
  },
  builderCard: {
    gap: Theme.spacing.md,
  },
  builderProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  builderProgressValue: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  moduleLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  moduleDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  moduleHint: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
  },
  detailCard: {
    gap: Theme.spacing.md,
  },
  dossierSection: {
    gap: Theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    padding: Theme.spacing.md,
  },
  dossierDivider: {
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.08)',
  },
  detailGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailField: {
    flexGrow: 1,
    gap: Theme.spacing.xs,
    backgroundColor: 'rgba(238,242,255,0.6)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    minWidth: '48%',
  },
  detailFieldFull: {
    minWidth: '100%',
    flexBasis: '100%',
  },
  detailLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
    textTransform: 'uppercase',
  },
  detailInput: {
    borderRadius: Theme.radius.md,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    minHeight: 40,
  },
  detailInputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  profileMeta: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
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
  itineraryCard: {
    gap: Theme.spacing.md,
  },
  historyCard: {
    gap: Theme.spacing.md,
  },
  historyEmpty: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  historyMarkerColumn: {
    alignItems: 'center',
  },
  historyMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  historyLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(15,23,42,0.12)',
    marginTop: 2,
  },
  historyCity: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  historyDates: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  historyBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
  },
  historyBadgeText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Theme.spacing.xs,
  },
  historyLinkText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
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
