"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}>({ theme: 'light', setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
      }
    }
  }, [theme]);

  if (!mounted) return <div className="opacity-0 min-h-screen" />;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme === 'dark' ? 'dark flex flex-col min-h-screen bg-[#111] text-[#fff]' : 'flex flex-col min-h-screen bg-white text-gray-900'}>
        <Header />
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
      </div>
    </ThemeContext.Provider>
  );
}