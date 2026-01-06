
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useAppStore, TrustedContact } from '@/src/store/use-app-store';
import { Theme } from '@/constants/theme';

const DURATION_OPTIONS = [5, 10, 15, 30, 45, 60]; // in minutes

export default function SafetyCheckInScreen() {
  const navigation = useNavigation();
  const { trustedContacts } = useAppStore();
  const [duration, setDuration] = useState<number | null>(null);
  const [contact, setContact] = useState<TrustedContact | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Safety Check-in' });
  }, [navigation]);

  useEffect(() => {
    if (!isActive || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsActive(false);
      // Simulate sending an alert
      console.log(`!!! ALERT !!! Time expired. Sending notification to ${contact?.name} with last known location.`);
      Alert.alert(
        'Check-in Expired',
        `An alert has been sent to ${contact?.name} with your location.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, contact, navigation]);

  const handleStartCheckIn = () => {
    if (!duration || !contact) {
      Alert.alert('Missing Information', 'Please select a duration and a contact.');
      return;
    }
    const durationInSeconds = duration * 60;
    setTimeLeft(durationInSeconds);
    setIsActive(true);
  };

  const handleMarkAsSafe = () => {
    setIsActive(false);
    setTimeLeft(null);
    Alert.alert('You are Safe', 'Your safety check-in has been cancelled.');
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const headerText = useMemo(() => {
    if (isActive) return 'Check-in in Progress';
    return 'Start a New Safety Check-in';
    }, [isActive]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>{headerText}</ThemedText>

        {isActive && timeLeft !== null ? (
          <View style={styles.timerContainer}>
            <ThemedText style={styles.timerIntro}>Time remaining until alert:</ThemedText>
            <ThemedText style={styles.timer}>{formatTime(timeLeft)}</ThemedText>
            <AppButton title="I'm Safe" onPress={handleMarkAsSafe} />
          </View>
        ) : (
          <>
            <Card style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardHeader}>1. Select Duration</ThemedText>
              <View style={styles.optionsContainer}>
                {DURATION_OPTIONS.map(min => (
                  <AppButton
                    key={min}
                    title={`${min} min`}
                    onPress={() => setDuration(min)}
                    style={[styles.optionButton, duration === min && styles.selectedOption]}
                    textStyle={duration === min ? styles.selectedOptionText : {}}
                  />
                ))}
              </View>
            </Card>

            <Card style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardHeader}>2. Select Contact</ThemedText>
              {trustedContacts.length > 0 ? (
                <View style={styles.optionsContainer}>
                  {trustedContacts.map(c => (
                    <AppButton
                      key={c.id}
                      title={c.name}
                      onPress={() => setContact(c)}
                      style={[styles.optionButton, contact?.id === c.id && styles.selectedOption]}
                      textStyle={contact?.id === c.id ? styles.selectedOptionText : {}}
                    />
                  ))}
                </View>
              ) : (
                <ThemedText style={styles.noContactsText}>
                  Please add a trusted contact from the home screen first.
                </ThemedText>
              )}
            </Card>

            <AppButton
              title="Start Safety Check-in"
              onPress={handleStartCheckIn}
              disabled={!duration || !contact}
              style={styles.startButton}
            />
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
  },
  header: {
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  card: {
    marginBottom: Theme.spacing.md,
  },
  cardHeader: {
    marginBottom: Theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  optionButton: {
    backgroundColor: Theme.colors.card,
    borderColor: Theme.colors.border,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  selectedOptionText: {
      color: Theme.colors.white,
  },
  startButton: {
    marginTop: Theme.spacing.md,
  },
  timerContainer: {
    alignItems: 'center',
    padding: Theme.spacing.md * 2,
  },
  timerIntro: {
    fontSize: 16,
    marginBottom: Theme.spacing.md,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: Theme.spacing.md,
  },
  noContactsText: {
    textAlign: 'center',
    color: Theme.colors.subtleText,
    marginVertical: Theme.spacing.md,
  }
});
