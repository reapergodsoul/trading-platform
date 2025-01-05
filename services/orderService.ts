import api from './api';
import { Order, OrderType, OrderSide } from '../types';

export const orderService = {
  placeOrder: async (order: {
    symbol: string;
    type: OrderType;
    side: OrderSide;
    quantity: number;
    price?: number;
    stopPrice?: number;
  }): Promise<Order> => {
    const response = await api.post('/api/orders', order);
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await api.delete(`/api/orders/${orderId}`);
  },

  getOrders: async (status?: string): Promise<Order[]> => {
    const response = await api.get('/api/orders', {
      params: { status },
    });
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  modifyOrder: async (
    orderId: string,
    modifications: {
      quantity?: number;
      price?: number;
      stopPrice?: number;
    }
  ): Promise<Order> => {
    const response = await api.patch(`/api/orders/${orderId}`, modifications);
    return response.data;
  },

  getOrderHistory: async (
    startDate?: string,
    endDate?: string
  ): Promise<Order[]> => {
    const response = await api.get('/api/orders/history', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },
};

export default orderService;
