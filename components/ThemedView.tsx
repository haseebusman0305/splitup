import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type ThemedViewProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function ThemedView({ style, children }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return (
    <View style={[{ backgroundColor }, styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
