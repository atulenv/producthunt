import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Theme } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

const SOSScreen = () => {
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  const safeZoneLocation = { latitude: 37.78, longitude: -122.45 };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isSosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      Alert.alert('Help is on the way!', 'Authorities have been notified and are en route to your location.');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSosActive, countdown]);

  const handleSosPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setIsSosActive(true);
  };

  const handleCancelPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSosActive(false);
    setCountdown(10);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.coords.latitude || 37.78825,
          longitude: userLocation?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation.coords}
            title="Your Location"
            pinColor="red"
          />
        )}
        <Marker coordinate={safeZoneLocation} title="Safe Zone" pinColor="green" />
        {userLocation && (
          <Polyline
            coordinates={[userLocation.coords, safeZoneLocation]}
            strokeColor={Theme.colors.primary}
            strokeWidth={3}
          />
        )}
      </MapView>
      <View style={styles.bottomContainer}>
        {!isSosActive ? (
          <TouchableOpacity style={styles.sosButton} onPress={handleSosPress}>
            <Ionicons name="alert-circle" size={80} color="white" />
            <Text style={styles.sosButtonText}>CALL EMERGENCY</Text>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={[Theme.colors.lightBlue, Theme.colors.white]}
            style={styles.sosActiveContainer}
          >
            <Text style={styles.sosStatusText}>Alerting Authorities...</Text>
            <Text style={styles.countdownText}>{countdown}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.sosHelpText}>Help is on the way!</Text>
          </LinearGradient>
        )}
        <View style={styles.emergencyContact}>
          <Text style={styles.emergencyContactTitle}>Emergency Contact</Text>
          <Text style={styles.emergencyContactName}>Jane Doe: 123-456-7890</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  map: {
    height: '60%',
  },
  bottomContainer: {
    flex: 1,
  },
  sosButton: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.danger,
    width: 200,
    height: 200,
    borderRadius: 100,
    ...Theme.shadows.lg,
  },
  sosButtonText: {
    color: 'white',
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    marginTop: 10,
  },
  sosActiveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sosStatusText: {
    fontSize: Theme.font.size.xl,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.danger,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 60,
    fontFamily: Theme.font.family.sansBold,
    marginVertical: 20,
    textAlign: 'center',
  },
  sosHelpText: {
    fontSize: Theme.font.size.lg,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.darkGray,
    textAlign: 'center',
    marginTop: 20,
  },
  emergencyContact: {
    backgroundColor: Theme.colors.lightGray,
    padding: 20,
    alignItems: 'center',
  },
  emergencyContactTitle: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sansBold,
    marginBottom: 5,
  },
  emergencyContactName: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
  },
  cancelButton: {
    backgroundColor: Theme.colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: Theme.radius.full,
    ...Theme.shadows.md,
  },
  cancelButtonText: {
    color: 'white',
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
  },
});

export default SOSScreen;