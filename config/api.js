/**
 * API Configuration
 * 
 * Backend API endpoints and settings
 */

const env = require('./environment');

const API_BASE_URLS = {
  development: 'http://localhost:3000/api/v1',
  staging: process.env.REACT_APP_API_URL || 'https://staging-api.farmerassist.com/api/v1',
  production: process.env.REACT_APP_API_URL || 'https://api.farmerassist.com/api/v1'
};

module.exports = {
  // Base URL for all API calls
  BASE_URL: API_BASE_URLS[env.ENV],

  // API Endpoints
  ENDPOINTS: {
    // Weather
    WEATHER: '/weather',

    // Crop Prediction
    CROP_PREDICTION: {
      ANALYZE: '/crop-prediction/analyze',
      COMPARE: '/crop-prediction/compare',
      RECOMMEND: '/crop-prediction/recommend',
      ADVANCED: '/crop-prediction/advanced'
    },

    // Authentication (if needed)
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh'
    }
  },

  // Request Settings
  REQUEST: {
    TIMEOUT: 60000, // 60 seconds for crop analysis (can be slow with Bedrock)
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000
  },

  // Response Handling
  RESPONSE: {
    DATA_KEY: 'data', // Key where actual data is nested
    SUCCESS_KEY: 'success'
  }
};
