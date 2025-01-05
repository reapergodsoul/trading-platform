import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  PortfolioSummary,
  MarketOverview,
  ActiveOrders,
  OpenPositions,
  PnLChart,
  RiskMetrics,
  RecentTransactions,
  NewsFeeds,
} from '../components';
import { usePortfolioData, useMarketData } from '../hooks';
import { ErrorBoundary } from '../utils/ErrorBoundary';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { portfolioData, portfolioError } = usePortfolioData();
  const { marketData, marketError } = useMarketData();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Initialize dashboard data
        setIsLoading(false);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={6} lg={4}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Summary
              </Typography>
              <PortfolioSummary data={portfolioData} />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Market Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Market Overview
              </Typography>
              <MarketOverview data={marketData} />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12} md={6} lg={4}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <RiskMetrics portfolioData={portfolioData} />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* PnL Chart */}
        <Grid item xs={12}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <PnLChart data={portfolioData?.performance} />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Active Orders */}
        <Grid item xs={12} md={6}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Active Orders
              </Typography>
              <ActiveOrders />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Open Positions */}
        <Grid item xs={12} md={6}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Open Positions
              </Typography>
              <OpenPositions />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* News Feed */}
        <Grid item xs={12} md={6}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Market News
              </Typography>
              <NewsFeeds />
            </Paper>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
