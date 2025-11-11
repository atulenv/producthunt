import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="screens/map"
        options={{
          title: 'Map',
        }}
      />
      <Tabs.Screen
        name="screens/emergency"
        options={{
          title: 'Emergency',
        }}
      />
      <Tabs.Screen
        name="screens/help"
        options={{
          title: 'Help',
        }}
      />
    </Tabs>
  );
}