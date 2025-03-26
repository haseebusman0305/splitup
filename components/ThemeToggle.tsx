import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, useColorSchemeControl } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type ThemeToggleProps = {
  style?: ViewStyle;
};

export function ThemeToggle({ style }: ThemeToggleProps) {
  const colorScheme = useColorScheme();
  const { toggleColorScheme } = useColorSchemeControl();

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)', // subtle background
  },
});
