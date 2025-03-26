import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import * as React from 'react';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function AuthLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'slide_from_right' : 'none',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </OnboardingProvider>
  );
}
