import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function Index() {
  const router = useRouter();
  
  // Show a loading indicator and redirect to splash
  useEffect(() => {
    // Small delay to ensure contexts are initialized
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
