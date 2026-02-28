import axios from 'axios';

// Ensure this matches where your backend is running
const BASE_URL = 'http://localhost:3000/api/v1';

// MOCK JWT TOKEN for testing (should be retrieved from secure storage in production)
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoiVGVzdCBGYXJtZXIiLCJpYXQiOjE3NzIyOTI0MzEsImV4cCI6MTc3MjI5NjAzMX0.ZW34iamEIevtPk85SNLCnprq1zAsOEK5h9cbmsOLN28';

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
            return response.data.data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    },
};
