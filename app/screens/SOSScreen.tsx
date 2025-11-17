// UI Revamp – new SOS screen layout and styles.
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/theme';
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component

const SOSScreen = () => {
  const handleSosPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Linking.openURL('tel:112'); // UI Revamp - Keep emergency number
  };

  return (
    <Screen style={styles.screen}>
      <Card style={styles.contentCard}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSosPress}>
          <Ionicons name="call-outline" size={80} color={Theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Call Emergency Services</Text>
        <Text style={styles.description}>
          Press the button to call the local emergency number (112).
          Your trusted contacts will also be notified.
        </Text>
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
    padding: Theme.spacing.xl,
    marginHorizontal: Theme.spacing.md,
  },
  sosButton: {
    backgroundColor: Theme.colors.danger,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.lg,
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.font.size['2xl'],
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text, // UI Revamp - Use theme text color
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText, // UI Revamp - Use subtle text color
    marginTop: Theme.spacing.md,
    textAlign: 'center',
    lineHeight: Theme.font.size.lg * 1.5, // UI Revamp - Improved readability
  },
});

export default SOSScreen;
