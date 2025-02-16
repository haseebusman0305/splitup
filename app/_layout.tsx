import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fonts } from '@/config/fonts';
import { AuthProvider } from '@/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    const inSplashGroup = segments[0] === 'splash';
    
    if (!isAuthenticated && !inAuthGroup && !inSplashGroup) {
      router.replace('/splash');
    } else if (isAuthenticated && (inAuthGroup || inSplashGroup)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  if (!fontsLoaded) {
    return <Slot />;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
              },
            }}>
            <Stack.Screen name="splash" />
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
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
