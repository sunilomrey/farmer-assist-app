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
              <IconSymbol size={focused ? 28 : 22} name="house.fill" color={focused ? '#fff' : '#333'} />
            </View>
          ),
        }}
      />

      {/* Voice tab - center focus */}
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Voice',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconVoice, focused && styles.tabIconVoiceActive]}>
              <IconSymbol size={focused ? 40 : 32} name="speaker.wave.2.fill" color={focused ? '#fff' : '#333'} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="crops"
        options={{
          title: 'Crops',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <IconSymbol size={focused ? 28 : 22} name="leaf.fill" color={focused ? '#fff' : '#333'} />
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
              <IconSymbol size={focused ? 28 : 22} name="person.fill" color={focused ? '#fff' : '#333'} />
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#C8A96E',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // respect safe area
    flexDirection: 'row',              // ensure icons laid out horizontally
    justifyContent: 'space-around',    // space icons evenly according to industry norms
    alignItems: 'center',
    paddingHorizontal: 20,             // extra breathing room inside bar
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
    marginHorizontal: 8,            // added spacing between tabs
  },
  tabIconVoice: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5efe6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#C8A96E',
    marginTop: -24,                 // raise above bar for emphasis
  },
  tabIconVoiceActive: {
    width: 100,                       // grow from 80 to 100
    height: 100,                      // grow from 80 to 100
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  tabIconActive: {
    width: 60,                        // grow from 50 to 60
    height: 60,                       // grow from 50 to 60
    backgroundColor: '#fff',            // white center
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
