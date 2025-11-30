// Enhanced User Profile with mandatory emergency information
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import { Collapsible } from '../../components/ui/collapsible';
import ProgressBar from '../../components/ui/ProgressBar';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RELATIONSHIPS = ['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other'];

const UserProfileScreen = () => {
  const router = useRouter();
  const {
    userProfile,
    updateUserProfile,
    addFamilyContact,
    removeFamilyContact,
    updateFamilyContact,
    sosSettings,
    updateSOSSettings,
  } = useAppStore();

  const [activeSection, setActiveSection] = useState<string | null>('essential');

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    const mandatoryFields = [
      userProfile.name,
      userProfile.phone,
      userProfile.nationality,
      userProfile.passportNumber,
      userProfile.familyContacts[0]?.name,
      userProfile.familyContacts[0]?.phone,
      userProfile.currentHotel,
      userProfile.medicalInfo.bloodType,
    ];
    const filled = mandatoryFields.filter((f) => f && f.trim() !== '').length;
    return filled / mandatoryFields.length;
  }, [userProfile]);

  const getMissingFields = () => {
    const missing = [];
    if (!userProfile.name) missing.push('Your Name');
    if (!userProfile.phone) missing.push('Phone Number');
    if (!userProfile.nationality) missing.push('Nationality');
    if (!userProfile.passportNumber) missing.push('Passport Number');
    if (!userProfile.familyContacts[0]?.name) missing.push('Emergency Contact Name');
    if (!userProfile.familyContacts[0]?.phone) missing.push('Emergency Contact Phone');
    if (!userProfile.currentHotel) missing.push('Current Hotel/Stay');
    if (!userProfile.medicalInfo.bloodType) missing.push('Blood Type');
    return missing;
  };

  const renderTextField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    options?: {
      placeholder?: string;
      required?: boolean;
      multiline?: boolean;
      keyboardType?: 'default' | 'phone-pad' | 'email-address';
    }
  ) => (
    <View style={[styles.fieldContainer, options?.multiline && styles.fieldContainerFull]}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {options?.required && <Text style={styles.requiredBadge}>Required</Text>}
      </View>
      <TextInput
        style={[styles.fieldInput, options?.multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChange}
        placeholder={options?.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor={Theme.colors.mutedText}
        multiline={options?.multiline}
        keyboardType={options?.keyboardType}
      />
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    options: string[],
    onChange: (text: string) => void,
    required?: boolean
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.requiredBadge}>Required</Text>}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionChip, value === opt && styles.optionChipActive]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const missingFields = getMissingFields();

  return (
    <Screen style={styles.screen} footerInset={TAB_BAR_OVERLAY_HEIGHT / 2}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <LinearGradient colors={['#1E40AF', '#3B82F6', '#60A5FA']} style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                  {userProfile.name ? (
                    <Text style={styles.avatarText}>
                      {userProfile.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </Text>
                  ) : (
                    <Ionicons name="person" size={40} color={Theme.colors.white} />
                  )}
                </View>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={16} color={Theme.colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{userProfile.name || 'Set Your Name'}</Text>
                <Text style={styles.headerTagline}>{userProfile.tagline}</Text>
              </View>
            </View>

            {/* Completion Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Profile Completion</Text>
                <Text style={styles.progressValue}>{Math.round(profileCompletion * 100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${profileCompletion * 100}%` }]} />
              </View>
              {missingFields.length > 0 && (
                <Text style={styles.progressHint}>
                  Missing: {missingFields.slice(0, 2).join(', ')}
                  {missingFields.length > 2 && ` +${missingFields.length - 2} more`}
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Alert for incomplete profile */}
        {profileCompletion < 1 && (
          <Card style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertIcon}>
                <Ionicons name="warning" size={24} color={Theme.colors.warning} />
              </View>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>Complete Your Safety Profile</Text>
                <Text style={styles.alertDescription}>
                  In case of emergency, this information helps authorities and your family reach you quickly.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Essential Information - MANDATORY */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Essential Information" defaultOpen>
            <View style={styles.sectionContent}>
              <View style={styles.mandatoryBadge}>
                <Ionicons name="alert-circle" size={14} color={Theme.colors.emergency} />
                <Text style={styles.mandatoryText}>All fields are critical for your safety</Text>
              </View>

              <View style={styles.fieldsGrid}>
                {renderTextField('Full Name', userProfile.name, (t) => updateUserProfile({ name: t }), {
                  required: true,
                  placeholder: 'As per passport',
                })}
                {renderTextField('Phone Number', userProfile.phone, (t) => updateUserProfile({ phone: t }), {
                  required: true,
                  keyboardType: 'phone-pad',
                  placeholder: '+1 xxx-xxx-xxxx',
                })}
                {renderTextField('WhatsApp', userProfile.whatsapp, (t) => updateUserProfile({ whatsapp: t }), {
                  keyboardType: 'phone-pad',
                  placeholder: 'If different from phone',
                })}
                {renderTextField('Email', userProfile.email, (t) => updateUserProfile({ email: t }), {
                  keyboardType: 'email-address',
                })}
                {renderTextField('Nationality', userProfile.nationality, (t) => updateUserProfile({ nationality: t }), {
                  required: true,
                })}
                {renderTextField('Date of Birth', userProfile.dateOfBirth, (t) => updateUserProfile({ dateOfBirth: t }), {
                  placeholder: 'DD/MM/YYYY',
                })}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* Family/Emergency Contacts - CRITICAL */}
        <Card style={[styles.sectionCard, styles.criticalSection]}>
          <Collapsible title="Family & Emergency Contacts" defaultOpen>
            <View style={styles.sectionContent}>
              <View style={styles.criticalBadge}>
                <Ionicons name="heart" size={14} color={Theme.colors.white} />
                <Text style={styles.criticalText}>CRITICAL: These contacts will be notified during SOS</Text>
              </View>

              {userProfile.familyContacts.map((contact, index) => (
                <View key={index} style={styles.contactCard}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactTitle}>Contact {index + 1}</Text>
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Remove Contact', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Remove', style: 'destructive', onPress: () => removeFamilyContact(index) },
                          ]);
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color={Theme.colors.emergency} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.fieldsGrid}>
                    {renderTextField(
                      'Full Name',
                      contact.name,
                      (t) => updateFamilyContact(index, { name: t }),
                      { required: index === 0 }
                    )}
                    {renderSelectField(
                      'Relationship',
                      contact.relationship,
                      RELATIONSHIPS,
                      (t) => updateFamilyContact(index, { relationship: t }),
                      index === 0
                    )}
                    {renderTextField(
                      'Phone Number',
                      contact.phone,
                      (t) => updateFamilyContact(index, { phone: t }),
                      { required: index === 0, keyboardType: 'phone-pad' }
                    )}
                    {renderTextField(
                      'Alternate Phone',
                      contact.altPhone,
                      (t) => updateFamilyContact(index, { altPhone: t }),
                      { keyboardType: 'phone-pad' }
                    )}
                    {renderTextField(
                      'Email',
                      contact.email,
                      (t) => updateFamilyContact(index, { email: t }),
                      { keyboardType: 'email-address' }
                    )}
                    {renderTextField(
                      'Home Address',
                      contact.address,
                      (t) => updateFamilyContact(index, { address: t }),
                      { multiline: true }
                    )}
                    {renderTextField('City', contact.city, (t) => updateFamilyContact(index, { city: t }))}
                    {renderTextField('Country', contact.country, (t) => updateFamilyContact(index, { country: t }))}
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchLabel}>
                      <Ionicons name="notifications" size={18} color={Theme.colors.primary} />
                      <Text style={styles.switchText}>Notify on SOS activation</Text>
                    </View>
                    <Switch
                      value={contact.notifyOnSOS}
                      onValueChange={(v) => updateFamilyContact(index, { notifyOnSOS: v })}
                      trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addContactButton}
                onPress={() =>
                  addFamilyContact({
                    name: '',
                    relationship: '',
                    phone: '',
                    altPhone: '',
                    email: '',
                    address: '',
                    city: '',
                    country: '',
                    notifyOnSOS: true,
                  })
                }
              >
                <Ionicons name="add-circle" size={20} color={Theme.colors.primary} />
                <Text style={styles.addContactText}>Add Another Contact</Text>
              </TouchableOpacity>
            </View>
          </Collapsible>
        </Card>

        {/* Current Stay Details */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Current Stay in India">
            <View style={styles.sectionContent}>
              <View style={styles.fieldsGrid}>
                {renderTextField(
                  'Hotel/Accommodation Name',
                  userProfile.currentHotel,
                  (t) => updateUserProfile({ currentHotel: t }),
                  { required: true }
                )}
                {renderTextField(
                  'Full Address',
                  userProfile.hotelAddress,
                  (t) => updateUserProfile({ hotelAddress: t }),
                  { multiline: true }
                )}
                {renderTextField('Hotel Phone', userProfile.hotelPhone, (t) => updateUserProfile({ hotelPhone: t }), {
                  keyboardType: 'phone-pad',
                })}
                {renderTextField('Room Number', userProfile.roomNumber, (t) => updateUserProfile({ roomNumber: t }))}
                {renderTextField('Check-in Date', userProfile.checkInDate, (t) => updateUserProfile({ checkInDate: t }), {
                  placeholder: 'DD/MM/YYYY',
                })}
                {renderTextField('Check-out Date', userProfile.checkOutDate, (t) => updateUserProfile({ checkOutDate: t }), {
                  placeholder: 'DD/MM/YYYY',
                })}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* Medical Information */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Medical Information">
            <View style={styles.sectionContent}>
              <View style={styles.medicalAlert}>
                <Ionicons name="medical" size={18} color={Theme.colors.emergency} />
                <Text style={styles.medicalAlertText}>
                  This information can save your life in emergencies
                </Text>
              </View>

              <View style={styles.fieldsGrid}>
                {renderSelectField(
                  'Blood Type',
                  userProfile.medicalInfo.bloodType,
                  BLOOD_TYPES,
                  (t) => updateUserProfile({ medicalInfo: { bloodType: t } }),
                  true
                )}
                {renderTextField(
                  'Allergies',
                  userProfile.medicalInfo.allergies,
                  (t) => updateUserProfile({ medicalInfo: { allergies: t } }),
                  { multiline: true, placeholder: 'Food, medicine, or other allergies' }
                )}
                {renderTextField(
                  'Medical Conditions',
                  userProfile.medicalInfo.medicalConditions,
                  (t) => updateUserProfile({ medicalInfo: { medicalConditions: t } }),
                  { multiline: true, placeholder: 'Diabetes, heart condition, etc.' }
                )}
                {renderTextField(
                  'Current Medications',
                  userProfile.medicalInfo.medications,
                  (t) => updateUserProfile({ medicalInfo: { medications: t } }),
                  { multiline: true }
                )}
                {renderTextField(
                  'Insurance Provider',
                  userProfile.medicalInfo.insuranceProvider,
                  (t) => updateUserProfile({ medicalInfo: { insuranceProvider: t } })
                )}
                {renderTextField(
                  'Policy Number',
                  userProfile.medicalInfo.insurancePolicy,
                  (t) => updateUserProfile({ medicalInfo: { insurancePolicy: t } })
                )}
                {renderTextField(
                  'Doctor/Physician Contact',
                  userProfile.medicalInfo.physicianContact,
                  (t) => updateUserProfile({ medicalInfo: { physicianContact: t } }),
                  { keyboardType: 'phone-pad' }
                )}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* Travel Documents */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Travel Documents">
            <View style={styles.sectionContent}>
              <View style={styles.fieldsGrid}>
                {renderTextField(
                  'Passport Number',
                  userProfile.passportNumber,
                  (t) => updateUserProfile({ passportNumber: t }),
                  { required: true }
                )}
                {renderTextField(
                  'Passport Expiry',
                  userProfile.passportExpiry,
                  (t) => updateUserProfile({ passportExpiry: t }),
                  { placeholder: 'MM/YYYY' }
                )}
                {renderTextField('Visa Number', userProfile.visaNumber, (t) => updateUserProfile({ visaNumber: t }))}
                {renderTextField('Visa Expiry', userProfile.visaExpiry, (t) => updateUserProfile({ visaExpiry: t }), {
                  placeholder: 'MM/YYYY',
                })}
                {renderTextField(
                  'Travel Insurance',
                  userProfile.travelInsurance,
                  (t) => updateUserProfile({ travelInsurance: t })
                )}
                {renderTextField(
                  'Insurance Emergency Number',
                  userProfile.insuranceEmergencyNumber,
                  (t) => updateUserProfile({ insuranceEmergencyNumber: t }),
                  { keyboardType: 'phone-pad' }
                )}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* Embassy Information */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Embassy Information">
            <View style={styles.sectionContent}>
              <View style={styles.fieldsGrid}>
                {renderTextField(
                  'Embassy Name',
                  userProfile.embassyName,
                  (t) => updateUserProfile({ embassyName: t }),
                  { placeholder: 'e.g., US Embassy New Delhi' }
                )}
                {renderTextField(
                  'Embassy Phone',
                  userProfile.embassyPhone,
                  (t) => updateUserProfile({ embassyPhone: t }),
                  { keyboardType: 'phone-pad' }
                )}
                {renderTextField(
                  'Embassy Address',
                  userProfile.embassyAddress,
                  (t) => updateUserProfile({ embassyAddress: t }),
                  { multiline: true }
                )}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* Flight Information */}
        <Card style={styles.sectionCard}>
          <Collapsible title="Flight Details">
            <View style={styles.sectionContent}>
              <View style={styles.fieldsGrid}>
                {renderTextField(
                  'Arrival Flight',
                  userProfile.arrivalFlight,
                  (t) => updateUserProfile({ arrivalFlight: t }),
                  { placeholder: 'e.g., AI 104 · 22:15 · DEL T3' }
                )}
                {renderTextField(
                  'Departure Flight',
                  userProfile.departureFlight,
                  (t) => updateUserProfile({ departureFlight: t }),
                  { placeholder: 'e.g., BA 256 · 02:10 · DEL T3' }
                )}
              </View>
            </View>
          </Collapsible>
        </Card>

        {/* SOS Settings */}
        <Card style={styles.sectionCard}>
          <Collapsible title="SOS Settings">
            <View style={styles.sectionContent}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Shake to trigger SOS</Text>
                  <Text style={styles.settingDesc}>Shake your phone vigorously to activate SOS</Text>
                </View>
                <Switch
                  value={sosSettings.shakeToSOS}
                  onValueChange={(v) => updateSOSSettings({ shakeToSOS: v })}
                  trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto location share</Text>
                  <Text style={styles.settingDesc}>Automatically share location during SOS</Text>
                </View>
                <Switch
                  value={sosSettings.autoLocationShare}
                  onValueChange={(v) => updateSOSSettings({ autoLocationShare: v })}
                  trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Play siren on SOS</Text>
                  <Text style={styles.settingDesc}>Loud alarm when SOS is activated</Text>
                </View>
                <Switch
                  value={sosSettings.sirenOnSOS}
                  onValueChange={(v) => updateSOSSettings({ sirenOnSOS: v })}
                  trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Record on SOS</Text>
                  <Text style={styles.settingDesc}>Start audio recording when SOS triggers</Text>
                </View>
                <Switch
                  value={sosSettings.audioRecordOnSOS}
                  onValueChange={(v) => updateSOSSettings({ audioRecordOnSOS: v })}
                  trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto call emergency</Text>
                  <Text style={styles.settingDesc}>Automatically dial 112 on SOS</Text>
                </View>
                <Switch
                  value={sosSettings.autoCallEmergency}
                  onValueChange={(v) => updateSOSSettings({ autoCallEmergency: v })}
                  trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primaryLight }}
                />
              </View>

              {renderTextField(
                'Fake Call Name',
                sosSettings.fakeCallerName,
                (t) => updateSOSSettings({ fakeCallerName: t }),
                { placeholder: 'Name shown for fake calls' }
              )}
            </View>
          </Collapsible>
        </Card>

        {/* Quick Links */}
        <Card style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/screens/Settings')}>
            <View style={styles.quickLinkIcon}>
              <Ionicons name="settings-outline" size={22} color={Theme.colors.primary} />
            </View>
            <Text style={styles.quickLinkText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.subtleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/screens/Trips')}>
            <View style={styles.quickLinkIcon}>
              <Ionicons name="airplane-outline" size={22} color={Theme.colors.primary} />
            </View>
            <Text style={styles.quickLinkText}>My Trips</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.subtleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/tabs/emergency')}>
            <View style={[styles.quickLinkIcon, { backgroundColor: Theme.colors.emergencyBg }]}>
              <Ionicons name="alert-circle" size={22} color={Theme.colors.emergency} />
            </View>
            <Text style={styles.quickLinkText}>Emergency Hub</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.subtleText} />
          </TouchableOpacity>
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
  header: {
    marginBottom: Theme.spacing.md,
  },
  headerGradient: {
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: Theme.font.size['2xl'],
    fontWeight: '700',
    color: Theme.colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.white,
  },
  headerTagline: {
    fontSize: Theme.font.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressSection: {
    marginTop: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Theme.radius.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressValue: {
    color: Theme.colors.white,
    fontWeight: '700',
    fontSize: Theme.font.size.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: 4,
  },
  progressHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Theme.font.size.xs,
    marginTop: Theme.spacing.xs,
  },
  alertCard: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.warningBg,
    borderWidth: 1,
    borderColor: Theme.colors.warning,
  },
  alertContent: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  alertDescription: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    marginTop: 2,
  },
  sectionCard: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  criticalSection: {
    borderWidth: 2,
    borderColor: Theme.colors.emergency,
  },
  sectionContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  mandatoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.emergencyBg,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  mandatoryText: {
    color: Theme.colors.emergency,
    fontSize: Theme.font.size.sm,
    fontWeight: '600',
  },
  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.emergency,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  criticalText: {
    color: Theme.colors.white,
    fontSize: Theme.font.size.sm,
    fontWeight: '700',
  },
  fieldsGrid: {
    gap: Theme.spacing.md,
  },
  fieldContainer: {
    gap: Theme.spacing.xs,
  },
  fieldContainerFull: {
    width: '100%',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  fieldLabel: {
    fontWeight: '600',
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
  },
  requiredBadge: {
    backgroundColor: Theme.colors.emergency,
    color: Theme.colors.white,
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.radius.xs,
    overflow: 'hidden',
  },
  fieldInput: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.font.size.md,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsScroll: {
    flexGrow: 0,
  },
  optionChip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.backgroundSecondary,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  optionChipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  optionText: {
    color: Theme.colors.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Theme.colors.white,
  },
  contactCard: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  switchText: {
    color: Theme.colors.text,
    fontWeight: '500',
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.colors.primary,
  },
  addContactText: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  medicalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.emergencyBg,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  medicalAlertText: {
    color: Theme.colors.emergency,
    fontWeight: '600',
    fontSize: Theme.font.size.sm,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  settingDesc: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  quickLinks: {
    marginHorizontal: Theme.spacing.md,
    gap: 0,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkText: {
    flex: 1,
    fontWeight: '600',
    color: Theme.colors.text,
  },
});

export default UserProfileScreen;
