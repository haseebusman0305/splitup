import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, DEFAULT_THEME_INDEX, THEME_NAMES } from '@/constants/Colors';

interface ThemeContextType {
  themeIndex: number;
  setThemeIndex: (index: number) => void;
  cycleTheme: () => void;
  getThemeName: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PREFERENCE_KEY = '@theme_preference_index';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeIndex, setThemeIndexState] = useState<number>(DEFAULT_THEME_INDEX);

  useEffect(() => {
    async function loadThemePreference() {
      try {
        const savedThemeIndex = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedThemeIndex !== null) {
          const index = parseInt(savedThemeIndex, 10);
          if (!isNaN(index) && index >= 0 && index < THEMES.length) {
            setThemeIndexState(index);
          }
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    }
    
    loadThemePreference();
  }, []);

  const setThemeIndex = async (newIndex: number) => {
    try {
      // Ensure the index is valid
      if (newIndex < 0 || newIndex >= THEMES.length) {
        console.warn(`Invalid theme index: ${newIndex}. Using default.`);
        newIndex = DEFAULT_THEME_INDEX;
      }
      
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newIndex.toString());
      setThemeIndexState(newIndex);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const cycleTheme = () => {
    const nextIndex = (themeIndex + 1) % THEMES.length;
    setThemeIndex(nextIndex);
  };

  const getThemeName = () => {
    return THEME_NAMES[themeIndex] || 'Unknown Theme';
  };

  return (
    <ThemeContext.Provider value={{ themeIndex, setThemeIndex, cycleTheme, getThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
