import { StyleSheet, Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
}

export function Button({ children, onPress, variant = 'solid', style }: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.outlineButton,
    {
      backgroundColor: variant === 'solid' 
        ? (isDark ? Colors.dark.primary : Colors.light.primary)
        : 'transparent',
      borderColor: isDark ? Colors.dark.primary : Colors.light.primary,
    },
    style,
  ];

  const textStyle: TextStyle = {
    color: variant === 'solid'
      ? '#FFFFFF'
      : (isDark ? Colors.dark.primary : Colors.light.primary),
  };

  return (
    <AnimatedPressable
      style={[buttonStyle, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlineButton: {
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
