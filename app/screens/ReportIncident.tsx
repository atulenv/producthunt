// UI Revamp – new Report Incident screen layout and styles.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import AppButton from '../../components/ui/AppButton'; // UI Revamp - Use new AppButton component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';

const ReportIncidentScreen = () => {
  const router = useRouter();
  const { addIncidentReport } = useAppStore();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    const newIncident = {
      id: Math.random().toString(),
      category: category as any,
      location,
      description,
      timestamp: new Date().toISOString(),
    };
    addIncidentReport(newIncident);
    router.back();
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* UI Revamp - Removed custom header, relying on stack navigator header */}

        <Card style={styles.formCard}>
          <Text style={styles.inputLabel}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Theft, Harassment, Accident"
            placeholderTextColor={Theme.colors.subtleText}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Main Square, Street Name"
            placeholderTextColor={Theme.colors.subtleText}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Provide details about the incident..."
            placeholderTextColor={Theme.colors.subtleText}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </Card>

        <AppButton title="Submit Report" onPress={handleSave} style={styles.submitButton} />
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
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: Theme.spacing.md, // UI Revamp - Adjust padding for multiline
  },
  submitButton: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
});

export default ReportIncidentScreen;
