import React from 'react';

interface PriceButtonsProps {
  currentPrice: number | null;
  price1MinAgo: number | null;
  onFetchCurrentPrice: () => void;
  onFetchPrice1MinAgo: () => void;
}

const PriceButtons: React.FC<PriceButtonsProps> = ({
  currentPrice,
  price1MinAgo,
  onFetchCurrentPrice,
  onFetchPrice1MinAgo,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center w-full px-2">
    <div className="flex flex-row items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 mx-2">
      <button
        onClick={onFetchCurrentPrice}
        className="px-4 py-2 from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none"
      >
        Current Price
      </button>
      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-200 font-mono min-w-[120px] border-blue-200 dark:border-blue-800">
        {currentPrice !== null ? ` $${currentPrice}` : '--'}
      </span>
    </div>
    <div className="flex flex-row items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 mx-2">
      <button
        onClick={onFetchPrice1MinAgo}
        className="px-4 py-2 from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all duration-200 focus:outline-none "
      >
        Price 1 Min Ago
      </button>
      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-green-700 dark:text-green-200 font-mono min-w-[140px] border-green-200 dark:border-green-800">
        {price1MinAgo !== null ? ` $${price1MinAgo}` : '--'}
      </span>
    </div>
  </div>
);

export default PriceButtons;