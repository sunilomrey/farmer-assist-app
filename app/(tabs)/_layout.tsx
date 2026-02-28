import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#8B6F47',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <IconSymbol size={22} name="house.fill" color={focused ? '#fff' : '#333'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Mic',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconLarge, focused && styles.tabIconLargeActive]}>
              <IconSymbol size={32} name="mic.fill" color={focused ? '#fff' : '#333'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <IconSymbol size={22} name="person.fill" color={focused ? '#fff' : '#333'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: '15%',
    right: '15%',
    height: 72,
    borderRadius: 36,
    backgroundColor: '#C8A96E',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5efe6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C8A96E',
  },
  tabIconActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  tabIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5efe6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#C8A96E',
    marginTop: -12,
  },
  tabIconLargeActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
});
