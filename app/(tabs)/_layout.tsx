import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherProvider } from '@/hooks/useWeather';
import CustomTabBar from '@/components/ui/CustomTabBar';

export default function TabLayout() {
  return (
    <WeatherProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name="house.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="crops"
          options={{
            title: 'Crops',
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name="leaf.fill" color={color} />
            ),
          }}
        />

        {/* Voice tab - structurally center */}
        <Tabs.Screen
          name="voice"
          options={{
            title: 'Voice',
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name="speaker.wave.2.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </WeatherProvider>
  );
}

const styles = StyleSheet.create({});
