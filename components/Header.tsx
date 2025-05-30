import React from 'react';
import Image from 'next/image';
import ThemeToggle from '../src/components/ThemeToggle';

const Header: React.FC<{ theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void }> = ({ theme, setTheme }) => (
  <header className="w-full flex items-center justify-between px-4 py-2 bg-[#181A20] border-b border-[#23262F]">
    {/* Logo bên trái */}
    <div className="flex items-center gap-2 max-w-30">
      <Image src="https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png" alt="Logo" width={64} height={64} />
    </div>
    {/* ThemeToggle bên phải */}
    <ThemeToggle theme={theme} setTheme={setTheme} />
  </header>
);

export default Header;
