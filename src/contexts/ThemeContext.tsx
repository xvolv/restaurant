import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorTheme = 'ocean' | 'emerald' | 'purple' | 'sunset' | 'teal' | 'crimson';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ColorTheme;
  mode: ThemeMode;
  setTheme: (theme: ColorTheme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = {
  ocean: {
    name: 'Ocean Blue',
    primary: 'from-blue-600 to-blue-700',
    secondary: 'from-blue-500 to-blue-600',
    accent: 'blue-500',
    light: 'blue-50',
    colors: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    }
  },
  emerald: {
    name: 'Emerald Green',
    primary: 'from-emerald-600 to-emerald-700',
    secondary: 'from-emerald-500 to-emerald-600',
    accent: 'emerald-500',
    light: 'emerald-50',
    colors: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      900: '#064e3b'
    }
  },
  purple: {
    name: 'Royal Purple',
    primary: 'from-purple-600 to-purple-700',
    secondary: 'from-purple-500 to-purple-600',
    accent: 'purple-500',
    light: 'purple-50',
    colors: {
      50: '#faf5ff',
      100: '#f3e8ff',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      900: '#581c87'
    }
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'from-orange-600 to-orange-700',
    secondary: 'from-orange-500 to-orange-600',
    accent: 'orange-500',
    light: 'orange-50',
    colors: {
      50: '#fff7ed',
      100: '#ffedd5',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      900: '#9a3412'
    }
  },
  teal: {
    name: 'Tropical Teal',
    primary: 'from-teal-600 to-teal-700',
    secondary: 'from-teal-500 to-teal-600',
    accent: 'teal-500',
    light: 'teal-50',
    colors: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      900: '#134e4a'
    }
  },
  crimson: {
    name: 'Crimson Red',
    primary: 'from-red-600 to-red-700',
    secondary: 'from-red-500 to-red-600',
    accent: 'red-500',
    light: 'red-50',
    colors: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      900: '#7f1d1d'
    }
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>('ocean');
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('restaurant_theme') as ColorTheme;
    const savedMode = localStorage.getItem('restaurant_mode') as ThemeMode;
    
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const handleSetTheme = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    localStorage.setItem('restaurant_theme', newTheme);
  };

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('restaurant_mode', newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    handleSetMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      mode,
      setTheme: handleSetTheme,
      setMode: handleSetMode,
      toggleMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};