import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fonts } from '@/config/fonts';
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const themeColors = useColorScheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}>
      <Stack.Screen name="splash"/>
      <Stack.Screen 
        name="auth" 
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="(tabs)"
        options={{
          animation: 'fade',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Slot />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <OnboardingProvider>
          <GestureHandlerRootView style={styles.container}>
            <AppWithNavigation />
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppWithNavigation() {
  const themeColors = useColorScheme();
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: themeColors.background,
      text: themeColors.text,
      primary: themeColors.primary,
      card: themeColors.card,
      border: themeColors.border,
    },
  };
  
  return (
    <NavigationThemeProvider value={customTheme}>
      <InitialLayout />
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
