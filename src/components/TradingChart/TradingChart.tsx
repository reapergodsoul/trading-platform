import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30'
      );

      const candleData: CandleData[] = response.data.map((d: any) => ({
        time: new Date(d[0]).toISOString().split('T')[0],
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      if (chartContainerRef.current) {
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 500,
          layout: {
            background: { color: '#ffffff' },
            textColor: '#333333',
          },
          grid: {
            vertLines: { color: '#f0f0f0' },
            horzLines: { color: '#f0f0f0' },
          },
        });

        const series = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        series.setData(candleData);
        setCurrentPrice(candleData[candleData.length - 1].close.toFixed(2));

        const handleResize = () => {
          chart.applyOptions({
            width: chartContainerRef.current?.clientWidth || 800,
          });
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        BTC/USDT {currentPrice && `$${currentPrice}`}
      </Typography>
      <Box
        ref={chartContainerRef}
        sx={{
          width: '100%',
          height: 500,
        }}
      />
    </Paper>
  );
};

export default TradingChart;
