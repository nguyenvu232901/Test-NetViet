import React from 'react';

interface TimeframeSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

const TIMEFRAMES = [
  '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '3d', '1w', '1M'
];

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-1 justify-start items-center md:justify-start">
    Khung thời gian:
    {TIMEFRAMES.map(tf => (
      <button
        key={tf}
        className={`px-2 py-1 rounded text-xs md:text-sm transition-all ${value === tf ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
        onClick={() => onChange(tf)}
      >{tf}</button>
    ))}
  </div>
);

export default TimeframeSelector;

// Timeframe selector buttons here
