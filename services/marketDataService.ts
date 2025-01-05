import api from './api';
import { MarketData } from '../types';

export const marketDataService = {
  getMarketData: async (symbol: string): Promise<MarketData> => {
    const response = await api.get(`/api/market/${symbol}/price`);
    return response.data;
  },

  getHistoricalData: async (
    symbol: string,
    startDate: string,
    endDate: string,
    interval: string = '1d'
  ) => {
    const response = await api.get(`/api/market/${symbol}/historical`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        interval,
      },
    });
    return response.data;
  },

  getTechnicalIndicators: async (
    symbol: string,
    indicators: string[],
    period: number = 14
  ) => {
    const response = await api.get(`/api/market/${symbol}/indicators`, {
      params: {
        indicators: indicators.join(','),
        period,
      },
    });
    return response.data;
  },

  getMarketSummary: async () => {
    const response = await api.get('/api/market/summary');
    return response.data;
  },

  getTopMovers: async (limit: number = 10) => {
    const response = await api.get('/api/market/top-movers', {
      params: { limit },
    });
    return response.data;
  },
};

export default marketDataService;
