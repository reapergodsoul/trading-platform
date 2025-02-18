import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  IChartApi, 
  CandlestickData,
  ColorType,
  ISeriesApi,
  CandlestickSeriesOptions
} from 'lightweight-charts';
import { Box, useTheme } from '@mui/material';

interface TradingChartProps {
  data: CandlestickData[];
  height?: number;
  autoScale?: boolean;
  options?: Partial<CandlestickSeriesOptions>;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  data = [], 
  height = 500,
  autoScale = true,
  options = {}
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { 
          type: ColorType.Solid, 
          color: theme.palette.background.paper 
        },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 2,
        },
        horzLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
      },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
      },
      ...options
    });

    const series = chart.addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    series.setData(data);
    seriesRef.current = series;
    chartRef.current = chart;

    if (autoScale) {
      chart.timeScale().fitContent();
    }

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const width = chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, height, theme, autoScale, options]);

  return (
    <Box
      ref={chartContainerRef}
      sx={{
        width: '100%',
        height: `${height}px`,
        '& canvas': { width: '100% !important' }
      }}
    />
  );
};

export default TradingChart;
