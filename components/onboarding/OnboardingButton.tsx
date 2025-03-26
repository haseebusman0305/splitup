import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

type Props = {
  currentIndex: Animated.SharedValue<number>;
  length: number;
  flatListRef: any;
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OnboardingButton = ({ currentIndex, length, onPress }: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  
  const rnBtnStyle = useAnimatedStyle(() => {
    return {
      width:
        currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
      backgroundColor: primaryColor,
    };
  }, [currentIndex, length]);

  const rnTextStyle = useAnimatedStyle(() => {
    return {
      opacity:
        currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
        },
      ],
    };
  }, [currentIndex, length]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
        },
      ],
    };
  }, [currentIndex, length]);

  return (
    <AnimatedPressable style={[styles.container, rnBtnStyle]} onPress={onPress}>
      <Animated.View style={[styles.textContainer, rnTextStyle]}>
        <ThemedText style={styles.textStyle} darkColor="#FFF" lightColor="#FFF">
          Get Started
        </ThemedText>
      </Animated.View>
      
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#FFF" />
      </Animated.View>
    </AnimatedPressable>
  );
};

export default OnboardingButton;

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    position: 'absolute',
  },
  textStyle: {
    fontWeight: '600',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
  },
});
