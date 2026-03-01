/**
 * Frontend Environment Configuration
 * 
 * Expo environment settings for different stages
 */

const ENV = process.env.NODE_ENV || 'development';

const environments = {
  development: {
    name: 'development',
    isDev: true,
    isProd: false,
    logLevel: 'debug',
    debugLogging: true
  },
  staging: {
    name: 'staging',
    isDev: false,
    isProd: false,
    logLevel: 'info',
    debugLogging: false
  },
  production: {
    name: 'production',
    isDev: false,
    isProd: true,
    logLevel: 'warn',
    debugLogging: false
  }
};

const currentEnv = environments[ENV] || environments.development;

module.exports = {
  ENV,
  ...currentEnv,
  environments
};
