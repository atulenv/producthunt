import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import { Theme } from '@/constants/theme';

type MarkerConfig = {
  id: string;
  coordinate: { latitude: number; longitude: number };
  label?: string;
};

type CircleConfig = {
  id: string;
  center: { latitude: number; longitude: number };
  radius: number;
  strokeColor?: string;
  fillColor?: string;
};

type Props = {
  region: Region;
  markers?: MarkerConfig[];
  circles?: CircleConfig[];
  height?: number;
};

const MapPreview: React.FC<Props> = ({ region, markers = [], circles = [], height = 220 }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webFallback, { height }]}>
        <Text style={styles.webTitle}>Map preview</Text>
        <Text style={styles.webSubtitle}>Open the app on mobile for a live interactive map.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.nativeWrapper, { height }]}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region} pointerEvents="none">
        {circles.map((circle) => (
          <Circle
            key={circle.id}
            center={circle.center}
            radius={circle.radius}
            strokeColor={circle.strokeColor || Theme.colors.primary}
            fillColor={circle.fillColor || 'rgba(0,191,165,0.12)'}
          />
        ))}
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.label} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeWrapper: {
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
  webFallback: {
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.darkGray,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: Theme.spacing.lg,
  },
  webTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.lg,
  },
  webSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.white,
    marginTop: Theme.spacing.sm,
    maxWidth: 280,
  },
});

export default MapPreview;
