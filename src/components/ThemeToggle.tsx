import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => (
  <button
    className="px-2 py-1 rounded border dark:bg-white dark:text-white"
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    aria-label="Toggle theme"
  >
    {theme === 'dark' ? '🌙' : '☀️'}
  </button>
);

export default ThemeToggle;
