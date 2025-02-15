import { useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

let colorSchemeListeners: ((theme: ColorScheme) => void)[] = [];
let currentColorScheme: ColorScheme | null = null;

export function useColorScheme(): ColorScheme {
  const systemColorScheme = _useColorScheme() as ColorScheme;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    currentColorScheme || systemColorScheme
  );

  useEffect(() => {
    const listener = (newTheme: ColorScheme) => {
      setColorScheme(newTheme);
    };
    
    colorSchemeListeners.push(listener);
    
    return () => {
      colorSchemeListeners = colorSchemeListeners.filter(l => l !== listener);
    };
  }, []);

  return colorScheme;
}

export function setColorScheme(newColorScheme: ColorScheme) {
  currentColorScheme = newColorScheme;
  colorSchemeListeners.forEach(listener => listener(newColorScheme));
}
