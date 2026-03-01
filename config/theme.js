/**
 * Theme & Styling Configuration
 * 
 * Colors, fonts, and styling constants
 */

module.exports = {
  COLORS: {
    // Primary
    PRIMARY: '#4caf50',
    PRIMARY_LIGHT: '#81c784',
    PRIMARY_DARK: '#2e7d32',

    // Secondary
    SECONDARY: '#2196f3',
    SECONDARY_LIGHT: '#64b5f6',
    SECONDARY_DARK: '#1565c0',

    // Status Colors
    SUCCESS: '#4caf50',
    WARNING: '#ff9800',
    ERROR: '#f44336',
    INFO: '#2196f3',

    // Neutral
    WHITE: '#ffffff',
    BLACK: '#000000',
    LIGHT_GRAY: '#f5f5f5',
    MEDIUM_GRAY: '#bdbdbd',
    DARK_GRAY: '#424242',

    // Semantic
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#666666',
    TEXT_LIGHT: '#999999',
    BORDER: '#e0e0e0',
    BACKGROUND: '#fafafa'
  },

  TYPOGRAPHY: {
    FONT_FAMILY: {
      DEFAULT: 'System',
      MONO: 'monospace'
    },
    FONT_SIZE: {
      TINY: 10,
      SMALL: 12,
      NORMAL: 14,
      LARGE: 16,
      XLARGE: 18,
      TITLE: 20,
      HEADING: 24
    },
    FONT_WEIGHT: {
      LIGHT: '300',
      NORMAL: '400',
      MEDIUM: '600',
      BOLD: '700'
    }
  },

  SPACING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 24,
    XXL: 32
  },

  RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    FULL: 999
  },

  SHADOWS: {
    SM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1
    },
    MD: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4
    },
    LG: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6
    }
  }
};
