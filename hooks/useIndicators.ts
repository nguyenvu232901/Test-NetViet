import { useMemo } from 'react';
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD } from '../src/utils/indicators';

/**
 * useIndicators - Efficiently compute all selected indicators for a candle array
 * @param closes Array of close prices
 * @param indicators Object: { rsi, macd, ema, sma }
 * @returns Object with indicator arrays (only those enabled)
 */
export function useIndicators(closes: number[], indicators: { rsi?: boolean; macd?: boolean; ema?: boolean; sma?: boolean }) {
  return useMemo(() => {
    const result: any = {};
    if (indicators.sma) result.sma = calculateSMA(closes, 14);
    if (indicators.ema) result.ema = calculateEMA(closes, 14);
    if (indicators.rsi) result.rsi = calculateRSI(closes, 14);
    if (indicators.macd) result.macd = calculateMACD(closes);
    return result;
  }, [closes, indicators.sma, indicators.ema, indicators.rsi, indicators.macd]);
}
