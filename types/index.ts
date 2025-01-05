// Chart Types
export type TimeFrame = '1M' | '1H' | '4H' | '1D' | '1W';

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartOptions {
  layout: {
    background: {
      color: string;
      type: ColorType;
    };
    textColor: string;
  };
  grid: {
    vertLines: {
      color: string;
    };
    horzLines: {
      color: string;
    };
  };
  crosshair: {
    mode: number;
  };
  rightPriceScale: {
    borderColor: string;
  };
  timeScale: {
    borderColor: string;
    timeVisible: boolean;
    secondsVisible: boolean;
  };
}

// Order Types
export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OrderBook {
  bids: [number, number][];  // [price, quantity]
  asks: [number, number][];
}

// Portfolio Types
export interface Position {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

export interface PortfolioSummary {
  totalValue: number;
  availableCash: number;
  totalPnL: number;
  dailyPnL: number;
  positions: Position[];
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

// Risk Metrics Types
export interface RiskMetrics {
  var: number;  // Value at Risk
  sharpeRatio: number;
  beta: number;
  alpha: number;
  maxDrawdown: number;
  volatility: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
  };
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  defaultTimeframe: TimeFrame;
  favoriteSymbols: string[];
}

// Trading Types
export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';

export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  timestamp: string;
  fee: number;
  total: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  availableCash: number;
  positions: Position[];
  performance: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
  };
  riskMetrics: RiskMetrics;
  lastUpdated: string;
}

// Alert Types
export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  active: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'trade' | 'orderbook' | 'ticker' | 'alert';
  data: any;
  timestamp: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
