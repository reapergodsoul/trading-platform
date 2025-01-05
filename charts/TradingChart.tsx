import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType } from 'lightweight-charts';
import { Box, Paper, ButtonGroup, Button, useTheme } from '@mui/material';
import { ChartData, ChartOptions, TimeFrame } from '../types';

interface TradingChartProps {
  data: ChartData[];
  symbol: string;
  height?: number;
  width?: string;
}

const TradingChart: React.FC<TradingChartProps> = ({
  data,
  symbol,
  height = 500,
  width = '100%',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  const chartOptions: ChartOptions = {
    layout: {
      background: {
        color: isDarkMode ? '#1a1a1a' : '#ffffff',
        type: ColorType.Solid,
      },
      textColor: isDarkMode ? '#d1d4dc' : '#000000',
    },
    grid: {
      vertLines: {
        color: isDarkMode ? '#2B2B43' : '#e1e3ea',
      },
      horzLines: {
        color: isDarkMode ? '#2B2B43' : '#e1e3ea',
      },
    },
    crosshair: {
      mode: 0,
    },
    rightPriceScale: {
      borderColor: isDarkMode ? '#2B2B43' : '#e1e3ea',
    },
    timeScale: {
      borderColor: isDarkMode ? '#2B2B43' : '#e1e3ea',
      timeVisible: true,
      secondsVisible: false,
    },
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const newChart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    const candleSeries = newChart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const volume = newChart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    setChart(newChart);
    setCandlestickSeries(candleSeries);
    setVolumeSeries(volume);

    return () => {
      newChart.remove();
    };
  }, [height, isDarkMode]);

  useEffect(() => {
    if (candlestickSeries && volumeSeries && data) {
      candlestickSeries.setData(data);
      volumeSeries.setData(
        data.map((item) => ({
          time: item.time,
          value: item.volume,
          color: item.close >= item.open ? '#26a69a' : '#ef5350',
        }))
      );
    }
  }, [data, candlestickSeries, volumeSeries]);

  useEffect(() => {
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chart]);

  const handleTimeframeChange = (timeframe: TimeFrame) => {
    setSelectedTimeframe(timeframe);
    // Implement timeframe change logic here
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined" size="small">
          {(['1M', '1H', '4H', '1D', '1W'] as TimeFrame[]).map((tf) => (
            <Button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              variant={selectedTimeframe === tf ? 'contained' : 'outlined'}
            >
              {tf}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <div
        ref={chartContainerRef}
        style={{
          width: width,
          height: `${height}px`,
        }}
      />
    </Paper>
  );
};

export default TradingChart;
