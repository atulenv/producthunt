import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Permissions" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/PlanTrip"
          options={{
            headerShown: true,
            headerTitle: 'Plan a New Trip',
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: {
              fontFamily: Theme.font.family.sansBold,
              color: Theme.colors.text,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="screens/SOSScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/ReportIncident"
          options={{
            headerShown: true,
            headerTitle: 'Report an Incident',
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: {
              fontFamily: Theme.font.family.sansBold,
              color: Theme.colors.text,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="screens/TravelRoutes"
          options={{
            headerShown: true,
            headerTitle: 'Safer routes',
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: {
              fontFamily: Theme.font.family.sansBold,
              color: Theme.colors.text,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="screens/Reports"
          options={{
            headerShown: true,
            headerTitle: 'Live reports',
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: {
              fontFamily: Theme.font.family.sansBold,
              color: Theme.colors.text,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="screens/Trips"
          options={{
            headerShown: true,
            headerTitle: 'Trips cockpit',
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: {
              fontFamily: Theme.font.family.sansBold,
              color: Theme.colors.text,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
