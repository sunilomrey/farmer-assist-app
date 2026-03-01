import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { CropPredictionService } from '@/services/crop-prediction-client';

const BACKEND_URL = 'http://localhost:3000/api/v1'; // Change for production

export default function CropPredictionScreen() {
  const [cropType, setCropType] = useState('wheat');
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('Detecting Location...');
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('single'); // single, compare, recommend

  const cropService = new CropPredictionService(BACKEND_URL);
  const commonCrops = ['wheat', 'rice', 'cotton', 'corn', 'potato', 'tomato', 'onion'];
  const compareCrops = ['wheat', 'rice', 'cotton'];
  const recommendCrops = ['wheat', 'rice', 'corn', 'potato', 'cotton', 'sugarcane'];

  // Get user location on mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let coords;
      
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        coords = loc.coords;
        setLocation(coords);
        console.log('📍 Location detected:', coords);
      } else {
        // Default to Bengaluru if permission denied
        coords = { latitude: 12.9716, longitude: 77.5946 };
        setLocation(coords);
        console.log('📍 Location permission denied, using default');
      }

      // Fetch weather data from backend to get location name and temperature
      try {
        console.log('🌤️ Fetching weather data from:', `${BACKEND_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}`);
        const response = await fetch(
          `${BACKEND_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}`
        );
        
        console.log('📥 Weather API response status:', response.status);
        
        if (response.ok) {
          const weatherData = await response.json();
          console.log('✅ Full Weather data:', JSON.stringify(weatherData, null, 2));
          console.log('📍 Location name:', weatherData.locationName);
          console.log('🌡️ Temperature:', weatherData.temperature);
          console.log('💧 Humidity:', weatherData.humidity);
          
          if (weatherData.locationName) {
            setLocationName(weatherData.locationName);
            console.log('✅ Location name set to:', weatherData.locationName);
          } else {
            console.warn('⚠️ locationName not found in response');
            // Try to construct from address if available
            if (weatherData.address) {
              const city = weatherData.address.city || weatherData.address.town || weatherData.address.village || 'Current Location';
              setLocationName(city);
            } else {
              setLocationName('Current Location');
            }
          }
          
          setTemperature(weatherData.temperature);
          setHumidity(weatherData.humidity);
        } else {
          const errorText = await response.text();
          console.error('❌ Weather API error response:', errorText);
          setLocationName('Current Location');
        }
      } catch (weatherErr) {
        console.error('❌ Failed to fetch weather data:', weatherErr);
        console.error('Error details:', weatherErr.message);
        setLocationName('Current Location');
      }
    } catch (err) {
      console.error('Location error:', err);
      // Default fallback
      setLocation({ latitude: 12.9716, longitude: 77.5946 });
      setLocationName('Bengaluru, India');
    }
  };

  const handleAnalyzeCrop = async () => {
    console.log('🔵 handleAnalyzeCrop called');
    console.log('Location:', location);
    console.log('Crop type:', cropType);
    console.log('Backend URL:', BACKEND_URL);

    if (!location) {
      console.log('❌ No location available');
      Alert.alert('Error', 'Could not get location');
      return;
    }

    console.log('📍 Starting crop analysis...');
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('🚀 Calling cropService.analyzeCrop');
      const result = await cropService.analyzeCrop(
        cropType,
        location.latitude,
        location.longitude,
        'Your Location'
      );
      console.log('✅ Got result:', result);
      
      // Update location name from API response
      if (result.location) {
        setLocationName(result.location);
        console.log('📍 Location updated to:', result.location);
      }
      
      setPrediction(result.data);
    } catch (err) {
      console.error('❌ Error in handleAnalyzeCrop:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError(err.message);
      Alert.alert('Error', `Failed to analyze crop: ${err.message}`);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleCompareCrops = async () => {
    console.log('🔵 handleCompareCrops called');
    console.log('Location:', location);
    
    if (!location) {
      console.log('❌ No location available');
      Alert.alert('Error', 'Could not get location');
      return;
    }

    console.log('📍 Starting crop comparison...');
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('🚀 Calling cropService.compareCrops');
      const result = await cropService.compareCrops(
        compareCrops,
        location.latitude,
        location.longitude,
        'Your Location'
      );
      console.log('✅ Got comparison result:', result);
      
      // Update location name from API response
      if (result.location) {
        setLocationName(result.location);
        console.log('📍 Location updated to:', result.location);
      }
      
      setPrediction({
        comparison: true,
        location: result.location || 'Unknown',
        predictions: result.data ? result.data.predictions : result.predictions || []
      });
    } catch (err) {
      console.error('❌ Error in handleCompareCrops:', err);
      setError(err.message);
      Alert.alert('Error', `Failed to compare crops: ${err.message}`);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleGetRecommendation = async () => {
    console.log('🔵 handleGetRecommendation called');
    console.log('Location:', location);
    
    if (!location) {
      console.log('❌ No location available');
      Alert.alert('Error', 'Could not get location');
      return;
    }

    console.log('📍 Starting crop recommendation...');
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('🚀 Calling cropService.getRecommendedCrop');
      const result = await cropService.getRecommendedCrop(
        recommendCrops,
        location.latitude,
        location.longitude,
        'Your Location'
      );
      console.log('✅ Got recommendation result:', result);
      
      // Update location name from API response
      if (result.location) {
        setLocationName(result.location);
        console.log('📍 Location updated to:', result.location);
      }
      
      setPrediction({
        recommendation: true,
        location: result.location || 'Unknown',
        bestCrop: result.data ? result.data.bestCrop : result.recommendation?.bestCrop,
        allCrops: result.data ? result.data.allAnalyses : result.recommendation?.allAnalyses || []
      });
    } catch (err) {
      console.error('❌ Error in handleGetRecommendation:', err);
      setError(err.message);
      Alert.alert('Error', `Failed to get recommendation: ${err.message}`);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌾 Crop Prediction</Text>
        <Text style={styles.subtitle}>AI-powered crop analysis powered by AWS Bedrock</Text>
      </View>

      {/* Location Info */}
      <View style={styles.locationCard}>
        <Text style={styles.locationTitle}>📍 Your Location</Text>
        <Text style={styles.locationName}>{locationName}</Text>
        <View style={styles.weatherRow}>
          {temperature && (
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>🌡️</Text>
              <Text style={styles.weatherValue}>{temperature}</Text>
            </View>
          )}
          {humidity && (
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>💧</Text>
              <Text style={styles.weatherValue}>{humidity}</Text>
            </View>
          )}
        </View>
        {location && (
          <Text style={styles.locationCoords}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TabButton
          label="Single Crop"
          active={selectedTab === 'single'}
          onPress={() => {
            setSelectedTab('single');
            setPrediction(null);
          }}
        />
        <TabButton
          label="Compare"
          active={selectedTab === 'compare'}
          onPress={() => {
            setSelectedTab('compare');
            setPrediction(null);
          }}
        />
        <TabButton
          label="Recommend"
          active={selectedTab === 'recommend'}
          onPress={() => {
            setSelectedTab('recommend');
            setPrediction(null);
          }}
        />
      </View>

      {/* Single Crop Tab */}
      {selectedTab === 'single' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Crop</Text>
          <View style={styles.cropGrid}>
            {commonCrops.map(crop => (
              <TouchableOpacity
                key={crop}
                style={[
                  styles.cropButton,
                  cropType === crop && styles.cropButtonActive
                ]}
                onPress={() => setCropType(crop)}
              >
                <Text style={[
                  styles.cropButtonText,
                  cropType === crop && styles.cropButtonTextActive
                ]}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeCrop}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze {cropType}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Compare Tab */}
      {selectedTab === 'compare' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comparing 3 Crops</Text>
          <View style={styles.compareInfo}>
            <Text style={styles.compareText}>
              Wheat • Rice • Cotton
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleCompareCrops}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>Compare Crops</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Recommend Tab */}
      {selectedTab === 'recommend' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Crop for You</Text>
          <View style={styles.recommendInfo}>
            <Text style={styles.recommendText}>
              Analysis {recommendCrops.length} crops
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleGetRecommendation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>Get My Recommendation</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {prediction && (
        <View style={styles.resultsSection}>
          {/* Location Header */}
          <View style={styles.resultLocationCard}>
            <Text style={styles.resultLocationTitle}>📍 Analysis for</Text>
            <Text style={styles.resultLocationName}>{locationName}</Text>
          </View>

          <Text style={styles.sectionTitle}>Results</Text>
          
          {/* Single Crop Result */}
          {!prediction.comparison && !prediction.recommendation && (
            <SingleCropResult prediction={prediction} />
          )}

          {/* Compare Result */}
          {prediction.comparison && (
            <CompareResult predictions={prediction.predictions} />
          )}

          {/* Recommend Result */}
          {prediction.recommendation && (
            <RecommendResult bestCrop={prediction.bestCrop} allCrops={prediction.allCrops} />
          )}
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Loading Message */}
      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={styles.loadingText}>Analyzing crops with AI...</Text>
          <Text style={styles.loadingSubtext}>This takes 5-10 seconds</Text>
        </View>
      )}

      {/* Instructions */}
      {!prediction && !loading && (
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>⚙️ Setup Required</Text>
          <Text style={styles.instructionText}>
            1. Start backend: npm run dev{'\n'}
            2. Configure AWS credentials in .env{'\n'}
            3. Update BACKEND_URL in this file{'\n'}
            4. Press "Analyze" button
          </Text>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// Single Crop Result Component
function SingleCropResult({ prediction }) {
  // Add detailed logging
  console.log('SingleCropResult received:', JSON.stringify(prediction, null, 2));

  if (!prediction) {
    return (
      <View style={styles.resultCard}>
        <Text style={styles.errorText}>No prediction data received</Text>
      </View>
    );
  }

  if (!prediction.analysis) {
    return (
      <View style={styles.resultCard}>
        <Text style={styles.errorText}>Analysis data missing from response</Text>
        <Text style={styles.debugText}>Response keys: {JSON.stringify(Object.keys(prediction))}</Text>
      </View>
    );
  }

  const { crop, region, weatherSummary, analysis } = prediction;

  // Handle both parsed and synthetic responses
  const isPartial = analysis.parsed === false || analysis.synthetic === true;
  const healthScore = analysis.cropHealth?.score || 65;
  const healthOverall = analysis.cropHealth?.overall || 'fair';
  const healthReasoning = analysis.cropHealth?.reasoning || 'Crop analysis generated from AI model';
  
  const healthColor = healthScore >= 70 ? '#4caf50' : healthScore >= 50 ? '#ffc107' : '#f44336';

  return (
    <View>
      {/* Partial Data Warning */}
      {isPartial && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>⚠️ Partial Analysis</Text>
          <Text style={styles.warningSubtext}>Response was truncated but key insights extracted</Text>
        </View>
      )}

      {/* Header */}
      <View style={[styles.resultCard, { borderLeftColor: healthColor }]}>
        <Text style={styles.cropName}>{crop.toUpperCase()}</Text>
        <Text style={styles.region}>{region}</Text>
      </View>

      {/* Health Score */}
      <View style={styles.resultCard}>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: healthColor }]}>
            <Text style={[styles.scoreText, { color: healthColor }]}>
              {healthScore}
            </Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>{healthOverall}</Text>
            <Text style={styles.scoreReason}>{healthReasoning}</Text>
          </View>
        </View>
      </View>

      {/* Weather */}
      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>🌤️ Weather</Text>
        <InfoRow label="Temperature" value={weatherSummary.temperature} />
        <InfoRow label="Humidity" value={weatherSummary.humidity} />
        <InfoRow label="Wind" value={weatherSummary.windSpeed} />
        <InfoRow label="Precipitation" value={weatherSummary.precipitation} />
      </View>

      {/* Recommendations */}
      {analysis.recommendations && (
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>💡 Recommendations</Text>
          {analysis.recommendations.slice(0, 3).map((rec, idx) => (
            <Text key={idx} style={styles.recommendation}>
              ✓ {rec}
            </Text>
          ))}
        </View>
      )}

      {/* Risk Factors */}
      {analysis.riskFactors && analysis.riskFactors.length > 0 && (
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>⚠️ Risk Factors</Text>
          {analysis.riskFactors.slice(0, 2).map((risk, idx) => (
            <View key={idx} style={styles.riskItem}>
              <Text style={[styles.riskName, { color: getRiskColor(risk.severity) }]}>
                {risk.risk}
              </Text>
              <Text style={styles.riskMitigation}>→ {risk.mitigation}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Harvest */}
      {analysis.harvestPrediction && (
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>📊 Harvest Prediction</Text>
          <Text style={styles.prediction}>{analysis.harvestPrediction.estimatedYield}</Text>
          <Text style={styles.prediction}>{analysis.harvestPrediction.optimalHarvestTime}</Text>
        </View>
      )}
    </View>
  );
}

// Compare Result Component - Table Format
function CompareResult({ predictions }) {
  if (!predictions || predictions.length === 0) {
    return <Text style={styles.errorText}>No comparison data available</Text>;
  }

  // Get all metrics from the first prediction to create table headers
  const allMetrics = new Set();
  predictions.forEach(p => {
    if (p.analysis.cropHealth) {
      allMetrics.add('Health Score');
      allMetrics.add('Overall Status');
    }
    if (p.analysis.harvestPrediction) {
      allMetrics.add('Est. Yield');
    }
    if (p.analysis.riskFactors && p.analysis.riskFactors.length > 0) {
      allMetrics.add('Risk Level');
    }
  });

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.tableCropCell]}>Crop</Text>
        <Text style={styles.tableCell}>Score</Text>
        <Text style={styles.tableCell}>Status</Text>
        <Text style={styles.tableCell}>Yield</Text>
        <Text style={styles.tableCell}>Risks</Text>
      </View>

      {/* Table Rows */}
      {predictions.map((p, idx) => {
        const cropHealth = p.analysis.cropHealth || {};
        const harvestPred = p.analysis.harvestPrediction || {};
        const riskCount = (p.analysis.riskFactors || []).length;
        const highRisks = (p.analysis.riskFactors || []).filter(r => r.severity === 'high').length;

        return (
          <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
            <View style={[styles.tableCell, styles.tableCropCell]}>
              <Text style={styles.tableCropName}>{p.crop.toUpperCase()}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={[styles.tableScore, { color: cropHealth.score >= 70 ? '#4caf50' : '#ff9800' }]}>
                {cropHealth.score || '—'}/100
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={[styles.tableStatus, getStatusColor(cropHealth.overall)]}>
                {cropHealth.overall ? cropHealth.overall.charAt(0).toUpperCase() + cropHealth.overall.slice(1) : '—'}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableYield}>
                {harvestPred.estimatedYield ? harvestPred.estimatedYield.split('-')[0].trim() + 't' : '—'}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={[styles.tableRisk, { color: highRisks > 0 ? '#d32f2f' : '#4caf50' }]}>
                {highRisks > 0 ? `${highRisks}H` : '✓'}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Summary */}
      <View style={styles.compareSummary}>
        <Text style={styles.summaryTitle}>📊 Comparison Summary</Text>
        {predictions.length > 0 && (
          <>
            <Text style={styles.summaryText}>
              Best Score: {Math.max(...predictions.map(p => p.analysis.cropHealth?.score || 0))}/100
            </Text>
            <Text style={styles.summaryText}>
              Lowest Risk: {predictions.sort((a, b) => (a.analysis.riskFactors?.length || 0) - (b.analysis.riskFactors?.length || 0))[0]?.crop.toUpperCase()}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// Helper to get status color
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'excellent':
      return { color: '#1b5e20' };
    case 'good':
      return { color: '#2e7d32' };
    case 'fair':
      return { color: '#f57f17' };
    case 'poor':
      return { color: '#d32f2f' };
    default:
      return { color: '#333' };
  }
}

// Recommend Result Component
// Recommend Result Component - Rankings Table
function RecommendResult({ bestCrop, allCrops }) {
  if (!bestCrop || !allCrops) {
    return <Text style={styles.errorText}>No recommendation data available</Text>;
  }

  return (
    <View>
      {/* Best Crop Highlight */}
      <View style={[styles.bestCropCard]}>
        <Text style={styles.badge}>🏆 RECOMMENDED</Text>
        <Text style={styles.bestCropName}>{bestCrop.crop?.toUpperCase() || 'Unknown'}</Text>
        <Text style={styles.bestCropScore}>
          Score: {bestCrop.analysis?.cropHealth?.score || 0}/100
        </Text>
        {bestCrop.analysis?.recommendations && bestCrop.analysis.recommendations[0] && (
          <Text style={styles.topRec}>💡 {bestCrop.analysis.recommendations[0]}</Text>
        )}
      </View>

      {/* Rankings Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 0.5, fontWeight: '700' }]}>Rank</Text>
          <Text style={[styles.tableCell, styles.tableCropCell]}>Crop</Text>
          <Text style={styles.tableCell}>Score</Text>
          <Text style={styles.tableCell}>Status</Text>
          <Text style={styles.tableCell}>Suitability</Text>
        </View>

        {/* Table Rows */}
        {allCrops && allCrops.length > 0 ? (
          allCrops.map((crop, idx) => {
            const cropHealth = crop.analysis?.cropHealth || {};
            const riskCount = (crop.analysis?.riskFactors || []).length;
            const isBestCrop = idx === 0;

            return (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 && styles.tableRowAlt,
                  isBestCrop && { backgroundColor: '#e8f5e9', borderLeftWidth: 4, borderLeftColor: '#4caf50' }
                ]}
              >
                <View style={[styles.tableCell, { flex: 0.5 }]}>
                  <Text style={[styles.tableScore, { fontWeight: '700', fontSize: 14 }]}>
                    {isBestCrop ? '⭐' : `#${idx + 1}`}
                  </Text>
                </View>
                <View style={[styles.tableCell, styles.tableCropCell]}>
                  <Text style={[styles.tableCropName, isBestCrop && { color: '#2e7d32' }]}>
                    {crop.crop?.toUpperCase() || '—'}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableScore, { color: cropHealth.score >= 70 ? '#4caf50' : '#ff9800' }]}>
                    {cropHealth.score || '—'}/100
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableStatus, getStatusColor(cropHealth.overall)]}>
                    {cropHealth.overall ? cropHealth.overall.charAt(0).toUpperCase() + cropHealth.overall.slice(1) : '—'}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableRisk, { color: riskCount === 0 ? '#4caf50' : '#ff9800' }]}>
                    {riskCount === 0 ? '✓ Ideal' : `${riskCount} risks`}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.errorText}>No crops to rank</Text>
          </View>
        )}

        {/* Summary */}
        <View style={styles.compareSummary}>
          <Text style={styles.summaryTitle}>📊 Recommendation Summary</Text>
          {allCrops && allCrops.length > 0 && (
            <>
              <Text style={styles.summaryText}>
                Best Match: {bestCrop.crop?.toUpperCase() || 'Unknown'} ({bestCrop.analysis?.cropHealth?.score || 0}/100)
              </Text>
              <Text style={styles.summaryText}>
                Total Crops Analyzed: {allCrops.length}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// Helper Components
function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function getRiskColor(severity) {
  switch (severity) {
    case 'high': return '#f44336';
    case 'medium': return '#ffc107';
    case 'low': return '#4caf50';
    default: return '#666';
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
  },
  header: {
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  locationCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 6,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  weatherRow: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 16,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherIcon: {
    fontSize: 16,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  locationText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tabButtonActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  tabButtonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cropButton: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cropButtonActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  cropButtonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  cropButtonTextActive: {
    color: '#fff',
  },
  compareInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  compareText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  recommendInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  recommendText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  resultsSection: {
    marginBottom: 16,
  },
  resultLocationCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  resultLocationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 4,
  },
  resultLocationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  cropName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  region: {
    fontSize: 13,
    color: '#999',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  scoreReason: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  recommendation: {
    fontSize: 12,
    color: '#4caf50',
    marginBottom: 6,
    fontWeight: '500',
  },
  riskItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  riskName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  riskMitigation: {
    fontSize: 11,
    color: '#666',
  },
  prediction: {
    fontSize: 12,
    color: '#333',
    marginVertical: 4,
    lineHeight: 16,
  },
  compareCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  compareCropName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  compareScore: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  compareStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
  },
  bestCropCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 6,
  },
  bestCropName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 4,
  },
  bestCropScore: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
    marginBottom: 8,
  },
  topRec: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffc107',
    width: 30,
  },
  rankCrop: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  rankScore: {
    fontSize: 12,
    color: '#999',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#c62828',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  warningCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 11,
    color: '#bf360c',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  instructionCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  // Table Styles
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  tableCropCell: {
    flex: 1.2,
  },
  tableCropName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  tableScore: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableStatus: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableYield: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  tableRisk: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  compareSummary: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2196f3',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 11,
    color: '#1565c0',
    marginBottom: 4,
    paddingLeft: 8,
  },
});
