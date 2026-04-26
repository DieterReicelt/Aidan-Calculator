export const CONFIG = {
  // Display settings
  DISPLAY: {
    MIN_HEIGHT: 160,
    GRID_SIZE: 25,
    DECIMAL_PLACES: 10,
    MAX_HISTORY_ITEMS: 5
  },

  // Canvas settings
  CANVAS: {
    GRAPH: {
      WIDTH: 450,
      HEIGHT: 300,
      SCALE: 20
    },
    STATS: {
      WIDTH: 400,
      HEIGHT: 150,
      PADDING: { LEFT: 40, RIGHT: 10, TOP: 10, BOTTOM: 25 }
    }
  },

  // Colors
  COLORS: {
    CHART: [
      '#b22222', '#0055aa', '#007733', 
      '#cc6600', '#663399', '#333333', 
      '#aa00aa', '#00aaaa'
    ]
  },

  // Math constants
  MATH: {
    PI: Math.PI,
    E: Math.E,
    TAU: Math.PI * 2,
    PHI: (1 + Math.sqrt(5)) / 2
  },

  // Playback speeds (ms)
  PLAYBACK_SPEED: {
    SLOW: 1100,
    NORMAL: 700,
    FAST: 350
  },

  // Storage keys
  STORAGE_KEYS: {
    HISTORY: 'sciHistory',
    THEME: 'theme',
    ANGLE_MODE: 'angleMode'
  }
};

Object.freeze(CONFIG);