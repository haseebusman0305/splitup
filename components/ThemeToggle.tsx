import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useColorScheme, setColorScheme } from '@/hooks/useColorScheme';

export function ThemeToggle() {
  const colorScheme = useColorScheme();

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      <ThemedText>{colorScheme === 'dark' ? '🌞' : '🌙'}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
});
