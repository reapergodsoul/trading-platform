export const environment = {
  production: false,
  isDesktop: true,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  wsUrl: process.env.WS_URL || 'ws://localhost:3001',
  cloudServiceUrl: process.env.CLOUD_SERVICE_URL || 'https://your-cloud-service.com',
  
  // Desktop-specific settings
  desktopConfig: {
    dataStoragePath: 'C:/Users/farre/AppData/Local/TradingPlatform',
    maxConcurrentConnections: 5,
    enableHardwareAcceleration: true,
    localCacheSize: 500 * 1024 * 1024, // 500MB
  },

  // Cloud service integration
  cloudService: {
    region: process.env.CLOUD_REGION || 'us-east-1',
    retryAttempts: 3,
    timeout: 30000, // 30 seconds
    enableSync: true,
    syncInterval: 5 * 60 * 1000, // 5 minutes
  },

  // Security settings
  security: {
    enableEncryption: true,
    encryptionAlgorithm: 'AES-256-GCM',
    requireLocalAuthentication: true,
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  }
};
