import { ReactNode } from 'react';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface ScreenTransitionProps {
  children: ReactNode;
  delay?: number;
}

export function ScreenTransition({ children, delay = 0 }: ScreenTransitionProps) {
  return (
    <Animated.View 
      entering={FadeIn
        .delay(delay)
        .springify()
        .mass(0.5)}
      style={styles.container}>
      <Animated.View
        entering={FadeInUp
          .delay(delay + 100)
          .springify()
          .mass(0.5)}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
