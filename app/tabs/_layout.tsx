// Enhanced Tab Layout with safety-focused design
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../../src/store/use-app-store';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { sosActive } = useAppStore();

  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['rgba(248, 250, 252, 0)', 'rgba(248, 250, 252, 0.95)', '#F8FAFC']}
        style={styles.tabBarGradient}
      />
      <View style={styles.tabBarInner}>
        <View style={styles.tabBarRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const isEmergency = route.name === 'emergency';
            const label =
              options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                ? options.title
                : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // Special styling for SOS tab
            if (isEmergency) {
              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.sosTab}
                  activeOpacity={0.8}
                >
                  <View style={[styles.sosTabInner, sosActive && styles.sosTabActive]}>
                    <Ionicons
                      name={sosActive ? 'close-circle' : 'alert-circle'}
                      size={28}
                      color={Theme.colors.white}
                    />
                  </View>
                  <Text style={[styles.sosLabel, sosActive && styles.sosLabelActive]}>
                    {sosActive ? 'ACTIVE' : 'SOS'}
                  </Text>
                </TouchableOpacity>
              );
            }

            const color = isFocused ? Theme.colors.primary : Theme.colors.subtleText;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                activeOpacity={0.7}
              >
                {options.tabBarIcon ? options.tabBarIcon({ color, size: 24, focused: isFocused }) : null}
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="risk"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarGradient: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: TAB_BAR_OVERLAY_HEIGHT + 20,
  },
  tabBarInner: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.xl,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    ...Theme.shadows.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.lg,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(30, 64, 175, 0.08)',
  },
  tabLabel: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  sosTab: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  sosTabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.emergency,
  },
  sosTabActive: {
    backgroundColor: Theme.colors.emergencyDark,
  },
  sosLabel: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.emergency,
    fontWeight: '700',
    marginTop: 4,
  },
  sosLabelActive: {
    color: Theme.colors.emergencyDark,
  },
});
