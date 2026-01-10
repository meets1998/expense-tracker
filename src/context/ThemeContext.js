'use client';

import { createContext, useContext } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{}}>
      <GlobalStyles />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);