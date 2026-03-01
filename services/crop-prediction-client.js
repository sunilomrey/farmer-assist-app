/**
 * Frontend Integration Example for Crop Prediction
 * 
 * This file shows how to integrate AWS Bedrock crop predictions
 * into your React Native Farmer Assist frontend.
 * 
 * Place this code in your components or services directory.
 */

import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

// API Service Class
export class CropPredictionService {
    constructor(baseURL = 'http://localhost:3000/api/v1') {
        this.baseURL = baseURL;
    }

    /**
     * Get prediction for a single crop
     */
    async analyzeCrop(cropType, lat, lon, locationName = undefined) {
        try {
            const queryParams = new URLSearchParams({
                cropType,
                lat: lat.toString(),
                lon: lon.toString(),
                ...(locationName && { locationName })
            });

            const url = `${this.baseURL}/crop-prediction/analyze?${queryParams}`;

            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error in analyzeCrop:', error);
            throw error;
        }
    }

    /**
     * Compare multiple crops
     */
    async compareCrops(crops, lat, lon, locationName = undefined) {
        try {
            const payload = { crops, lat, lon };
            if (locationName) payload.locationName = locationName;

            const url = `${this.baseURL}/crop-prediction/compare`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error in compareCrops:', error);
            throw error;
        }
    }

    /**
     * Get crop recommendation
     */
    async getRecommendedCrop(availableCrops, lat, lon, locationName = undefined) {
        try {
            const payload = { availableCrops, lat, lon };
            if (locationName) payload.locationName = locationName;

            const url = `${this.baseURL}/crop-prediction/recommend`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error in getRecommendedCrop:', error);
            throw error;
        }
    }

    /**
     * Get advanced prediction with historical data
     */
    async getAdvancedPrediction(cropType, lat, lon, historicalData = undefined, locationName = undefined) {
        try {
            const response = await fetch(
                `${this.baseURL}/crop-prediction/advanced`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cropType,
                        lat,
                        lon,
                        locationName,
                        historicalData
                    })
                }
            );

            if (!response.ok) throw new Error('Failed to get advanced prediction');
            return await response.json();
        } catch (error) {
            console.error('Error getting advanced prediction:', error);
            throw error;
        }
    }
}

