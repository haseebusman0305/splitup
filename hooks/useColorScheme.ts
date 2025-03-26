import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useLocalStorage } from './useLocalStorage';
import { useTheme } from '@/contexts/ThemeContext';
import type { ColorScheme } from '@/contexts/ThemeContext';

// Simple hook to get the current color scheme
export function useColorScheme(): ColorScheme {
  const { colorScheme } = useTheme();
  return colorScheme;
}

// Hook to control the color scheme
export function useColorSchemeControl() {
  const { setColorScheme, toggleColorScheme } = useTheme();
  return { setColorScheme, toggleColorScheme };
}

export type { ColorScheme };
