import { useCallback, useEffect, useRef, useState } from "react";import { useCallback, useEffect, useRef, useState } from "react";

import {import {

  Alert,  Alert,

  Linking,  Linking,

  Platform,  Platform,

  Pressable,  Pressable,

  ScrollView,  ScrollView,

  Share,  Share,

  StyleSheet,  StyleSheet,

  Text,  Text,

  View,  View,

} from "react-native";} from "react-native";

import * as Location from "expo-location";import * as Location from "expo-location";

import { useRouter } from "expo-router";import { useRouter } from "expo-router";

import { Ionicons } from '@expo/vector-icons';import { Ionicons } from '@expo/vector-icons';



import {let MapView: any = null;

  SAFE_SPOTS,let Marker: any = null;

  SafeSpot,let Region: any = null;

} from "../src/lib/safety-data";

if (Platform.OS !== 'web') {

// Conditionally import react-native-maps only on native platforms  const maps = require("react-native-maps");

let MapView: any = null;  MapView = maps.default;

let Marker: any = null;  Marker = maps.Marker;

  Region = maps.Region;

if (Platform.OS !== 'web') {}

  try {

    const maps = require("react-native-maps");import {

    MapView = maps.default;  SAFE_SPOTS,

    Marker = maps.Marker;  SafeSpot,

  } catch (e) {} from "../src/lib/safety-data";

    console.warn("react-native-maps not available on this platform");

  }type Coordinate = { latitude: number; longitude: number };

}type RegionType = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };



const EMERGENCY_NUMBER = "112";const DEFAULT_REGION: RegionType = {

const TRUSTED_CONTACT_NUMBER = "+911234567890";  latitude: 28.6139,

  longitude: 77.209,

type Coordinate = { latitude: number; longitude: number };  latitudeDelta: 0.04,

type RegionType = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };  longitudeDelta: 0.04,

};

