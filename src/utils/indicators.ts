// Indicator calculation functions

// Calculate Simple Moving Average (SMA)
export function calculateSMA(data: number[], period: number): (number | null)[] {
  if (period <= 1 || data.length < period) return Array(data.length).fill(null);
  const result: (number | null)[] = Array(period - 1).fill(null);
  let sum = data.slice(0, period).reduce((a, b) => a + b, 0);
  result.push(sum / period);
  for (let i = period; i < data.length; i++) {
    sum += data[i] - data[i - period];
    result.push(sum / period);
  }
  return result;
}

// Calculate Exponential Moving Average (EMA)
export function calculateEMA(data: number[], period: number): (number | null)[] {
  if (period <= 1 || data.length < period) return Array(data.length).fill(null);
  const result: (number | null)[] = Array(period - 1).fill(null);
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(ema);
  const k = 2 / (period + 1);
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

// Calculate Relative Strength Index (RSI)
export function calculateRSI(data: number[], period: number): (number | null)[] {
  if (period <= 1 || data.length <= period) return Array(data.length).fill(null);
  const result: (number | null)[] = Array(period).fill(null);
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) gain += diff; else loss -= diff;
  }
  gain /= period;
  loss /= period;
  let rs = loss === 0 ? 100 : gain / loss;
  result.push(100 - 100 / (1 + rs));
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) {
      gain = (gain * (period - 1) + diff) / period;
      loss = (loss * (period - 1)) / period;
    } else {
      gain = (gain * (period - 1)) / period;
      loss = (loss * (period - 1) - diff) / period;
    }
    rs = loss === 0 ? 100 : gain / loss;
    result.push(100 - 100 / (1 + rs));
  }
  return result;
}

// Calculate MACD (returns {macd, signal, histogram})
export function calculateMACD(data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (data.length < slowPeriod) {
    return { macd: Array(data.length).fill(null), signal: Array(data.length).fill(null), histogram: Array(data.length).fill(null) };
  }
  const emaFast = calculateEMA(data, fastPeriod);
  const emaSlow = calculateEMA(data, slowPeriod);
  const macd: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (emaFast[i] !== null && emaSlow[i] !== null) {
      macd.push((emaFast[i] as number) - (emaSlow[i] as number));
    } else {
      macd.push(null);
    }
  }
  const signal = calculateEMA(macd.map(v => v ?? 0), signalPeriod);
  const histogram = macd.map((v, i) => (v !== null && signal[i] !== null) ? v - (signal[i] as number) : null);
  return { macd, signal, histogram };
}
