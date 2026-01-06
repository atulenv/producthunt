
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import AppButton from '@/components/ui/AppButton';
import { useAppStore, TrustedContact } from '@/src/store/use-app-store';
import { Theme } from '@/constants/theme';

export default function EditContactScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTrustedContact, updateTrustedContact, trustedContacts } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    const { contactId: id } = params;
    if (id && typeof id === 'string') {
      const existingContact = trustedContacts.find(c => c.id === id);
      if (existingContact) {
        setName(existingContact.name);
        setPhone(existingContact.phone);
        setContactId(existingContact.id);
        setIsEditMode(true);
        navigation.setOptions({ title: 'Edit Contact' });
      }
    } else {
      navigation.setOptions({ title: 'Add New Contact' });
    }
  }, [params, trustedContacts, navigation]);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Validation Error', 'Please enter both a name and a phone number.');
      return;
    }

    if (isEditMode && contactId) {
      const updatedContact: TrustedContact = { id: contactId, name, phone };
      updateTrustedContact(updatedContact);
    } else {
      const newContact: TrustedContact = {
        id: `contact_${Date.now()}`,
        name,
        phone,
      };
      addTrustedContact(newContact);
    }

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <ThemedText style={styles.label}>Name</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter contact's name"
          placeholderTextColor={Colors.light.subtleText}
        />

        <ThemedText style={styles.label}>Phone Number</ThemedText>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor={Colors.light.subtleText}
        />

        <AppButton
          title={isEditMode ? 'Save Changes' : 'Add Contact'}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: Theme.spacing.md,
  },
  label: {
    fontSize: 16,
    marginBottom: Theme.spacing.sm,
    color: Theme.colors.subtleText,
  },
  input: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    fontSize: 16,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    color: Theme.colors.text,
  },
  saveButton: {
    marginTop: Theme.spacing.md,
  },
});
