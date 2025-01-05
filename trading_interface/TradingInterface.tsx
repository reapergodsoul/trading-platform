import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import {
  TradingChart,
  OrderForm,
  OrderBook,
  MarketDepth,
  TradeHistory,
  TechnicalIndicators,
  AlertSettings,
} from '../components';
import { useOrderBook, useMarketData, useTradeHistory } from '../hooks';
import { ErrorBoundary } from '../utils/ErrorBoundary';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trading-tabpanel-${index}`}
      aria-labelledby={`trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TradingInterface: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const { orderBook } = useOrderBook(selectedSymbol);
  const { marketData } = useMarketData(selectedSymbol);
  const { tradeHistory } = useTradeHistory(selectedSymbol);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        {/* Main Chart Area */}
        <Grid item xs={12} lg={8}>
          <ErrorBoundary>
            <Paper sx={{ p: 2, height: '600px' }}>
              <TradingChart
                symbol={selectedSymbol}
                data={marketData}
                theme={theme.palette.mode}
              />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Order Form and Book */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ height: '600px' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="trading tabs"
              variant="fullWidth"
            >
              <Tab label="Trade" />
              <Tab label="Order Book" />
              <Tab label="Market Depth" />
            </Tabs>

            <TabPanel value={selectedTab} index={0}>
              <OrderForm symbol={selectedSymbol} />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <OrderBook data={orderBook} />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <MarketDepth data={orderBook} />
            </TabPanel>
          </Paper>
        </Grid>

        {/* Technical Analysis */}
        <Grid item xs={12} lg={8}>
          <ErrorBoundary>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Technical Analysis
              </Typography>
              <TechnicalIndicators
                symbol={selectedSymbol}
                data={marketData}
              />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Trade History */}
        <Grid item xs={12} lg={4}>
          <ErrorBoundary>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Trade History
              </Typography>
              <TradeHistory data={tradeHistory} />
            </Paper>
          </ErrorBoundary>
        </Grid>

        {/* Alert Settings */}
        <Grid item xs={12}>
          <ErrorBoundary>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Price Alerts
              </Typography>
              <AlertSettings symbol={selectedSymbol} />
            </Paper>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradingInterface;
