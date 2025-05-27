import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full py-3 px-4 bg-[#181A20] border-t border-[#23262F] text-center text-xs text-[#fff] mt-8">
    © {new Date().getFullYear()} BTC Dashboard. Powered by Binance API. Made with <span className="text-red-400">♥</span> & Tailwind CSS.
  </footer>
);

export default Footer;
