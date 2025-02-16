import { StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from './ThemedText';

interface ThemeToggleProps {
  style?: ViewStyle;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleTheme = () => {
    // Your theme toggle logic
  };

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[styles.container, style]}
    >
      <ThemedText>{isDark ? '☀️' : '🌙'}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
