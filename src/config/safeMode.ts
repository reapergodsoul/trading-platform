export const safeModeConfig = {
  // Feature flags
  enableTrading: false,
  enableRealTimeData: false,
  enableAdvancedCharts: false,
  enableAuthentication: true,
  enableErrorBoundary: true,
  
  // API endpoints
  apiBaseUrl: 'http://localhost:8000',
  wsBaseUrl: 'ws://localhost:8001',
  
  // Performance settings
  maxRequestRetries: 3,
  requestTimeout: 5000,
  
  // UI settings
  enableDarkMode: false,
  enableAnimations: false,
  
  // Debug settings
  enableDebugLogging: true,
  enablePerformanceMonitoring: true,
  
  // Security settings
  enforceStrongPasswords: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  
  // Error handling
  defaultErrorMessage: 'An error occurred. Please try again later.',
  
  // Feature limitations
  maxConcurrentRequests: 5,
  maxChartDataPoints: 1000,
  
  // Recovery options
  autoRecoveryEnabled: true,
  recoveryAttempts: 3,
  recoveryDelay: 1000, // 1 second
};

export const isSafeMode = (): boolean => {
  return process.env.REACT_APP_SAFE_MODE === 'true';
};

export const getSafeModeMessage = (): string => {
  return 'Application is running in safe mode. Some features are disabled for stability.';
};
