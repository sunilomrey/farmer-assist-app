import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f5e6d3', dark: '#1a3d0a' }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>🌾 EcoFarm</ThemedText>
        </View>
      }>
      {/* Welcome Section with Welcome Text */}
      <ThemedView style={styles.welcomeSection}>
        <ThemedText style={styles.welcomeTitle}>Welcome To The Future Of Farming</ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>Empowering farmers with smart and sustainable solutions.</ThemedText>
        <TouchableOpacity style={styles.getStartedButton}>
          <ThemedText style={styles.getStartedText}>Get Started</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Dashboard Greeting */}
      <ThemedView style={styles.dashboardContainer}>
        <View style={styles.greetingHeader}>
          <ThemedText type="title" style={styles.greetingText}>Hello, Harris</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.notificationBell}>🔔</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <ThemedText style={styles.location}>📍 Central Valley</ThemedText>

        {/* Weather Card */}
        <ThemedView style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <ThemedText style={styles.temperature}>32°</ThemedText>
            <ThemedText style={styles.weatherLocation}>Sonoma County</ThemedText>
          </View>
          <View style={styles.weatherRight}>
            <ThemedText style={styles.weatherIcon}>🌤️</ThemedText>
          </View>
        </ThemedView>

        {/* Weather Stats */}
        <View style={styles.weatherStatsContainer}>
          <WeatherStat icon="🌡️" label="Soil temp" value="+23 C" />
          <WeatherStat icon="💧" label="Humidity" value="78%" />
          <WeatherStat icon="💨" label="Wind" value="7 m/s" />
          <WeatherStat icon="📍" label="Perception" value="0 mm" />
        </View>

        {/* Commodities Section */}
        <ThemedView style={styles.commoditiesSection}>
          <ThemedText style={styles.sectionTitle}>Commodities & Food</ThemedText>
          <View style={styles.commoditiesGrid}>
            <CommodityItem emoji="🌾" label="Rice" />
            <CommodityItem emoji="🌽" label="Corn" />
            <CommodityItem emoji="🍇" label="Grapes" />
            <CommodityItem emoji="🥔" label="Potato" />
            <CommodityItem emoji="🫒" label="Olive" />
          </View>
        </ThemedView>

        {/* My Fields */}
        <ThemedView style={styles.fieldsSection}>
          <ThemedText style={styles.fieldName}>My Fields</ThemedText>
          <View style={styles.fieldLocation}>
            <ThemedText style={styles.fieldLocationText}>📍 Central Valley</ThemedText>
            <ThemedText style={styles.fieldYield}>🌾 7200 kg/ha</ThemedText>
          </View>
          <View style={styles.fieldImage}>
            <ThemedText style={styles.fieldImageText}>🌾</ThemedText>
          </View>
        </ThemedView>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton}>
            <ThemedText style={styles.navButtonText}>🏠</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <ThemedText style={styles.navButtonText}>✈️</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <ThemedText style={styles.navButtonText}>👤</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Planted Area & Tasks Section */}
      <ThemedView style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <ThemedText type="subtitle" style={styles.plantedAreaTitle}>Planted Area</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.moreButton}>⋮</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.plantedAreaStats}>
          <ThemedText style={styles.areaStat}>120l/ha</ThemedText>
          <ThemedText style={styles.areaSubtext}>Water usage</ThemedText>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartContainer}>
          <View style={styles.chartBar} />
        </View>

        {/* Farmer's Tasks */}
        <ThemedView style={styles.farmerTasks}>
          <View style={styles.tasksButtonsRow}>
            <TouchableOpacity style={styles.taskButton} onPress={() => {}}>
              <ThemedText style={styles.taskButtonText}>Today Task</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskButtonInactive}>
              <ThemedText style={styles.taskButtonTextInactive}>Team</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskButtonInactive}>
              <ThemedText style={styles.taskButtonTextInactive}>Programs</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Task Items */}
          <TaskItem 
            icon="🧑‍🌾"
            title="Morning Field Inspection" 
            description="Assess crop health, identify issues."
            image="🌾"
            deadline="Today, 10 AM"
            priority="High Priority"
          />
          <TaskItem 
            icon="🧑‍🌾"
            title="Soil Moisture Monitoring" 
            description="Monitor plant water..."
            image="🌱"
            deadline="Today"
            priority=""
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

