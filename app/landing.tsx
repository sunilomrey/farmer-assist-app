import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import config from '@/config';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/phone-entry');
  };

  return (
    <View style={styles.container}>
      {/* Top white section */}
      <View style={styles.topSection}>
        {/* Brand header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerIcon}>🌱</ThemedText>
          <ThemedText style={styles.headerTitle}>Farmer Assist</ThemedText>
        </View>

        {/* Welcome title */}
        <View style={styles.titleContainer}>
          <ThemedText style={styles.welcomeTitle}>
            Welcome To The{' '}
            <ThemedText style={styles.highlightGreen}>Future</ThemedText>
            {'\n'}Of{' '}
            <ThemedText style={styles.highlightGreen}>Farming</ThemedText>
          </ThemedText>
          <View style={styles.titleRow}>
            <View style={styles.inlineBadge}>
              <ThemedText style={styles.inlineBadgeIcon}>🌿</ThemedText>
            </View>
          </View>
        </View>

        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>
          Empowering farmers with smart and sustainable solutions.
        </ThemedText>
      </View>

      {/* Bottom image section */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: config.app.ASSETS.IMAGES.WHEAT_HIGH }}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={300}
        />

        {/* Growth badge */}
        <View style={[styles.statBadge, styles.growthBadge]}>
          <View style={styles.statIconCircle}>
            <ThemedText style={styles.statIconText}>🌱</ThemedText>
          </View>
          <ThemedText style={styles.statLabel}>Growth: 14 cm</ThemedText>
        </View>

        {/* Central circular highlight */}
        <View style={styles.circleHighlight} />

        {/* Moisture badge */}
        <View style={[styles.statBadge, styles.moistureBadge]}>
          <View style={styles.statIconCircleDark}>
            <ThemedText style={styles.statIconText}>💧</ThemedText>
          </View>
          <ThemedText style={styles.statLabel}>Moisture: 78%</ThemedText>
        </View>

        {/* Get Started button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#A0763A',
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -6,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#222',
    lineHeight: 42,
  },
  highlightGreen: {
    color: '#2d5016',
    fontWeight: '800',
  },
  inlineBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineBadgeIcon: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    lineHeight: 22,
  },
  imageSection: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  statBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 28,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  growthBadge: {
    top: 40,
    left: 16,
    zIndex: 10,
  },
  moistureBadge: {
    bottom: 110,
    right: 16,
    zIndex: 10,
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#4a7c2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconCircleDark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  circleHighlight: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  getStartedButton: {
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  getStartedText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
});
