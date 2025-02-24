import { useRouter } from 'expo-router';
import { StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext'; 
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading]);

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(1000)}
        style={styles.content}>
        <Image 
          source={require('@/assets/images/bill.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Track Your Bills
        </ThemedText>
        <ThemedText style={styles.description}>
          Easily manage and split expenses with your friends
        </ThemedText>
      </Animated.View>

      <Pressable 
        style={styles.nextButton} 
        onPress={() => router.push('/splash/features')}>
        <ThemedText style={styles.nextText}>Next</ThemedText>
        <MaterialIcons 
          name="arrow-forward-ios" 
          size={24} 
          color={isDark ? Colors.dark.primary : Colors.light.primary} 
        />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: width * 0.8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
