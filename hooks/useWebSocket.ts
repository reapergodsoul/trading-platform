import { useEffect, useRef, useState, useCallback } from 'react';
import useStore from '../store';

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: any) => void;
}

const useWebSocket = (
  url: string,
  options: WebSocketOptions = {}
) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const token = localStorage.getItem('token');

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${url}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          setTimeout(connect, reconnectInterval);
        } else {
          setError(new Error('WebSocket connection failed after maximum attempts'));
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) {
            onMessage(data);
          }
          
          // Handle different message types
          switch (data.type) {
            case 'market_data':
              handleMarketData(data);
              break;
            case 'order_update':
              handleOrderUpdate(data);
              break;
            case 'position_update':
              handlePositionUpdate(data);
              break;
            case 'error':
              handleError(data);
              break;
            default:
              console.log('Unhandled message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setError(error as Error);
    }
  }, [url, token, reconnectAttempts, reconnectInterval, onMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [isConnected]);

  const handleMarketData = (data: any) => {
    const setMarketData = useStore.getState().setMarketData;
    setMarketData(data.symbol, data.data);
  };

  const handleOrderUpdate = (data: any) => {
    const setActiveOrders = useStore.getState().setActiveOrders;
    setActiveOrders(data.orders);
  };

  const handlePositionUpdate = (data: any) => {
    const setPositions = useStore.getState().setPositions;
    setPositions(data.positions);
  };

  const handleError = (data: any) => {
    console.error('WebSocket error message:', data.error);
    setError(new Error(data.error));
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    send,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocket;
