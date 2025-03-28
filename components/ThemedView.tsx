import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export function ThemedView(props: ViewProps) {
  const themeColors = useColorScheme();
  
  return (
    <View 
      style={[
        { backgroundColor: themeColors.background },
        props.style,
      ]}
      {...props}
    />
  );
}
