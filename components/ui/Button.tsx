import { StyleSheet, Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onPress, 
  variant = 'solid', 
  style, 
  textStyle, 
  disabled 
}: ButtonProps) {
  const themeColors = useColorScheme();
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

  // Determine button background color
  let backgroundColor = 'transparent';
  let borderColor = themeColors.primary;
  let textColor = '#FFFFFF';

  switch (variant) {
    case 'solid':
      backgroundColor = themeColors.primary;
      textColor = '#FFFFFF';
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = themeColors.primary;
      break;
    case 'ghost':
      backgroundColor = themeColors.secondary + '33'; // With opacity
      borderColor = 'transparent';
      textColor = themeColors.text;
      break;
    case 'destructive':
      backgroundColor = '#dc2626'; // Red color for destructive actions
      borderColor = '#dc2626';
      textColor = '#FFFFFF';
      break;
  }

  return (
    <AnimatedPressable
      style={[
        styles.button, 
        {
          backgroundColor,
          borderColor: variant === 'outline' ? borderColor : 'transparent',
          borderWidth: variant === 'outline' ? 2 : 0,
        },
        variant === 'solid' && styles.shadowProps,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {children}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  shadowProps: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'Poppins-SemiBold',
  },
  disabled: {
    opacity: 0.5,
  },
});
