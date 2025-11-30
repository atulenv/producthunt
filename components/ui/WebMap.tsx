// Web-compatible map placeholder for preview
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';

type WebMapProps = {
  style?: any;
  children?: React.ReactNode;
};

const WebMap: React.FC<WebMapProps> = ({ style, children }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={64} color={Theme.colors.primary} />
        <Text style={styles.title}>Interactive Map</Text>
        <Text style={styles.subtitle}>Map view available on mobile app</Text>
        <View style={styles.badge}>
          <Ionicons name="phone-portrait" size={16} color={Theme.colors.white} />
          <Text style={styles.badgeText}>Download App for Full Experience</Text>
        </View>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F4F8',
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.font.size.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: Theme.font.size.md,
    color: Theme.colors.subtleText,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    marginTop: Theme.spacing.md,
  },
  badgeText: {
    color: Theme.colors.white,
    fontWeight: '600',
    fontSize: Theme.font.size.sm,
  },
});

export default WebMap;
