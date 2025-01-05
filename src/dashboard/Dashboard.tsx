import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import TradingChart from '../components/TradingChart/TradingChart';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Market Overview
            </Typography>
            <TradingChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Open Positions
            </Typography>
            {/* Add positions table */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trades
            </Typography>
            {/* Add trades table */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
