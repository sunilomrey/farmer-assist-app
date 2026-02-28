import React from 'react';
import { StyleSheet, View, Button, Alert, Platform, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function VoiceScreen() {
  const handlePlaySample = () => {
    Alert.alert('Voice', 'This would play a voice alert or open voice controls.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Voice Alerts</ThemedText>
        <ThemedText style={styles.description}>
          Here you can trigger or configure voice notifications and commands.
        </ThemedText>
        <View style={styles.buttonWrapper}>
          <Button title="Play sample" onPress={handlePlaySample} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5efe6',
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: 16,
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  buttonWrapper: {
    width: '80%',
  },
});
