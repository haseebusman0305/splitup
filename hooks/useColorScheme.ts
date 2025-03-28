import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useLocalStorage } from './useLocalStorage';
import { useTheme } from '@/contexts/ThemeContext';
import type { ColorScheme } from '@/contexts/ThemeContext';
import { ThemeName, THEMES, ThemeColors } from '@/constants/Colors';

// Returns the current theme colors
export function useColorScheme(): ThemeColors {
  const { themeIndex } = useTheme();
  return THEMES[themeIndex] || THEMES[0];
}

// Provides controls for changing the theme
export function useThemeControl() {
  const { setThemeIndex, cycleTheme, getThemeName, themeIndex } = useTheme();
  return { setThemeIndex, cycleTheme, getThemeName, themeIndex };
}

export type { ColorScheme };