interface WeatherStatProps {
  icon: string;
  label: string;
  value: string;
}

function WeatherStat({ icon, label, value }: WeatherStatProps) {
  return (
    <View style={styles.weatherStat}>
      <ThemedText style={styles.weatherStatIcon}>{icon}</ThemedText>
      <ThemedText style={styles.weatherStatLabel}>{label}</ThemedText>
      <ThemedText style={styles.weatherStatValue}>{value}</ThemedText>
    </View>
  );
}

interface CommodityItemProps {
  emoji: string;
  label: string;
}

function CommodityItem({ emoji, label }: CommodityItemProps) {
  return (
    <View style={styles.commodityItem}>
      <ThemedText style={styles.commodityEmoji}>{emoji}</ThemedText>
      <ThemedText style={styles.commodityLabel}>{label}</ThemedText>
    </View>
  );
}

interface TaskItemProps {
  icon: string;
  title: string;
  description: string;
  image: string;
  deadline: string;
  priority?: string;
}

function TaskItem({ icon, title, description, image, deadline, priority }: TaskItemProps) {
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <View style={styles.taskIcon}>
          <ThemedText style={styles.taskIconText}>{icon}</ThemedText>
        </View>
        <View style={styles.taskInfo}>
          <ThemedText style={styles.taskTitle}>{title}</ThemedText>
          <ThemedText style={styles.taskDescription}>{description}</ThemedText>
        </View>
      </View>
      <View style={styles.taskImageArea}>
        <ThemedText style={styles.taskImage}>{image}</ThemedText>
      </View>
      <View style={styles.taskFooter}>
        <View>
          <ThemedText style={styles.taskDeadlineLabel}>Important Deadline</ThemedText>
          <ThemedText style={styles.taskDeadline}>{deadline}</ThemedText>
        </View>
        {priority && (
          <ThemedText style={styles.taskPriority}>{priority}</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#f5e6d3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B6F47',
  },
  welcomeSection: {
    backgroundColor: '#f9f4f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 0,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2d5016',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#f5e6d3',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 6,
  },
  getStartedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6F47',
  },
  dashboardContainer: {
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationBell: {
    fontSize: 20,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  weatherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  weatherLeft: {
    flex: 1,
  },
  weatherRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  weatherIcon: {
    fontSize: 36,
  },
  weatherStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 6,
  },
  weatherStat: {
    flex: 1,
    backgroundColor: '#fff9f5',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  weatherStatIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  weatherStatLabel: {
    fontSize: 9,
    color: '#999',
    marginBottom: 2,
  },
  weatherStatValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  commoditiesSection: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  commoditiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  commodityItem: {
    flex: 1,
    minWidth: '18%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  commodityEmoji: {
    fontSize: 22,
    marginBottom: 3,
  },
  commodityLabel: {
    fontSize: 9,
    color: '#666',
  },
  fieldsSection: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  fieldName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  fieldLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLocationText: {
    fontSize: 11,
    color: '#666',
  },
  fieldYield: {
    fontSize: 11,
    color: '#666',
  },
  fieldImage: {
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldImageText: {
    fontSize: 36,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  tasksContainer: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  plantedAreaTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  moreButton: {
    fontSize: 18,
    color: '#999',
  },
  plantedAreaStats: {
    marginBottom: 12,
  },
  areaStat: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  areaSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  chartContainer: {
    height: 100,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    justifyContent: 'flex-end',
  },
  chartBar: {
    height: 50,
    backgroundColor: '#90EE90',
    borderRadius: 3,
    marginRight: 6,
  },
  farmerTasks: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  tasksButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  taskButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#000',
    borderRadius: 18,
  },
  taskButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  taskButtonInactive: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
  },
  taskButtonTextInactive: {
    fontSize: 11,
    color: '#999',
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskIconText: {
    fontSize: 18,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 11,
    color: '#999',
  },
  taskImageArea: {
    height: 80,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskImage: {
    fontSize: 40,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDeadlineLabel: {
    fontSize: 10,
    color: '#999',
  },
  taskDeadline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginTop: 1,
  },
  taskPriority: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2d5016',
  },
});