// Example Component 1: Single Crop Analysis
export function CropAnalysisScreen({ cropType, lat, lon, locationName }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cropService = new CropPredictionService();

    React.useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const result = await cropService.analyzeCrop(cropType, lat, lon, locationName);
                setAnalysis(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (cropType) {
            fetchAnalysis();
        }
    }, [cropType, lat, lon]);

    if (loading) return <ActivityIndicator size="large" />;
    if (error) return <Text style={{ color: 'red' }}>Error: {error}</Text>;
    if (!analysis) return <Text>No data</Text>;

    const healthScore = analysis.analysis.cropHealth.score;
    const healthColor = healthScore >= 70 ? '#4caf50' : healthScore >= 50 ? '#ffc107' : '#f44336';

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{analysis.crop.toUpperCase()}</Text>
            <Text style={styles.location}>{analysis.region}</Text>

            {/* Health Score */}
            <View style={[styles.card, { borderLeftColor: healthColor, borderLeftWidth: 5 }]}>
                <Text style={styles.cardTitle}>Crop Health</Text>
                <Text style={[styles.score, { color: healthColor }]}>
                    {healthScore}/100
                </Text>
                <Text style={styles.status}>{analysis.analysis.cropHealth.overall}</Text>
                <Text style={styles.reasoning}>{analysis.analysis.cropHealth.reasoning}</Text>
            </View>

            {/* Weather Summary */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Current Weather</Text>
                <WeatherRow label="Temperature" value={analysis.weatherSummary.temperature} />
                <WeatherRow label="Humidity" value={analysis.weatherSummary.humidity} />
                <WeatherRow label="Wind Speed" value={analysis.weatherSummary.windSpeed} />
                <WeatherRow label="Precipitation" value={analysis.weatherSummary.precipitation} />
            </View>

            {/* Risk Factors */}
            {analysis.analysis.riskFactors && analysis.analysis.riskFactors.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Risk Factors</Text>
                    {analysis.analysis.riskFactors.map((risk, idx) => (
                        <View key={idx} style={styles.riskItem}>
                            <Text style={[styles.risk, { color: getRiskColor(risk.severity) }]}>
                                ⚠️ {risk.risk} ({risk.severity})
                            </Text>
                            <Text style={styles.description}>{risk.description}</Text>
                            <Text style={styles.mitigation}>→ {risk.mitigation}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Recommendations */}
            {analysis.analysis.recommendations && analysis.analysis.recommendations.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recommendations</Text>
                    {analysis.analysis.recommendations.map((rec, idx) => (
                        <Text key={idx} style={styles.recommendation}>
                            ✓ {rec}
                        </Text>
                    ))}
                </View>
            )}

            {/* Harvest Prediction */}
            {analysis.analysis.harvestPrediction && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Harvest Prediction</Text>
                    <Text style={styles.prediction}>
                        📊 {analysis.analysis.harvestPrediction.estimatedYield}
                    </Text>
                    <Text style={styles.prediction}>
                        📅 {analysis.analysis.harvestPrediction.optimalHarvestTime}
                    </Text>
                    <Text style={styles.prediction}>
                        ⭐ {analysis.analysis.harvestPrediction.qualityPrediction}
                    </Text>
                </View>
            )}

            {/* Market Insights */}
            {analysis.analysis.marketInsights && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Market Insights</Text>
                    <Text style={styles.marketInfo}>
                        📈 Demand: {analysis.analysis.marketInsights.expectedDemand}
                    </Text>
                    <Text style={styles.marketInfo}>
                        💹 Price Outlook: {analysis.analysis.marketInsights.priceOutlook}
                    </Text>
                    <Text style={styles.marketInfo}>
                        ⏰ Best Time: {analysis.analysis.marketInsights.marketTiming}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

// Example Component 2: Crop Recommendation
export function CropRecommendationScreen({ availableCrops, lat, lon, locationName }) {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cropService = new CropPredictionService();

    React.useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                const result = await cropService.getRecommendedCrop(
                    availableCrops,
                    lat,
                    lon,
                    locationName
                );
                setRecommendation(result.recommendation);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (availableCrops && availableCrops.length > 0) {
            fetchRecommendation();
        }
    }, [availableCrops, lat, lon]);

    if (loading) return <ActivityIndicator size="large" />;
    if (error) return <Text style={{ color: 'red' }}>Error: {error}</Text>;
    if (!recommendation) return <Text>No recommendations</Text>;

    const bestCrop = recommendation.bestCrop;
    const topCrops = recommendation.allAnalyses.slice(0, 3);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Crop Recommendation</Text>

            {/* Best Crop (Highlighted) */}
            <View style={[styles.card, styles.bestCropCard]}>
                <Text style={styles.badge}>🏆 RECOMMENDED</Text>
                <Text style={styles.bestCropName}>{bestCrop.crop.toUpperCase()}</Text>
                <Text style={styles.bestCropScore}>
                    Health Score: {bestCrop.analysis.cropHealth.score}/100
                </Text>
                <Text style={styles.bestCropReason}>
                    {bestCrop.analysis.cropHealth.reasoning}
                </Text>
                <Text style={styles.topRecommendation}>
                    💡 {bestCrop.analysis.recommendations[0]}
                </Text>
            </View>

            {/* All Crop Rankings */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>All Crops (Ranked)</Text>
                {topCrops.map((crop, idx) => (
                    <View key={idx} style={styles.cropRankingItem}>
                        <Text style={styles.rank}>#{idx + 1}</Text>
                        <Text style={styles.cropName}>{crop.crop.toUpperCase()}</Text>
                        <Text style={styles.score}>Score: {crop.analysis.cropHealth.score}</Text>
                    </View>
                ))}
            </View>

            {/* Why This Crop */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Why {bestCrop.crop.toUpperCase()}?</Text>
                {bestCrop.analysis.recommendations.slice(0, 3).map((rec, idx) => (
                    <Text key={idx} style={styles.reason}>
                        • {rec}
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
}

// Helper Component: Weather Row
function WeatherRow({ label, value }) {
    return (
        <View style={styles.weatherRow}>
            <Text style={styles.weatherLabel}>{label}:</Text>
            <Text style={styles.weatherValue}>{value}</Text>
        </View>
    );
}

// Helper Function: Get Risk Color
function getRiskColor(severity) {
    switch (severity) {
        case 'high':
            return '#f44336';
        case 'medium':
            return '#ffc107';
        case 'low':
            return '#4caf50';
        default:
            return '#666';
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 12
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
    },
    location: {
        fontSize: 14,
        color: '#999',
        marginBottom: 16
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333'
    },
    score: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'capitalize'
    },
    reasoning: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    weatherLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500'
    },
    weatherValue: {
        fontSize: 13,
        color: '#333',
        fontWeight: '600'
    },
    riskItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    risk: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4
    },
    description: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        lineHeight: 16
    },
    mitigation: {
        fontSize: 12,
        color: '#4caf50',
        fontWeight: '500'
    },
    recommendation: {
        fontSize: 13,
        color: '#4caf50',
        marginBottom: 8,
        lineHeight: 18
    },
    prediction: {
        fontSize: 13,
        marginVertical: 6,
        color: '#333',
        lineHeight: 18
    },
    marketInfo: {
        fontSize: 13,
        marginVertical: 4,
        color: '#555'
    },
    bestCropCard: {
        backgroundColor: '#e8f5e9',
        borderLeftWidth: 5,
        borderLeftColor: '#4caf50'
    },
    badge: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2e7d32',
        marginBottom: 8
    },
    bestCropName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1b5e20',
        marginBottom: 8
    },
    bestCropScore: {
        fontSize: 14,
        color: '#4caf50',
        fontWeight: '600',
        marginBottom: 8
    },
    bestCropReason: {
        fontSize: 13,
        color: '#333',
        marginBottom: 12,
        lineHeight: 18
    },
    topRecommendation: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2e7d32'
    },
    cropRankingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    rank: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffc107',
        marginRight: 12,
        width: 30
    },
    cropName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1
    },
    score: {
        fontSize: 12,
        color: '#999'
    },
    reason: {
        fontSize: 13,
        color: '#556566',
        marginVertical: 6,
        paddingLeft: 8,
        lineHeight: 18
    }
});
