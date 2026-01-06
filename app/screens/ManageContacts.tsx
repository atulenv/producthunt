
import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppStore } from '@/src/store/use-app-store';
import AppButton from '@/components/ui/AppButton';
import { Theme } from '@/constants/theme';

export default function ManageContactsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { trustedContacts, removeTrustedContact } = useAppStore();

  React.useEffect(() => {
    navigation.setOptions({ title: 'Manage Trusted Contacts' });
  }, [navigation]);

  const handleEdit = (id: string) => {
    router.push({ pathname: '/screens/EditContact', params: { contactId: id } });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTrustedContact(id),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={trustedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactRow}>
            <Ionicons name="person-circle" size={40} color={Colors.light.text} style={styles.avatar} />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactName}>{item.name}</ThemedText>
              <ThemedText style={styles.contactPhone}>{item.phone}</ThemedText>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.actionButton}>
                <Ionicons name="pencil" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                <Ionicons name="trash" size={24} color={Colors.light.emergency} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <AppButton
            title="Add New Contact"
            onPress={() => router.push('/screens/EditContact')}
            style={styles.addButton}
            icon="add"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>You haven't added any trusted contacts yet.</ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  addButton: {
    marginBottom: Theme.spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    marginRight: Theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactPhone: {
    color: Theme.colors.subtleText,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Theme.colors.subtleText,
  },
});
