import React from 'react';

interface IndicatorToggleProps {
  value: { rsi?: boolean; macd?: boolean; ema?: boolean; sma?: boolean };
  onChange: (v: any) => void;
}

const INDICATORS = [
  { key: 'rsi', label: 'RSI' },
  { key: 'macd', label: 'MACD' },
  { key: 'ema', label: 'EMA' },
  { key: 'sma', label: 'SMA' },
];

const IndicatorToggle: React.FC<IndicatorToggleProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2 justify-start items-center md:justify-start">
    Chỉ số kĩ thuật: 
    {INDICATORS.map(ind => (
      <label key={ind.key} className="flex items-center gap-1 text-xs md:text-sm dark:text-white cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!value[ind.key as keyof typeof value]}
          onChange={e => onChange({ ...value, [ind.key]: e.target.checked })}
          className="accent-blue-500"
        />
        {ind.label}
      </label>
    ))}
  </div>
);

export default IndicatorToggle;
