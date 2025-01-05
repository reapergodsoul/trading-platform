import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, MarketData, Position, Order, RiskMetrics, PriceAlert } from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Market data
  marketData: Record<string, MarketData>;
  setMarketData: (symbol: string, data: MarketData) => void;

  // Portfolio state
  positions: Position[];
  setPositions: (positions: Position[]) => void;

  // Orders state
  activeOrders: Order[];
  setActiveOrders: (orders: Order[]) => void;

  // UI state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;

  // Technical Analysis state
  indicators: Record<string, any[]>;
  setIndicators: (symbol: string, indicators: any[]) => void;

  // Risk Management state
  riskMetrics: RiskMetrics | null;
  setRiskMetrics: (metrics: RiskMetrics) => void;

  // Alerts state
  priceAlerts: PriceAlert[];
  setPriceAlerts: (alerts: PriceAlert[]) => void;

  // WebSocket connection state
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;
}

const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        marketData: {},
        positions: [],
        activeOrders: [],
        theme: 'light',
        selectedSymbol: 'BTC/USD',
        indicators: {},
        riskMetrics: null,
        priceAlerts: [],
        wsConnected: false,

        // Actions
        setUser: (user) => set({ user }),
        
        setMarketData: (symbol, data) =>
          set((state) => ({
            marketData: {
              ...state.marketData,
              [symbol]: data,
            },
          })),
          
        setPositions: (positions) => set({ positions }),
        
        setActiveOrders: (orders) => set({ activeOrders: orders }),
        
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),
          
        setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

        setIndicators: (symbol, indicators) =>
          set((state) => ({
            indicators: {
              ...state.indicators,
              [symbol]: indicators,
            },
          })),

        setRiskMetrics: (metrics) => set({ riskMetrics: metrics }),
        
        setPriceAlerts: (alerts) => set({ priceAlerts: alerts }),
        
        setWsConnected: (connected) => set({ wsConnected: connected }),
      }),
      {
        name: 'trading-platform-storage',
        partialize: (state) => ({
          theme: state.theme,
          selectedSymbol: state.selectedSymbol,
        }),
      }
    )
  )
);

export default useStore;
