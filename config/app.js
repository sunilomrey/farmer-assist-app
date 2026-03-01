/**
 * Application Configuration
 * 
 * App-level settings like crops, permissions, features
 */

module.exports = {
  // App Info
  APP: {
    NAME: 'Farmer Assist',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-powered crop prediction using AWS Bedrock'
  },

  // Crops Configuration
  CROPS: {
    COMMON: ['wheat', 'rice', 'cotton', 'corn', 'potato', 'tomato', 'onion'],
    COMPARISON_SET: ['wheat', 'rice', 'cotton'],
    RECOMMENDATION_SET: ['wheat', 'rice', 'corn', 'potato', 'cotton', 'sugarcane'],
    MAX_COMPARE: 3,
    MAX_RECOMMEND: 7
  },

  // Location Settings
  LOCATION: {
    DEFAULT_LAT: 12.9716,
    DEFAULT_LON: 77.5946,
    DEFAULT_NAME: 'Bengaluru, India',
    PRECISION: 4 // Decimal places for coordinates
  },

  // Permissions
  PERMISSIONS: {
    LOCATION_REQUIRED: true,
    LOCATION_BACKGROUND: false
  },

  // UI/UX
  UI: {
    ANIMATION_ENABLED: true,
    SPLASH_TIMEOUT: 2000, // 2 seconds
    TOAST_DURATION: 3000 // 3 seconds
  },

  // Feature Flags
  FEATURES: {
    WEATHER_DISPLAY: true,
    CROP_COMPARISON: true,
    CROP_RECOMMENDATION: true,
    ADVANCED_ANALYSIS: false, // Disabled for now
    OFFLINE_MODE: false
  },

  // Timeouts & Delays
  TIMING: {
    LOCATION_DETECTION: 10000, // 10 seconds
    ANALYSIS_TIMEOUT: 120000, // 2 minutes
    DEBOUNCE_INPUT: 500, // 500ms
    REFRESH_INTERVAL: 3600000 // 1 hour
  },

  // Error Messages
  MESSAGES: {
    LOCATION_REQUIRED: 'Location permission is required for crop analysis',
    ANALYSIS_FAILED: 'Failed to analyze crop. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_INPUT: 'Please provide valid input'
  },

  // Asset URLs
  ASSETS: {
    IMAGES: {
      WHEAT_HIGH: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      WHEAT: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
      FARM: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=600&q=80'
    }
  }
};