const DEFAULT_REGION: RegionType = {

  latitude: 28.6139,type Coordinate = { latitude: number; longitude: number };

  longitude: 77.209,

  latitudeDelta: 0.04,export default function Home() {

  longitudeDelta: 0.04,  const [coords, setCoords] = useState<Coordinate | null>(null);

};  const [fetchingLocation, setFetchingLocation] = useState(false);

  const mapRef = useRef<MapView | null>(null);

export default function Home() {  const primarySafeSpot = SAFE_SPOTS[0];

  const [coords, setCoords] = useState<Coordinate | null>(null);  const router = useRouter();

  const [fetchingLocation, setFetchingLocation] = useState(false);

  const mapRef = useRef<any>(null);  const requestLocation = useCallback(async () => {

  const primarySafeSpot = SAFE_SPOTS[0];    try {

  const router = useRouter();      setFetchingLocation(true);

      const { coords: locationCoords } = await Location.getCurrentPositionAsync({

  const requestLocation = useCallback(async () => {        accuracy: Location.Accuracy.Balanced,

    try {      });

      setFetchingLocation(true);      const latest = { latitude: locationCoords.latitude, longitude: locationCoords.longitude };

      const { coords: locationCoords } = await Location.getCurrentPositionAsync({      setCoords(latest);

        accuracy: Location.Accuracy.Balanced,      mapRef.current?.animateCamera({ center: latest, zoom: 15 }, { duration: 600 });

      });    } catch {

      const latest = { latitude: locationCoords.latitude, longitude: locationCoords.longitude };      Alert.alert("Location", "Unable to fetch your location. Please retry from a safe area.");

      setCoords(latest);    } finally {

      mapRef.current?.animateCamera?.({ center: latest, zoom: 15 }, { duration: 600 });      setFetchingLocation(false);

    } catch {    }

      Alert.alert("Location", "Unable to fetch your location. Please retry from a safe area.");  }, []);

    } finally {

      setFetchingLocation(false);  useEffect(() => {

    }    requestLocation();

  }, []);  }, [requestLocation]);



  useEffect(() => {  const composeSOS = useCallback(() => {

    requestLocation();    if (!coords) return "SOS! I need help.";

  }, [requestLocation]);    const url = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

    return `SOS! I need help. My live location: ${url}`;

  const composeSOS = useCallback(() => {  }, [coords]);

    if (!coords) return "SOS! I need help.";

    const url = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;  const callEmergency = useCallback(() => Linking.openURL(`tel:${EMERGENCY_NUMBER}`), []);

    return `SOS! I need help. My live location: ${url}`;  const notifyTrustedContact = useCallback(() => {

  }, [coords]);    Linking.openURL(`sms:${TRUSTED_CONTACT_NUMBER}?body=${encodeURIComponent(composeSOS())}`);

  }, [composeSOS]);

  const callEmergency = useCallback(() => Linking.openURL(`tel:${EMERGENCY_NUMBER}`), []);  const shareLocation = useCallback(async () => {

  const notifyTrustedContact = useCallback(() => {    const message = composeSOS();

    Linking.openURL(`sms:${TRUSTED_CONTACT_NUMBER}?body=${encodeURIComponent(composeSOS())}`);    await Share.share({ message });

  }, [composeSOS]);  }, [composeSOS]);

  const shareLocation = useCallback(async () => {

    const message = composeSOS();  const quickActions: QuickAction[] = [

    await Share.share({ message });    {

  }, [composeSOS]);      id: "sos",

      title: "SOS",

  const quickActions: QuickAction[] = [      subtitle: "Emergency Call & Alert",

    {      icon: "alert-circle",

      id: "sos",      onPress: async () => {

      title: "SOS",        callEmergency();

      subtitle: "Emergency Call & Alert",        setTimeout(() => notifyTrustedContact(), 1200);

      icon: "alert-circle",      },

      onPress: async () => {      color: "#ef4444",

        callEmergency();    },

        setTimeout(() => notifyTrustedContact(), 1200);    {

      },      id: "map",

      color: "#ef4444",      title: "Map",

    },      subtitle: "View Safe Zones & Alerts",

    {      icon: "map",

      id: "map",      onPress: () => router.push('/screens/map'),

      title: "Map",      color: "#0ea5e9",

      subtitle: "View Safe Zones & Alerts",    },

      icon: "map",    {

      onPress: () => router.push('/screens/map'),      id: "emergency",

      color: "#0ea5e9",      title: "Emergency Contacts",

    },      subtitle: "Manage & Notify",

    {      icon: "call",

      id: "emergency",      onPress: () => router.push('/screens/emergency'),

      title: "Emergency Contacts",      color: "#f97316",

      subtitle: "Manage & Notify",    },

      icon: "call",    {

      onPress: () => router.push('/screens/emergency'),      id: "help",

      color: "#f97316",      title: "Help & Resources",

    },      subtitle: "Guides & Support",

    {      icon: "help",

      id: "help",      onPress: () => router.push('/screens/help'),

      title: "Help & Resources",      color: "#34d399",

      subtitle: "Guides & Support",    },

      icon: "help",  ];

      onPress: () => router.push('/screens/help'),

      color: "#34d399",  const region: Region = coords

    },    ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }

  ];    : DEFAULT_REGION;



  const region: RegionType = coords  return (

    ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>

    : DEFAULT_REGION;      <View style={styles.header}>

        <View>

  return (          <Text style={styles.eyebrow}>Welcome</Text>

    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>          <Text style={styles.title}>Tourist Safety App</Text>

      <View style={styles.header}>        </View>

        <View>        <Pressable style={styles.refreshBadge} onPress={requestLocation}>

          <Text style={styles.eyebrow}>Welcome</Text>          <Text style={styles.refreshText}>{fetchingLocation ? "Updating…" : "Refresh"}</Text>

          <Text style={styles.title}>Tourist Safety App</Text>        </Pressable>

        </View>      </View>

        <Pressable style={styles.refreshBadge} onPress={requestLocation}>

          <Text style={styles.refreshText}>{fetchingLocation ? "Updating…" : "Refresh"}</Text>      <View style={styles.mapCard}>

        </Pressable>        <MapView

      </View>          ref={mapRef}

          style={StyleSheet.absoluteFill}

      {Platform.OS !== 'web' && MapView ? (          provider="google"

        <View style={styles.mapCard}>          showsUserLocation

          <MapView          followsUserLocation

            ref={mapRef}          initialRegion={DEFAULT_REGION}

            style={StyleSheet.absoluteFill}          region={region}

            provider="google"        >

            showsUserLocation          {coords && <Marker coordinate={coords} title="You" />}

            followsUserLocation          {SAFE_SPOTS.map((spot) => (

            initialRegion={DEFAULT_REGION}            <SafeSpotMarker key={spot.id} spot={spot} />

            region={region}          ))}

          >        </MapView>

            {coords && <Marker coordinate={coords} title="You" />}        <View style={styles.mapOverlay}>

            {SAFE_SPOTS.map((spot) => (          <Text style={styles.mapOverlayTitle}>Your Current Location</Text>

              <SafeSpotMarker key={spot.id} spot={spot} />          <Text style={styles.mapOverlaySubtitle}>

            ))}            {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Fetching..."}

          </MapView>          </Text>

          <View style={styles.mapOverlay}>        </View>

            <Text style={styles.mapOverlayTitle}>Your Current Location</Text>      </View>

            <Text style={styles.mapOverlaySubtitle}>

              {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Fetching..."}      <View style={styles.quickGrid}>

            </Text>        {quickActions.map((action) => (

          </View>          <QuickActionCard key={action.id} action={action} />

        </View>        ))}

      ) : (      </View>

        <View style={styles.mapCardPlaceholder}>    </ScrollView>

          <Text style={styles.placeholderText}>📍 Map View</Text>  );

          <Text style={styles.placeholderSubtext}>}

            {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Location: Fetching..."}

          </Text>function SafeSpotMarker({ spot }: { spot: SafeSpot }) {

        </View>  const tint = spot.type === "hospital" ? "#22d3ee" : spot.type === "embassy" ? "#a855f7" : "#34d399";

      )}  return <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} pinColor={tint} title={spot.name} />;

}

      <View style={styles.quickGrid}>

        {quickActions.map((action) => (type QuickAction = {

          <QuickActionCard key={action.id} action={action} />  id: string;

        ))}  title: string;

      </View>  subtitle: string;

    </ScrollView>  icon: keyof typeof Ionicons.glyphMap;

  );  onPress: () => void | Promise<void>;

}  color: string;

};

function SafeSpotMarker({ spot }: { spot: SafeSpot }) {

  const tint = spot.type === "hospital" ? "#22d3ee" : spot.type === "embassy" ? "#a855f7" : "#34d399";function QuickActionCard({ action }: { action: QuickAction }) {

  if (!Marker) return null;  return (

  return <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} pinColor={tint} title={spot.name} />;    <Pressable

}      onPress={action.onPress}

      style={[styles.quickAction, { borderColor: action.color + '50' }]}

type QuickAction = {    >

  id: string;      <Ionicons name={action.icon} size={30} color={action.color} />

  title: string;      <Text style={styles.quickTitle}>{action.title}</Text>

  subtitle: string;      <Text style={styles.quickSubtitle}>{action.subtitle}</Text>

  icon: keyof typeof Ionicons.glyphMap;    </Pressable>

  onPress: () => void | Promise<void>;  );

  color: string;}

};

