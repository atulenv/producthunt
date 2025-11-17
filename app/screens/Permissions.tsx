// UI Revamp – new Permissions screen layout and styles.
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component
import AppButton from '../../components/ui/AppButton'; // UI Revamp - Use new AppButton component

const PermissionsScreen = () => {
  const router = useRouter();

  const requestPermissions = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: notificationsStatus } = await Notifications.requestPermissionsAsync();

    if (locationStatus === 'granted' && notificationsStatus === 'granted') {
      router.replace('/tabs/home');
    } else {
      // Handle permission denial
      alert('Permissions not granted. Some features may not work.'); // UI Revamp - Simple alert for denial
    }
  };

  return (
    <Screen style={styles.screen}>
      <Card style={styles.contentCard}>
        <Text style={styles.title}>Permissions Required</Text>
        <Text style={styles.description}>
          To provide you with the best experience, we need access to your location and notifications.
          This helps us offer real-time safety alerts and personalized recommendations.
        </Text>
        <AppButton title="Grant Permissions" onPress={requestPermissions} style={styles.button} />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl, // UI Revamp - Increased padding
    marginHorizontal: Theme.spacing.md, // UI Revamp - Add horizontal margin
  },
  title: {
    fontSize: Theme.font.size['2xl'],
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text, // UI Revamp - Use theme text color
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText, // UI Revamp - Use subtle text color
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: Theme.font.size.lg * 1.5, // UI Revamp - Improved readability
  },
  button: {
    width: '100%', // UI Revamp - Full width button
  },
});

export default PermissionsScreen;
