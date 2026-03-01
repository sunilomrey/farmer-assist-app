import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { weatherService } from '@/services/api';

interface ForecastDay {
    date: string;
    maxTemp: string;
    minTemp: string;
    weatherCode: number;
}

export interface WeatherData {
    locationName: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    precipitation: string;
    forecast: ForecastDay[];
}

interface LocationCoords {
    latitude: number;
    longitude: number;
}

interface WeatherContextType {
    weather: WeatherData | null;
    location: LocationCoords | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            let { status } = await Location.requestForegroundPermissionsAsync();

            let lat: number | undefined;
            let lon: number | undefined;
            let locationName: string | undefined;

            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                lat = loc.coords.latitude;
                lon = loc.coords.longitude;
                setLocation({ latitude: lat, longitude: lon });

                // Get actual location name
                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon
                });

                if (reverseGeocode.length > 0) {
                    const address = reverseGeocode[0];
                    const parts = [];
                    if (address.city) parts.push(address.city);
                    else if (address.district) parts.push(address.district);
                    else if (address.subregion) parts.push(address.subregion);

                    if (address.region) parts.push(address.region);

                    if (parts.length > 0) {
                        locationName = parts.join(', ');
                    } else if (address.name) {
                        locationName = address.name;
                    }
                }
            } else {
                // Default to Bengaluru if permission denied
                lat = 12.9716;
                lon = 77.5946;
                setLocation({ latitude: lat, longitude: lon });
            }

            const data = await weatherService.getWeather(lat, lon, locationName);

            // If backend didn't return a locationName, fallback to geocoded one or "Current Location"
            if (data && !data.locationName) {
                data.locationName = locationName || 'Current Location';
            }

            setWeather(data || null);
        } catch (err: any) {
            setError(err.message || 'Failed to load weather data');
            console.error('❌ Weather fetch error:', err);
            // Even if weather fails, set location to default if not set
            if (!location) {
                setLocation({ latitude: 12.9716, longitude: 77.5946 });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <WeatherContext.Provider value={{ weather, location, loading, error, refresh: fetchWeather }}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeather() {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
}
