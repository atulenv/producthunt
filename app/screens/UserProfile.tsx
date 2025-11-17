// UI Revamp – new User Profile screen layout and styles.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component

const UserProfileScreen = () => {
  const router = useRouter();
  const { userProfile, trustedContacts, incidentReports, savedPlaces } = useAppStore();

  const profileSections = [
    { title: 'Trusted Contacts', count: trustedContacts.length, onPress: () => {} },
    { title: 'My Reports', count: incidentReports.length, onPress: () => {} },
    { title: 'Saved Places', count: savedPlaces.length, onPress: () => {} },
    { title: 'Preferences', icon: 'chevron-forward-outline', onPress: () => router.push('/tabs/settings') },
  ];

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{userProfile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileTagline}>{userProfile.tagline}</Text>
        </View>

        <View style={styles.sectionsContainer}>
          {profileSections.map((section, index) => (
            <Card key={index} style={styles.sectionCard}>
              <TouchableOpacity style={styles.sectionHeader} onPress={section.onPress}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.count !== undefined ? (
                  <Text style={styles.sectionCount}>{section.count}</Text>
                ) : (
                  <Ionicons name={section.icon as any} size={24} color={Theme.colors.subtleText} />
                )}
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl, // UI Revamp - Adjusted padding
    backgroundColor: Theme.colors.white, // UI Revamp - White background for header
    marginBottom: Theme.spacing.md, // UI Revamp - Add margin bottom
    ...Theme.shadows.sm, // UI Revamp - Subtle shadow
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatarInitial: {
    fontSize: Theme.font.size['2xl'], // UI Revamp - Use theme font size
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
  },
  profileName: {
    fontSize: Theme.font.size.xl,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text, // UI Revamp - Use theme text color
  },
  profileTagline: {
    marginTop: Theme.spacing.xs,
    fontSize: Theme.font.size.md, // UI Revamp - Use theme font size
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText, // UI Revamp - Use subtle text color
  },
  sectionsContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  sectionCard: {
    marginBottom: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm, // UI Revamp - Adjusted padding
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm, // UI Revamp - Add horizontal padding
  },
  sectionTitle: {
    fontSize: Theme.font.size.md, // UI Revamp - Use theme font size
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text, // UI Revamp - Use theme text color
  },
  sectionCount: {
    fontSize: Theme.font.size.md, // UI Revamp - Use theme font size
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText, // UI Revamp - Use subtle text color
  },
});

export default UserProfileScreen;