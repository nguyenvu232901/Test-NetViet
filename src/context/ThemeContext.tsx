import React, { createContext, useContext } from "react";

export const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}>({ theme: 'light', setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}