const styles = StyleSheet.create({

function QuickActionCard({ action }: { action: QuickAction }) {  screen: { flex: 1, backgroundColor: "#060d1c" },

  return (  screenContent: { paddingBottom: 48 },

    <Pressable  header: {

      onPress={action.onPress}    paddingHorizontal: 20,

      style={[styles.quickAction, { borderColor: action.color + '50' }]}    paddingTop: 32,

    >    paddingBottom: 12,

      <Ionicons name={action.icon} size={30} color={action.color} />    flexDirection: "row",

      <Text style={styles.quickTitle}>{action.title}</Text>    alignItems: "center",

      <Text style={styles.quickSubtitle}>{action.subtitle}</Text>    justifyContent: "space-between",

    </Pressable>  },

  );  eyebrow: { color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2 },

}  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 4 },

  refreshBadge: {

const styles = StyleSheet.create({    backgroundColor: "#1f3a5f",

  screen: { flex: 1, backgroundColor: "#060d1c" },    paddingHorizontal: 14,

  screenContent: { paddingBottom: 48 },    paddingVertical: 8,

  header: {    borderRadius: 999,

    paddingHorizontal: 20,  },

    paddingTop: 32,  refreshText: { color: "#fff", fontWeight: "600" },

    paddingBottom: 12,  mapCard: {

    flexDirection: "row",    height: 260,

    alignItems: "center",    marginHorizontal: 20,

    justifyContent: "space-between",    borderRadius: 20,

  },    overflow: "hidden",

  eyebrow: { color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2 },    borderWidth: 1,

  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 4 },    borderColor: "#1f2a44",

  refreshBadge: {    marginBottom: 20,

    backgroundColor: "#1f3a5f",  },

    paddingHorizontal: 14,  mapOverlay: {

    paddingVertical: 8,    position: "absolute",

    borderRadius: 999,    left: 16,

  },    right: 16,

  refreshText: { color: "#fff", fontWeight: "600" },    bottom: 16,

  mapCard: {    backgroundColor: "rgba(6,13,28,0.85)",

    height: 260,    borderRadius: 14,

    marginHorizontal: 20,    padding: 12,

    borderRadius: 20,  },

    overflow: "hidden",  mapOverlayTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },

    borderWidth: 1,  mapOverlaySubtitle: { color: "#93c5fd", fontSize: 13, marginTop: 4 },

    borderColor: "#1f2a44",  quickGrid: {

    marginBottom: 20,    flexDirection: "row",

  },    flexWrap: "wrap",

  mapCardPlaceholder: {    justifyContent: "space-between",

    height: 260,    marginHorizontal: 20,

    marginHorizontal: 20,    gap: 12,

    borderRadius: 20,  },

    backgroundColor: "#0b1426",  quickAction: {

    borderWidth: 1,    width: "48%", // Approximately half width with gap

    borderColor: "#1f2a44",    backgroundColor: "#0b1426",

    marginBottom: 20,    borderRadius: 16,

    justifyContent: "center",    padding: 16,

    alignItems: "center",    borderWidth: 1,

  },    alignItems: "center",

  placeholderText: {    justifyContent: "center",

    fontSize: 24,  },

    marginBottom: 8,  quickTitle: { color: "#fff", fontWeight: "700", marginTop: 8, fontSize: 16 },

  },  quickSubtitle: { color: "#94a3b8", marginTop: 2, fontSize: 12, textAlign: "center" },

  placeholderSubtext: {});
    color: "#93c5fd",
    fontSize: 14,
  },
  mapOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(6,13,28,0.85)",
    borderRadius: 14,
    padding: 12,
  },
  mapOverlayTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  mapOverlaySubtitle: { color: "#93c5fd", fontSize: 13, marginTop: 4 },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    gap: 12,
  },
  quickAction: {
    width: "48%",
    backgroundColor: "#0b1426",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickTitle: { color: "#fff", fontWeight: "700", marginTop: 8, fontSize: 16 },
  quickSubtitle: { color: "#94a3b8", marginTop: 2, fontSize: 12, textAlign: "center" },
});
