import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LandingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/phone-entry');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerIcon}>🌾</ThemedText>
        <ThemedText style={styles.headerTitle}>EcoFarm</ThemedText>
      </View>

      {/* Welcome Title */}
      <View style={styles.welcomeTitleContainer}>
        <ThemedText style={styles.welcomeTitle}>
          Welcome To The <ThemedText style={styles.highlightGreen}>Future</ThemedText> Of <ThemedText style={styles.highlightGreen}>Farming</ThemedText>
        </ThemedText>
      </View>

      {/* Subtitle */}
      <ThemedText style={styles.subtitle}>
        Empowering farmers with smart and sustainable solutions.
      </ThemedText>

      {/* Background Image Section */}
      <View style={styles.imageContainer}>
        <View style={styles.fieldImage}>
          <ThemedText style={styles.fieldEmoji}>🌾</ThemedText>
        </View>

        {/* Stats Overlays */}
        <View style={styles.statOverlay1}>
          <View style={styles.statBadge}>
            <ThemedText style={styles.statIcon}>🌱</ThemedText>
            <ThemedText style={styles.statText}>Growth: 14 cm</ThemedText>
          </View>
        </View>

        <View style={styles.statOverlay2}>
          <View style={styles.statBadge}>
            <ThemedText style={styles.statIcon}>💧</ThemedText>
            <ThemedText style={styles.statText}>Moisture: 78%</ThemedText>
          </View>
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.getStartedButton}
        onPress={handleGetStarted}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B6F47',
  },
  welcomeTitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 36,
  },
  highlightGreen: {
    color: '#2d5016',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 24,
    lineHeight: 20,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 280,
    position: 'relative',
  },
  fieldImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD580',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  fieldEmoji: {
    fontSize: 80,
    opacity: 0.8,
  },
  statOverlay1: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  statOverlay2: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: rgba(0, 0, 0, 0.6),
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  getStartedButton: {
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#8B6F47',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
