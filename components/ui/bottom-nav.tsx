import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';

export default function BottomNav() {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
          <Text style={styles.icon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
          <Text style={styles.icon}>🔍</Text>
        </TouchableOpacity>

        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity style={styles.centerButton} activeOpacity={0.9}>
            <Text style={styles.centerIcon}>🔊</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
          <Text style={styles.icon}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BOTTOM_HEIGHT = Platform.OS === 'ios' ? 88 : 72;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  container: {
    height: 64,
    marginHorizontal: 20,
    backgroundColor: '#050505',
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '92%',
  },
  iconButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6BDA4B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#0b0b0b',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIcon: {
    fontSize: 26,
    color: '#fff',
  },
});
