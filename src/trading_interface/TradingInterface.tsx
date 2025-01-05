import React from 'react';
import { Grid, Paper, Typography, Box, Button, TextField } from '@mui/material';
import TradingChart from '../components/TradingChart/TradingChart';

const TradingInterface: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement trade submission
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Trading Chart
            </Typography>
            <TradingChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Place Order
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="symbol"
                label="Symbol"
                name="symbol"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="quantity"
                label="Quantity"
                type="number"
                id="quantity"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="price"
                label="Price"
                type="number"
                id="price"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Place Order
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradingInterface;
