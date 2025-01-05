import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TradingChart from './components/TradingChart/TradingChart';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <Box sx={{ p: 2, height: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <TradingChart />
      </Box>
    </Box>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
