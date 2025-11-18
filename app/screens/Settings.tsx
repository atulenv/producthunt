// UI Revamp – new Settings screen layout and styles.
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Theme } from '../../constants/theme';
import { useAppStore } from '../../src/store/use-app-store';
import Screen from '../../components/ui/Screen'; // UI Revamp - Use new Screen component
import Card from '../../components/ui/Card'; // UI Revamp - Use new Card component
import { SUPPORTED_LANGUAGES, useTranslate } from '../../src/hooks/use-translate';

const SettingsScreen = () => {
  const t = useTranslate();
  const { theme, setTheme, language, setLanguage } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* UI Revamp - Removed custom header, relying on tab navigator header */}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.display')}</Text>
          <Card style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{t('settings.darkMode')}</Text>
              <Switch
                trackColor={{ false: Theme.colors.lightGray, true: Theme.colors.primary }}
                thumbColor={Platform.OS === 'android' ? Theme.colors.white : Theme.colors.white} // UI Revamp - Consistent thumb color
                ios_backgroundColor={Theme.colors.lightGray} // UI Revamp - iOS background color
                onValueChange={toggleTheme}
                value={theme === 'dark'}
              />
            </View>
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionHelper}>{t('settings.multiLanguageLabel')}</Text>
          <Card style={styles.card}>
            {SUPPORTED_LANGUAGES.map((lang, index) => (
              <View key={lang.id}>
                <TouchableOpacity style={styles.languageOption} onPress={() => setLanguage(lang.id)}>
                  <View>
                    <Text style={styles.languageLabel}>{lang.label}</Text>
                    <Text style={styles.languageSub}>{lang.id.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.radioOuter, language === lang.id && styles.radioOuterActive]}>
                    {language === lang.id ? <View style={styles.radioInner} /> : null}
                  </View>
                </TouchableOpacity>
                {index < SUPPORTED_LANGUAGES.length - 1 ? <View style={styles.separator} /> : null}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Card style={styles.card}>
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Text style={styles.itemText}>Terms of Service</Text>
              <Ionicons name="chevron-forward-outline" size={24} color={Theme.colors.subtleText} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Text style={styles.itemText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward-outline" size={24} color={Theme.colors.subtleText} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
  },
  sectionContainer: {
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.font.size.lg,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text, // UI Revamp - Use theme text color
    marginBottom: Theme.spacing.md,
  },
  sectionHelper: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    marginBottom: Theme.spacing.sm,
  },
  card: {
    padding: 0, // Card component already has padding, adjust if needed
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  itemText: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text, // UI Revamp - Use theme text color
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  languageLabel: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  languageSub: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: Theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.lightGray,
    marginHorizontal: Theme.spacing.md,
  },
});

export default SettingsScreen;
