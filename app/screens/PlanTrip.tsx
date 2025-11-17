// UI Revamp – new Plan Trip screen layout and styles.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import AppButton from '../../components/ui/AppButton'; // UI Revamp - Use new AppButton component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component

const PlanTripScreen = () => {
  const router = useRouter();
  const { addTrip } = useAppStore();
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [toggles, setToggles] = useState({
    nightlife: false,
    heritage: false,
    nature: false,
    shopping: false,
  });

  const handleSave = () => {
    const newTrip = {
      id: Math.random().toString(),
      city,
      startDate,
      endDate,
      riskLevel: 'low' as const, // Defaulting to low for now
      checklist: [],
    };
    addTrip(newTrip);
    router.back();
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* UI Revamp - Removed custom header, relying on stack navigator header */}

        <Card style={styles.formCard}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Paris"
            placeholderTextColor={Theme.colors.subtleText}
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.inputLabel}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Theme.colors.subtleText}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.inputLabel}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Theme.colors.subtleText}
            value={endDate}
            onChangeText={setEndDate}
          />
        </Card>

        <Card style={styles.togglesCard}>
          <Text style={styles.sectionTitle}>Interests</Text>
          {Object.entries(toggles).map(([key, value]) => (
            <View key={key} style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Switch
                trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primary }}
                thumbColor={Platform.OS === 'android' ? Theme.colors.white : Theme.colors.white}
                ios_backgroundColor={Theme.colors.lightGray}
                onValueChange={() => setToggles({ ...toggles, [key]: !value })}
                value={value}
              />
            </View>
          ))}
        </Card>

        <AppButton title="Save Trip" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.md,
  },
  formCard: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
  },
  input: {
    height: 50, // UI Revamp - Increased height for better touch
    backgroundColor: Theme.colors.lightGray,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    marginHorizontal: Theme.spacing.md,
  },
  togglesCard: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.font.size.lg,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  toggleLabel: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  saveButton: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
});

export default PlanTripScreen;
