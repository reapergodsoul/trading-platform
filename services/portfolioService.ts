import api from './api';
import { Portfolio, Position } from '../types';

export const portfolioService = {
  getPortfolio: async (): Promise<Portfolio> => {
    const response = await api.get('/api/portfolio');
    return response.data;
  },

  getPositions: async (): Promise<Position[]> => {
    const response = await api.get('/api/portfolio/positions');
    return response.data;
  },

  getPosition: async (symbol: string): Promise<Position> => {
    const response = await api.get(`/api/portfolio/positions/${symbol}`);
    return response.data;
  },

  getPerformance: async (
    startDate: string,
    endDate: string
  ): Promise<{
    returns: number;
    drawdown: number;
    sharpeRatio: number;
    volatility: number;
  }> => {
    const response = await api.get('/api/portfolio/performance', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  getRiskMetrics: async (): Promise<{
    valueAtRisk: number;
    beta: number;
    correlation: number;
  }> => {
    const response = await api.get('/api/portfolio/risk');
    return response.data;
  },

  getTransactionHistory: async (
    startDate?: string,
    endDate?: string
  ): Promise<any[]> => {
    const response = await api.get('/api/portfolio/transactions', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },
};

export default portfolioService;
