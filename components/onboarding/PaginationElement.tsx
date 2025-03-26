import { StyleSheet, View, useWindowDimensions } from 'react-native';
import React, { useCallback } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type Props = {
  length: number;
  x: Animated.SharedValue<number>;
};

const PaginationElement = ({ length, x }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const activeColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const inactiveColor = isDark ? '#505050' : '#D0D0D0';

  const PaginationComponent = useCallback(
    ({ index }: { index: number }) => {
      const itemRnStyle = useAnimatedStyle(() => {
        const width = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [10, 35, 10],
          Extrapolate.CLAMP
        );

        const bgColor = interpolateColor(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [inactiveColor, activeColor, inactiveColor]
        );

        return {
          width,
          backgroundColor: bgColor,
        };
      }, [x]);
      return <Animated.View style={[styles.itemStyle, itemRnStyle]} />;
    },
    [activeColor, inactiveColor]
  );

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        return <PaginationComponent index={index} key={index} />;
      })}
    </View>
  );
};

export default PaginationElement;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyle: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
