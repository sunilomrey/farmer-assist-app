/**
 * Frontend Configuration Hub
 * 
 * Single source of truth for all frontend configurations
 * Import this file to access all config values across the app
 * 
 * USAGE:
 * import config from './config';
 * import { API, APP, THEME } from './config';
 * 
 * console.log(config.api.BASE_URL);
 * console.log(config.app.CROPS.COMMON);
 * console.log(config.theme.COLORS.PRIMARY);
 */

const environmentConfig = require('./environment');
const apiConfig = require('./api');
const appConfig = require('./app');
const themeConfig = require('./theme');

/**
 * Composite configuration object
 * Organized by concern/domain
 */
const config = {
  // Environment
  environment: environmentConfig,

  // API Configuration
  api: apiConfig,

  // App Configuration
  app: appConfig,

  // Theme & Styling
  theme: themeConfig,

  // Utility methods
  isProduction: () => environmentConfig.isProd,
  isDevelopment: () => environmentConfig.isDev,
  isStaging: () => environmentConfig.name === 'staging',

  // Helper: Get full API endpoint
  getApiEndpoint: (endpoint) => {
    return `${apiConfig.BASE_URL}${endpoint}`;
  }
};

/**
 * Log current configuration (development only)
 */
if (environmentConfig.debugLogging) {
  console.log('🎯 Frontend Configuration Loaded');
  console.log(`📍 Environment: ${environmentConfig.ENV}`);
  console.log(`🔗 API URL: ${apiConfig.BASE_URL}`);
  console.log(`📱 App: ${appConfig.APP.NAME} v${appConfig.APP.VERSION}`);
}

module.exports = config;

// Also export individual configs for convenience
module.exports.environment = environmentConfig;
module.exports.api = apiConfig;
module.exports.app = appConfig;
module.exports.theme = themeConfig;
