import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import config from '@/config';
import { useWeather } from '@/hooks/useWeather';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;

const COMMODITIES = [
  { emoji: '🌾', label: 'Rice' },
  { emoji: '🌽', label: 'Corn' },
  { emoji: '🍇', label: 'Grapes' },
  { emoji: '🥔', label: 'Potato' },
  { emoji: '🫒', label: 'Olive' },
  { emoji: '🍅', label: 'Tomato' },
];

interface ForecastDay {
  date: string;
  maxTemp: string;
  minTemp: string;
  weatherCode: number;
}

interface WeatherData {
  locationName: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  precipitation: string;
  forecast: ForecastDay[];
}

export default function HomeScreen() {
  const { weather, loading, error } = useWeather();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <ThemedText style={styles.hello}>
              Hello, <ThemedText style={styles.helloName}>Suneel</ThemedText>
            </ThemedText>
            <ThemedText style={styles.location}>📍 {weather?.locationName || 'Detecting Location...'}</ThemedText>
          </View>
          <View style={styles.bellCircle}>
            <ThemedText style={styles.bellIcon}>🔔</ThemedText>
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#8B6F47" />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : (
            <>
              <View style={styles.weatherMain}>
                <ThemedText style={styles.temperature}>{weather?.temperature || '--°'}</ThemedText>
                <ThemedText style={styles.weatherEmoji}>🌦️</ThemedText>
              </View>
              <ThemedText style={styles.county}>{weather?.locationName || '---'}</ThemedText>

              {/* Weather image decoration */}
              <View style={styles.wheatDecoration}>
                <ThemedText style={styles.wheatEmoji}>🌾🌾�</ThemedText>
              </View>
            </>
          )}
        </View>

        {/* Weather Stats Grid */}
        <View style={styles.statsGrid}>
          <WeatherStatCard icon="🌡️" label="Outside temp" value={weather?.temperature || '--°'} />
          <WeatherStatCard icon="💧" label="Humidity" value={weather?.humidity || '--%'} />
          <WeatherStatCard icon="💨" label="Wind" value={weather?.windSpeed || '-- m/s'} />
          <WeatherStatCard icon="🌧️" label="Precipitation" value={weather?.precipitation || '-- mm'} />
        </View>

        {/* 7-Day Forecast Section */}
        <ThemedView style={styles.forecastSection}>
          <ThemedText style={styles.sectionTitle}>7-Day Forecast</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastScroll}
          >
            {weather?.forecast?.map((day, index) => (
              <View key={day.date} style={styles.forecastItem}>
                <ThemedText style={styles.forecastDay}>
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </ThemedText>
                <ThemedText style={styles.forecastIcon}>
                  {getWeatherIcon(day.weatherCode)}
                </ThemedText>
                <ThemedText style={styles.forecastTemp}>{day.maxTemp}</ThemedText>
                <ThemedText style={styles.forecastMinTemp}>{day.minTemp}</ThemedText>
              </View>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Commodities & Food */}
        <ThemedText style={styles.sectionTitle}>Commodities & Food</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.commoditiesRow}
        >
          {COMMODITIES.map((item) => (
            <View key={item.label} style={styles.commodityItem}>
              <View style={styles.commodityCircle}>
                <ThemedText style={styles.commodityEmoji}>{item.emoji}</ThemedText>
              </View>
              <ThemedText style={styles.commodityLabel}>{item.label}</ThemedText>
            </View>
          ))}
        </ScrollView>

        {/* My Fields */}
        <View style={styles.fieldsCard}>
          <View style={styles.fieldsHeader}>
            <View style={styles.fieldsHeaderLeft}>
              <View style={styles.fieldsIconCircle}>
                <ThemedText style={styles.fieldsIconText}>🌾</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.fieldsTitle}>My Fields</ThemedText>
                <ThemedText style={styles.fieldsLocation}>📍 {weather?.locationName || '...'}</ThemedText>
              </View>
            </View>
            <View style={styles.yieldBadge}>
              <ThemedText style={styles.yieldIcon}>🌱</ThemedText>
              <ThemedText style={styles.yieldText}>7200 kg/ha</ThemedText>
            </View>
          </View>

          {/* Field Image */}
          <View style={styles.fieldImageWrapper}>
            <Image
              source={{ uri: config.app.ASSETS.IMAGES.WHEAT }}
              style={styles.fieldImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function getWeatherIcon(code: number) {
  if (code === 0) return '☀️'; // Clear sky
  if (code <= 3) return '🌤️'; // Mainly clear, partly cloudy, and overcast
  if (code <= 48) return '🌫️'; // Fog
  if (code <= 67) return '🌧️'; // Drizzle, Rain
  if (code <= 77) return '❄️'; // Snow
  if (code <= 82) return '🌧️'; // Rain showers
  if (code <= 99) return '⛈️'; // Thunderstorm
  return '☀️';
}

function WeatherStatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconCircle}>
        <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      </View>
      <View>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5efe6',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 110,
  },
  // Greeting
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingLeft: {
    flex: 1,
  },
  hello: {
    fontSize: 26,
    color: '#555',
    fontWeight: '400',
  },
  helloName: {
    fontWeight: '800',
    color: '#222',
  },
  location: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  bellCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e0d4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 20,
  },
  // Weather
  weatherCard: {
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 120,
    justifyContent: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  temperature: {
    fontSize: 52,
    fontWeight: '700',
    color: '#333',
  },
  weatherEmoji: {
    fontSize: 36,
    marginTop: 8,
  },
  county: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  wheatDecoration: {
    position: 'absolute',
    right: -10,
    top: -10,
    opacity: 0.3,
  },
  wheatEmoji: {
    fontSize: 60,
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9f0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
    width: (width - CARD_PADDING * 2 - 10) / 2,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0e6d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 1,
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  // Forecast Section
  forecastSection: {
    marginBottom: 24,
    paddingHorizontal: 16,       // add side padding for section
    paddingVertical: 8,          // add vertical breathing room
  },
  forecastScroll: {
    gap: 12,
    paddingHorizontal: 8,        // ensure content isn't flush to edges when scrolling
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: '#fff9f0',
    padding: 16,                 // increase padding for better touch targets
    borderRadius: 16,
    minWidth: 80,                // slightly wider cards for readability
    marginHorizontal: 4,         // tiny gap between items in addition to gap
  },
  forecastDay: {
    fontSize: 10,
    color: '#999',
    marginBottom: 6,             // give more space below the day label
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  forecastMinTemp: {
    fontSize: 10,
    color: '#aaa',
  },
  // Commodities
  commoditiesRow: {
    gap: 16,
    paddingBottom: 20,
    paddingRight: 16,
  },
  commodityItem: {
    alignItems: 'center',
    gap: 6,
  },
  commodityCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0ead8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commodityEmoji: {
    fontSize: 28,
  },
  commodityLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  // Fields
  fieldsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fieldsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  fieldsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldsIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f0ead8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsIconText: {
    fontSize: 22,
  },
  fieldsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  fieldsLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  yieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5efe6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  yieldIcon: {
    fontSize: 14,
  },
  yieldText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B6F47',
  },
  fieldImageWrapper: {
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    textAlign: 'center',
  },
});
