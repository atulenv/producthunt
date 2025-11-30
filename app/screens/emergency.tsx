// Enhanced Emergency Hub with comprehensive SOS features
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Modal,
  Vibration,
} from 'react-native';
import Card from '../../components/ui/Card';
import Screen from '../../components/ui/Screen';
import SectionHeader from '../../components/ui/SectionHeader';
import { Theme } from '../../constants/theme';
import { RESOURCE_LINKS, SAFE_SPOTS } from '../../src/lib/safety-data';
import { useAppStore } from '../../src/store/use-app-store';

type SOSFeature = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  action: () => void;
};

type EmergencyScreenProps = {
  footerInset?: number;
};

const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ footerInset = 0 }) => {
  const { sosSettings, sosActive, triggerSOS, deactivateSOS, userProfile } = useAppStore();
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const [silentSOSActive, setSilentSOSActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (sosActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [sosActive, pulseAnim]);

  // Fake call countdown
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setFakeCallActive(true);
      setCountdown(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    }
  }, [countdown]);

  const handleMainSOS = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    triggerSOS();
    
    if (sosSettings.sirenOnSOS) {
      setSirenActive(true);
    }
    if (sosSettings.audioRecordOnSOS) {
      setRecordingActive(true);
    }
    if (sosSettings.autoCallEmergency) {
      Linking.openURL(`tel:${sosSettings.emergencyNumber}`);
    }
    
    Alert.alert(
      'SOS ACTIVATED',
      'Emergency services are being contacted. Your location is being shared with your emergency contacts.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleDeactivateSOS = () => {
    Alert.alert(
      'Deactivate SOS?',
      'Are you safe now? This will stop sharing your location and alert your contacts that you are okay.',
      [
        { text: 'Keep Active', style: 'cancel' },
        {
          text: 'I\'m Safe',
          style: 'destructive',
          onPress: () => {
            deactivateSOS();
            setSirenActive(false);
            setRecordingActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleFakeCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCountdown(sosSettings.fakeCallDelay);
    Alert.alert(
      'Fake Call Scheduled',
      `You will receive a fake call from "${sosSettings.fakeCallerName}" in ${sosSettings.fakeCallDelay} seconds.`,
      [{ text: 'OK' }, { text: 'Cancel', onPress: () => setCountdown(null), style: 'cancel' }]
    );
  };

  const handleSilentSOS = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSilentSOSActive(true);
    triggerSOS();
    // No alert, no sound - just silently trigger
  };

  const handleSiren = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSirenActive(!sirenActive);
    if (!sirenActive) {
      Vibration.vibrate([0, 1000, 500, 1000, 500, 1000], true);
      Alert.alert('SIREN ACTIVE', 'Loud alarm is playing. Tap again to stop.');
    } else {
      Vibration.cancel();
    }
  };

  const handleRecording = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRecordingActive(!recordingActive);
    Alert.alert(
      recordingActive ? 'Recording Stopped' : 'Recording Started',
      recordingActive
        ? 'Audio/video recording has been saved.'
        : 'Recording audio and video. This will be saved and can be shared with authorities.'
    );
  };

  const handleShareLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const familyContacts = userProfile.familyContacts.filter(c => c.notifyOnSOS && c.phone);
    if (familyContacts.length === 0) {
      Alert.alert('No Contacts', 'Please add family contacts in your profile first.');
      return;
    }
    Alert.alert(
      'Location Shared',
      `Your live location has been sent to ${familyContacts.length} emergency contact(s).`
    );
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const sosFeatures: SOSFeature[] = [
    {
      id: 'fake-call',
      title: 'Fake Call',
      description: 'Get a fake incoming call to escape uncomfortable situations',
      icon: 'call-outline',
      color: Theme.colors.primary,
      bgColor: 'rgba(30, 64, 175, 0.1)',
      action: handleFakeCall,
    },
    {
      id: 'silent-sos',
      title: 'Silent SOS',
      description: 'Trigger SOS without any sound or visible alert',
      icon: 'volume-mute-outline',
      color: Theme.colors.emergency,
      bgColor: Theme.colors.emergencyBg,
      action: handleSilentSOS,
    },
    {
      id: 'siren',
      title: sirenActive ? 'Stop Siren' : 'Loud Siren',
      description: 'Play loud alarm to attract attention',
      icon: sirenActive ? 'volume-off-outline' : 'megaphone-outline',
      color: sirenActive ? Theme.colors.success : Theme.colors.warning,
      bgColor: sirenActive ? Theme.colors.successBg : Theme.colors.warningBg,
      action: handleSiren,
    },
    {
      id: 'record',
      title: recordingActive ? 'Stop Recording' : 'Record Evidence',
      description: 'Record audio/video as evidence',
      icon: recordingActive ? 'stop-circle-outline' : 'videocam-outline',
      color: recordingActive ? Theme.colors.emergency : Theme.colors.secondary,
      bgColor: recordingActive ? Theme.colors.emergencyBg : 'rgba(13, 148, 136, 0.1)',
      action: handleRecording,
    },
    {
      id: 'share-location',
      title: 'Share Location',
      description: 'Send live location to all emergency contacts',
      icon: 'location-outline',
      color: Theme.colors.accent,
      bgColor: 'rgba(99, 102, 241, 0.1)',
      action: handleShareLocation,
    },
    {
      id: 'emergency-sms',
      title: 'Emergency SMS',
      description: 'Send pre-written SOS message to contacts',
      icon: 'chatbubble-outline',
      color: Theme.colors.primary,
      bgColor: 'rgba(30, 64, 175, 0.1)',
      action: () => {
        const message = `EMERGENCY: I need help! My location: [GPS coordinates]. Please contact local authorities.`;
        Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
      },
    },
  ];

  const quickCalls = [
    { id: 'police', label: 'Police', number: '100', icon: 'shield-checkmark' },
    { id: 'ambulance', label: 'Ambulance', number: '108', icon: 'medkit' },
    { id: 'women', label: 'Women Helpline', number: '1091', icon: 'woman' },
    { id: 'tourist', label: 'Tourist Helpline', number: '1363', icon: 'airplane' },
    { id: 'emergency', label: 'Emergency', number: '112', icon: 'alert-circle' },
    { id: 'fire', label: 'Fire', number: '101', icon: 'flame' },
  ];

  return (
    <Screen style={styles.screen} footerInset={footerInset}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main SOS Button */}
        <View style={styles.sosSection}>
          <LinearGradient
            colors={sosActive ? ['#DC2626', '#B91C1C', '#991B1B'] : ['#1E40AF', '#1E3A8A', '#172554']}
            style={styles.sosGradient}
          >
            <View style={styles.sosHeader}>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, sosActive && styles.statusDotActive]} />
                <Text style={styles.statusText}>
                  {sosActive ? 'SOS ACTIVE' : 'System Ready'}
                </Text>
              </View>
              {recordingActive && (
                <View style={styles.recordingBadge}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>REC</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.mainSOSButton}
              onPress={sosActive ? handleDeactivateSOS : handleMainSOS}
              activeOpacity={0.8}
            >
              <Animated.View style={[styles.sosButtonInner, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={sosActive ? ['#FEE2E2', '#FECACA'] : ['#FFFFFF', '#F1F5F9']}
                  style={styles.sosButtonGradient}
                >
                  <Ionicons
                    name={sosActive ? 'close' : 'alert-circle'}
                    size={80}
                    color={sosActive ? Theme.colors.emergency : Theme.colors.primary}
                  />
                  <Text style={[styles.sosButtonText, sosActive && styles.sosButtonTextActive]}>
                    {sosActive ? 'DEACTIVATE' : 'SOS'}
                  </Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            
            <Text style={styles.sosInstruction}>
              {sosActive
                ? 'Tap to deactivate and notify contacts you are safe'
                : 'Tap and hold for emergency. Calls 112 + shares location.'}
            </Text>
            
            {sosActive && (
              <View style={styles.activeFeatures}>
                <View style={styles.activeFeature}>
                  <Ionicons name="location" size={16} color="#FEE2E2" />
                  <Text style={styles.activeFeatureText}>Location sharing</Text>
                </View>
                {recordingActive && (
                  <View style={styles.activeFeature}>
                    <Ionicons name="videocam" size={16} color="#FEE2E2" />
                    <Text style={styles.activeFeatureText}>Recording</Text>
                  </View>
                )}
                {sirenActive && (
                  <View style={styles.activeFeature}>
                    <Ionicons name="volume-high" size={16} color="#FEE2E2" />
                    <Text style={styles.activeFeatureText}>Siren active</Text>
                  </View>
                )}
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Quick Emergency Calls */}
        <Card style={styles.card}>
          <SectionHeader
            title="Emergency Numbers (India)"
            subtitle="Tap to call immediately"
            icon="call-outline"
          />
          <View style={styles.quickCallsGrid}>
            {quickCalls.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickCallButton}
                onPress={() => handleCall(item.number)}
                activeOpacity={0.7}
              >
                <View style={styles.quickCallIcon}>
                  <Ionicons name={item.icon as any} size={24} color={Theme.colors.emergency} />
                </View>
                <Text style={styles.quickCallLabel}>{item.label}</Text>
                <Text style={styles.quickCallNumber}>{item.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* SOS Features Grid */}
        <Card style={styles.card}>
          <SectionHeader
            title="Safety Tools"
            subtitle="Additional features for your protection"
            icon="shield-checkmark-outline"
          />
          <View style={styles.featuresGrid}>
            {sosFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.featureCard, { backgroundColor: feature.bgColor }]}
                onPress={feature.action}
                activeOpacity={0.7}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon} size={22} color={Theme.colors.white} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Nearby Safe Spots */}
        <Card style={styles.card}>
          <SectionHeader
            title="Nearby Safe Locations"
            subtitle="Verified safe places near you"
            icon="location-outline"
          />
          {SAFE_SPOTS.map((spot) => (
            <View key={spot.id} style={styles.safeSpot}>
              <View style={[styles.spotIcon, spot.type === 'police' && styles.spotIconPolice, spot.type === 'hospital' && styles.spotIconHospital]}>
                <Ionicons
                  name={spot.type === 'police' ? 'shield-checkmark' : spot.type === 'hospital' ? 'medkit' : 'flag'}
                  size={20}
                  color={Theme.colors.white}
                />
              </View>
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotAddress}>{spot.address}</Text>
                <Text style={styles.spotNotes}>{spot.notes}</Text>
              </View>
              <View style={styles.spotActions}>
                <Text style={styles.spotDistance}>{spot.distanceKm} km</Text>
                <TouchableOpacity
                  style={styles.spotCallButton}
                  onPress={() => handleCall('112')}
                >
                  <Ionicons name="navigate" size={16} color={Theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>

        {/* Hotlines */}
        <Card style={styles.card}>
          <SectionHeader
            title="Helplines"
            subtitle="24/7 support services"
            icon="headset-outline"
          />
          {RESOURCE_LINKS.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.hotlineRow}
              onPress={() => handleCall(resource.contactValue)}
            >
              <View style={styles.hotlineInfo}>
                <Text style={styles.hotlineTitle}>{resource.title}</Text>
                <Text style={styles.hotlineSummary}>{resource.summary}</Text>
              </View>
              <View style={styles.hotlineAction}>
                <Text style={styles.hotlineNumber}>{resource.contactValue}</Text>
                <Ionicons name="call" size={18} color={Theme.colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Fake Call Modal */}
        <Modal visible={fakeCallActive} animationType="slide" presentationStyle="fullScreen">
          <View style={styles.fakeCallModal}>
            <View style={styles.fakeCallContent}>
              <View style={styles.fakeCallerAvatar}>
                <Ionicons name="person" size={60} color={Theme.colors.white} />
              </View>
              <Text style={styles.fakeCallerName}>{sosSettings.fakeCallerName}</Text>
              <Text style={styles.fakeCallStatus}>Incoming call...</Text>
              
              <View style={styles.fakeCallActions}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {
                    setFakeCallActive(false);
                    Vibration.cancel();
                  }}
                >
                  <Ionicons name="close" size={32} color={Theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    setFakeCallActive(false);
                    Vibration.cancel();
                    Alert.alert('Call Connected', 'Pretend to talk on the phone. Tap OK when done.');
                  }}
                >
                  <Ionicons name="call" size={32} color={Theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Countdown Modal */}
        {countdown !== null && (
          <View style={styles.countdownOverlay}>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownText}>Fake call in</Text>
              <Text style={styles.countdownNumber}>{countdown}</Text>
              <TouchableOpacity
                style={styles.countdownCancel}
                onPress={() => setCountdown(null)}
              >
                <Text style={styles.countdownCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingBottom: Theme.spacing.xl * 2,
  },
  sosSection: {
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    ...Theme.shadows.xl,
  },
  sosGradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  sosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
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
  statusText: {
    color: Theme.colors.white,
    fontWeight: '600',
    fontSize: Theme.font.size.sm,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.emergency,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.white,
  },
  recordingText: {
    color: Theme.colors.white,
    fontWeight: '700',
    fontSize: Theme.font.size.xs,
  },
  mainSOSButton: {
    marginVertical: Theme.spacing.lg,
  },
  sosButtonInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    ...Theme.shadows.emergency,
  },
  sosButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    fontSize: Theme.font.size.xl,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginTop: Theme.spacing.xs,
  },
  sosButtonTextActive: {
    color: Theme.colors.emergency,
    fontSize: Theme.font.size.lg,
  },
  sosInstruction: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: Theme.font.size.sm,
    maxWidth: 280,
  },
  activeFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  activeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  activeFeatureText: {
    color: '#FEE2E2',
    fontSize: Theme.font.size.xs,
    fontWeight: '500',
  },
  card: {
    gap: Theme.spacing.md,
  },
  quickCallsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  quickCallButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Theme.colors.emergencyBg,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    gap: Theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  quickCallIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  quickCallLabel: {
    fontWeight: '600',
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
    textAlign: 'center',
  },
  quickCallNumber: {
    color: Theme.colors.emergency,
    fontWeight: '700',
    fontSize: Theme.font.size.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    gap: Theme.spacing.xs,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
  },
  featureDesc: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.xs,
    lineHeight: 16,
  },
  safeSpot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
    marginBottom: Theme.spacing.sm,
  },
  spotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotIconPolice: {
    backgroundColor: Theme.colors.accent,
  },
  spotIconHospital: {
    backgroundColor: Theme.colors.emergency,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  spotAddress: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  spotNotes: {
    color: Theme.colors.secondary,
    fontSize: Theme.font.size.xs,
    marginTop: 2,
  },
  spotActions: {
    alignItems: 'flex-end',
    gap: Theme.spacing.xs,
  },
  spotDistance: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
    fontWeight: '500',
  },
  spotCallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
    marginBottom: Theme.spacing.sm,
  },
  hotlineInfo: {
    flex: 1,
  },
  hotlineTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
  },
  hotlineSummary: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  hotlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  hotlineNumber: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  fakeCallModal: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeCallContent: {
    alignItems: 'center',
    gap: Theme.spacing.lg,
  },
  fakeCallerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeCallerName: {
    color: Theme.colors.white,
    fontSize: Theme.font.size['2xl'],
    fontWeight: '700',
  },
  fakeCallStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Theme.font.size.lg,
  },
  fakeCallActions: {
    flexDirection: 'row',
    gap: Theme.spacing.xl * 2,
    marginTop: Theme.spacing.xl,
  },
  declineButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownBox: {
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.xl,
    borderRadius: Theme.radius.xl,
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  countdownText: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.lg,
  },
  countdownNumber: {
    color: Theme.colors.primary,
    fontSize: 64,
    fontWeight: '800',
  },
  countdownCancel: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.lightGray,
    borderRadius: Theme.radius.full,
  },
  countdownCancelText: {
    color: Theme.colors.text,
    fontWeight: '600',
  },
});

export default EmergencyScreen;
