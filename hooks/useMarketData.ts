import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { MarketData } from '../types';
import { marketDataService } from '../services/marketDataService';

export const useMarketData = (symbol: string) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { data, error: queryError } = useQuery(
    ['marketData', symbol],
    () => marketDataService.getMarketData(symbol),
    {
      refetchInterval: 1000, // Refetch every second
    }
  );

  useEffect(() => {
    if (data) {
      setMarketData(data);
    }
    if (queryError) {
      setError(queryError as Error);
    }
  }, [data, queryError]);

  return { marketData, error };
};

export default useMarketData;
