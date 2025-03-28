import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

interface ThemeToggleProps {
  style?: ViewStyle;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { cycleTheme } = useTheme();
  const themeColors = useColorScheme();
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: themeColors.primary }, style]} 
      onPress={cycleTheme}
      onLongPress={() => router.push('/theme-showcase')}
      delayLongPress={500}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="color-palette" size={18} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
