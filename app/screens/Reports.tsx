import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppButton from '../../components/ui/AppButton';
import Card from '../../components/ui/Card';
import MapPreview from '../../components/ui/MapPreview';
import Screen from '../../components/ui/Screen';
import SectionHeader from '../../components/ui/SectionHeader';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';

const categories = ['theft', 'harassment', 'danger', 'unsafe-feeling', 'other'] as const;

const ReportsScreen = () => {
  const { incidentReports, addIncidentReport } = useAppStore();
  const [category, setCategory] = useState<(typeof categories)[number]>('unsafe-feeling');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const recentReports = useMemo(() => incidentReports.slice(-5).reverse(), [incidentReports]);

  const handleSubmit = () => {
    if (!location || !description) {
      Alert.alert('Add more detail', 'Location and description are required.');
      return;
    }
    addIncidentReport({
      id: Date.now().toString(),
      category,
      location,
      description,
      timestamp: new Date().toISOString(),
    });
    setLocation('');
    setDescription('');
    Alert.alert('Submitted', 'Your report was queued for moderation.');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader title="Report what you see" subtitle="Crowd-sourced tips make travel safer." />
        <Card style={styles.card}>
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, category === item && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item.replace('-', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.inputLabel}>Location / landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Market, metro gate, café..."
            value={location}
            onChangeText={setLocation}
            placeholderTextColor={Theme.colors.subtleText}
          />

          <Text style={styles.inputLabel}>What happened?</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Keep it concise but detailed so others can act quickly."
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor={Theme.colors.subtleText}
          />
          <AppButton title="Submit for moderation" onPress={handleSubmit} />
        </Card>

        <SectionHeader title="Live map" subtitle="Heat spots from the last 12 hours" />
        <Card style={styles.card}>
          <MapPreview
            region={{ latitude: 28.62, longitude: 77.21, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
            markers={recentReports.map((report, index) => ({
              id: report.id,
              coordinate: { latitude: 28.62 + index * 0.002, longitude: 77.21 + index * 0.002 },
              label: report.location,
            }))}
            height={220}
          />
        </Card>

        <SectionHeader title="Community feed" subtitle="Verified submissions" />
        {recentReports.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No reports yet. Be the first to flag what you see.</Text>
          </Card>
        ) : (
          recentReports.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportBadge}>
                  <Ionicons name="alert-circle-outline" size={16} color={Theme.colors.white} />
                </View>
                <Text style={styles.reportCategory}>{report.category.toUpperCase()}</Text>
                <Text style={styles.reportTime}>{new Date(report.timestamp).toLocaleTimeString()}</Text>
              </View>
              <Text style={styles.reportLocation}>{report.location}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  card: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  chipRow: {
    paddingVertical: Theme.spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Theme.colors.white,
  },
  input: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    padding: Theme.spacing.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  emptyText: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  reportCard: {
    marginBottom: Theme.spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  reportBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCategory: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  reportTime: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  reportLocation: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.md,
    marginBottom: Theme.spacing.xs,
    color: Theme.colors.text,
  },
  reportDescription: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
});

export default ReportsScreen; 