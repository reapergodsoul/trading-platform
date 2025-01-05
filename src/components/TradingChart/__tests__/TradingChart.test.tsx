import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, it } from 'node:test';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useMarketData } from '../../../hooks/useMarketData';
import { mockHistoricalData } from '../../../mocks/marketData';
import TradingChart from '../TradingChart';

// Mock the custom hook
jest.mock('../../../hooks/useMarketData');
const mockedUseMarketData = useMarketData as jest.MockedFunction<typeof useMarketData>;

// Create a wrapper with necessary providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TradingChart', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedUseMarketData.mockReturnValue({
      marketData: null,
      error: null,
      isLoading: true,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
  });

  it('renders error state when data fetch fails', () => {
    const error = new Error('Failed to fetch data');
    mockedUseMarketData.mockReturnValue({
      marketData: null,
      error,
      isLoading: false,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });
    expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
  });

  it('renders chart when data is available', async () => {
    mockedUseMarketData.mockReturnValue({
      marketData: mockHistoricalData,
      error: null,
      isLoading: false,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('trading-chart')).toBeInTheDocument();
    });
  });

  it('updates timeframe when selector changes', async () => {
    mockedUseMarketData.mockReturnValue({
      marketData: mockHistoricalData,
      error: null,
      isLoading: false,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });

    const timeframeSelector = screen.getByTestId('timeframe-selector');
    fireEvent.change(timeframeSelector, { target: { value: '1H' } });

    await waitFor(() => {
      expect(mockedUseMarketData).toHaveBeenCalledWith('AAPL', '1H');
    });
  });

  it('handles indicator toggles correctly', async () => {
    mockedUseMarketData.mockReturnValue({
      marketData: mockHistoricalData,
      error: null,
      isLoading: false,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });

    const maToggle = screen.getByTestId('ma-toggle');
    fireEvent.click(maToggle);

    await waitFor(() => {
      expect(screen.getByTestId('ma-indicator')).toBeInTheDocument();
    });
  });

  it('resizes chart on window resize', async () => {
    mockedUseMarketData.mockReturnValue({
      marketData: mockHistoricalData,
      error: null,
      isLoading: false,
    });

    render(<TradingChart symbol="AAPL" />, { wrapper: createWrapper() });

    // Simulate window resize
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(screen.getByTestId('trading-chart')).toHaveStyle({
        width: expect.any(String),
        height: expect.any(String),
      });
    });
  });
});
function expect(arg0: any) {
  throw new Error('Function not implemented.');
}

