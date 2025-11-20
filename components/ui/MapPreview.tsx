import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Region } from 'react-native-maps';
import { Theme } from '@/constants/theme';

type NativeMapModule = typeof import('react-native-maps');

type NativeMapComponents = {
  MapView: NativeMapModule['default'];
  Circle: NativeMapModule['Circle'];
  Marker: NativeMapModule['Marker'];
};

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
  const [nativeMaps, setNativeMaps] = useState<NativeMapComponents | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (Platform.OS !== 'web') {
      import('react-native-maps')
        .then((module) => {
          if (isMounted) {
            setNativeMaps({
              MapView: module.default,
              Circle: module.Circle,
              Marker: module.Marker,
            });
          }
        })
        .catch((error) => {
          console.warn('Failed to load native map module', error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (Platform.OS === 'web' || !nativeMaps) {
    return (
      <View style={[styles.webFallback, { height }]}>
        <Text style={styles.webTitle}>Map preview</Text>
        <Text style={styles.webSubtitle}>Open the app on mobile for a live interactive map.</Text>
      </View>
    );
  }

  const { MapView, Circle, Marker } = nativeMaps;

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
