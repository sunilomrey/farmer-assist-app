import axios from 'axios';
import config from '@/config';

// Use centralized config for base URL
const BASE_URL = config.api.BASE_URL;

// MOCK JWT TOKEN for testing (should be retrieved from secure storage in production)
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoiVGVzdCBGYXJtZXIiLCJpYXQiOjE3NzIyOTYyMTIsImV4cCI6MTc3MjI5OTgxMn0.7JaCsIOX0AsOAsINu1nxZhNvl6jn3so-Gy8DYh2pfcg';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        // In a real app, fetch token from AsyncStorage or similar here
        if (MOCK_TOKEN) {
            config.headers.Authorization = `Bearer ${MOCK_TOKEN}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const weatherService = {
    getWeather: async (lat?: number, lon?: number, locationName?: string) => {
        try {
            const params: any = lat && lon ? { lat, lon } : {};
            if (locationName) params.locationName = locationName;
            const response = await apiClient.get('/weather', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
