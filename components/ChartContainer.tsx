import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import axios from 'axios';
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD } from '../src/utils/indicators';
import { GetCandles, GetLiveCandle } from '../src/utils/binanceApi';
import { useIndicators } from '../src/hooks/useIndicators';
import { useBinanceSocket } from '../src/hooks/useBinanceSocket';
import PriceButtons from '../src/components/PriceButtons';

interface ChartContainerProps {
  theme?: 'light' | 'dark';
  timeframe?: string;
  indicators?: { rsi?: boolean; macd?: boolean; ema?: boolean; sma?: boolean };
}

const ChartContainer: React.FC<ChartContainerProps> = ({ theme = 'light', timeframe = '1m', indicators = {} }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  // Indicator series refs
  const smaSeriesRef = useRef<any>(null);
  const emaSeriesRef = useRef<any>(null);
  const rsiSeriesRef = useRef<any>(null);
  const macdSeriesRef = useRef<any>(null);

  // State for chart data
  const [candles, setCandles] = React.useState<any[]>([]);
  const [volumes, setVolumes] = React.useState<any[]>([]);

  // State for price buttons
  const [currentPrice, setCurrentPrice] = React.useState<number | null>(null);
  const [price1MinAgo, setPrice1MinAgo] = React.useState<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    // Remove old chart if exists
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (e) {
        // ignore if already disposed
      }
      chartRef.current = null;
    }
    // Reset all series refs to null to avoid 'Object is disposed' errors
    candleSeriesRef.current = null;
    volumeSeriesRef.current = null;
    smaSeriesRef.current = null;
    emaSeriesRef.current = null;
    rsiSeriesRef.current = null;
    macdSeriesRef.current = null;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: theme === 'dark' ? '#111' : '#fff' },
        textColor: theme === 'dark' ? '#DDD' : '#333',
      },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
    });
    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickVisible: true,
    });
    candleSeriesRef.current = candleSeries;
    // Volume series (max 30% height)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    // Set scale margins for volume after creation
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.7, bottom: 0 } });
    volumeSeriesRef.current = volumeSeries;

    // Responsive resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [theme, timeframe]);

  // Fetch historical data from Binance REST API (refactored)
  React.useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await GetCandles(timeframe, 'BTCUSDT');
      if (ignore) return;
      setCandles(data.map(c => ({
        time: Math.floor(c.openTime / 1000),
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })));
      setVolumes(data.map(c => ({
        time: Math.floor(c.openTime / 1000),
        value: c.volume,
        color: c.close > c.open ? '#26a69a' : '#ef5350',
      })));
    }
    fetchData();
    return () => { ignore = true; };
  }, [timeframe]);

  // Compute indicators efficiently with useIndicators
  const closes = candles.map(c => c.close);
  const indicatorData = useIndicators(closes, indicators);

  // Real-time streaming from Binance WebSocket (refactored with hook)
  useBinanceSocket(GetLiveCandle(timeframe, 'BTCUSDT'), (k: any) => {
    const time = Math.floor(k.t / 1000);
    const newCandle = {
      time,
      open: +k.o,
      high: +k.h,
      low: +k.l,
      close: +k.c,
    };
    const newVolume = {
      time,
      value: +k.v,
      color: +k.c > +k.o ? '#26a69a' : '#ef5350',
    };
    setCandles((prev) => {
      if (!prev.length) return [newCandle];
      if (prev[prev.length - 1].time === time) {
        return [...prev.slice(0, -1), newCandle];
      } else if (prev[prev.length - 1].time < time) {
        return [...prev, newCandle];
      }
      return prev;
    });
    setVolumes((prev) => {
      if (!prev.length) return [newVolume];
      if (prev[prev.length - 1].time === time) {
        return [...prev.slice(0, -1), newVolume];
      } else if (prev[prev.length - 1].time < time) {
        return [...prev, newVolume];
      }
      return prev;
    });
  });

  // Update chart data when candles/volumes change
  React.useEffect(() => {
    if (candles.length && candleSeriesRef.current) {
      candleSeriesRef.current.setData(candles);
    }
    if (volumes.length && volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(volumes);
    }
  }, [candles, volumes]);

  // Compute and render indicators when toggled or candles change
  useEffect(() => {
    if (!chartRef.current || !candles.length) return;
    const chart = chartRef.current;
    // Remove previous indicator series if exist
    if (smaSeriesRef.current) { chart.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
    if (emaSeriesRef.current) { chart.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
    if (rsiSeriesRef.current) { chart.removeSeries(rsiSeriesRef.current); rsiSeriesRef.current = null; }
    if (macdSeriesRef.current) { chart.removeSeries(macdSeriesRef.current); macdSeriesRef.current = null; }

    // Use indicatorData from hook
    // SMA
    if (indicatorData.sma) {
      smaSeriesRef.current = chart.addSeries(LineSeries, { color: '#fbbf24', lineWidth: 2 });
      smaSeriesRef.current.setData(candles.map((c, i) => ({ time: c.time, value: indicatorData.sma[i] ?? null })).filter(d => d.value !== null));
    }
    // EMA
    if (indicatorData.ema) {
      emaSeriesRef.current = chart.addSeries(LineSeries, { color: '#6366f1', lineWidth: 2 });
      emaSeriesRef.current.setData(candles.map((c, i) => ({ time: c.time, value: indicatorData.ema[i] ?? null })).filter(d => d.value !== null));
    }
    // RSI (as a separate pane)
    if (indicatorData.rsi) {
      rsiSeriesRef.current = chart.addSeries(LineSeries, { color: '#10b981', lineWidth: 2, priceScaleId: 'rsi' });
      chart.priceScale('rsi', { autoScale: true });
      rsiSeriesRef.current.setData(candles.map((c, i) => ({ time: c.time, value: indicatorData.rsi[i] ?? null })).filter(d => d.value !== null));
    }
    // MACD (as a separate pane)
    if (indicatorData.macd) {
      macdSeriesRef.current = chart.addSeries(LineSeries, { color: '#f43f5e', lineWidth: 2, priceScaleId: 'macd' });
      chart.priceScale('macd', { autoScale: true });
      macdSeriesRef.current.setData(candles.map((c, i) => ({ time: c.time, value: indicatorData.macd.macd[i] ?? null })).filter(d => d.value !== null));
      // Optionally, add signal/histogram as well
    }
  }, [indicatorData, candles]);

  // Handlers for price fetch buttons
  const handleFetchCurrentPrice = () => {
    if (candles.length) {
      setCurrentPrice(candles[candles.length - 1].close);
    }
  };
  const handleFetchPrice1MinAgo = () => {
    if (candles.length > 1) {
      setPrice1MinAgo(candles[candles.length - 2].close);
    }
  };

  return (
    <div ref={chartContainerRef} className="w-full h-[400px] min-h-[300px] max-h-[80vh] relative flex flex-col bg-white dark:bg-[#111] rounded-lg shadow-md overflow-hidden md:h-[500px] lg:h-[600px]">
      <div className="flex-1 min-h-[200px] w-full" />
      <PriceButtons
        currentPrice={currentPrice}
        price1MinAgo={price1MinAgo}
        onFetchCurrentPrice={handleFetchCurrentPrice}
        onFetchPrice1MinAgo={handleFetchPrice1MinAgo}
      />
    </div>
  );
};

export default ChartContainer;
