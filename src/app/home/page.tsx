"use client";
import React, { useState } from 'react';
import ChartContainer from '../../components/ChartContainer';
import TimeframeSelector from '../../components/TimeframeSelector';
import IndicatorToggle from '../../components/IndicatorToggle';
import { useTheme } from '../../context/ThemeContext';

export default function HomePage() {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState('1m');
  const [indicators, setIndicators] = useState({ rsi: false, macd: false, ema: false, sma: false });

  return (
    <div className="container mx-auto px-2 py-4 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center md:justify-end">
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          <IndicatorToggle value={indicators} onChange={setIndicators} />
        </div>
      </div>
      <ChartContainer theme={theme} timeframe={timeframe} indicators={indicators} />
    </div>
  );
}
