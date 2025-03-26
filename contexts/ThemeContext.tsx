import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme | null) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PREFERENCE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme() as ColorScheme || 'light';
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(deviceColorScheme);

  // Load saved theme preference on initial render
  useEffect(() => {
    async function loadThemePreference() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme !== null) {
          setColorSchemeState(savedTheme as ColorScheme);
        } else {
          setColorSchemeState(deviceColorScheme);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    }
    
    loadThemePreference();
  }, []);

  // Save theme preference whenever it changes
  const setColorScheme = async (scheme: ColorScheme | null) => {
    try {
      if (scheme === null) {
        // Reset to device preference
        await AsyncStorage.removeItem(THEME_PREFERENCE_KEY);
        setColorSchemeState(deviceColorScheme);
      } else {
        // Set to user preference
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, scheme);
        setColorSchemeState(scheme);
      }
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, toggleColorScheme }}>
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
