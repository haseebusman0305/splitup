import { useRouter } from 'expo-router';
import { StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import Animated, { FadeInRight, SlideInUp, FadeIn } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useOnboarding } from '@/contexts/OnboardingContext';

const { width, height } = Dimensions.get('window');

const features = [
  {
    icon: '📝',
    title: 'Track Expenses',
    description: 'Add expenses and split them among group members'
  },
  {
    icon: '⚖️',
    title: 'Fair Split',
    description: 'Split bills equally or with custom amounts'
  },
  {
    icon: '🤝',
    title: 'Settle Up',
    description: 'See who owes what and settle debts easily'
  }
];

export default function FeaturesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { setHasCompletedOnboarding } = useOnboarding();

  const handleGetStarted = async () => {
    await setHasCompletedOnboarding(true);
    router.push('/auth/login');
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(1000)}
        style={styles.content}>
        <Image 
          source={require('@/assets/images/saving.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Save Time & Money
        </ThemedText>
        <ThemedText style={styles.description}>
          Split expenses fairly and settle up with ease
        </ThemedText>
      </Animated.View>

      <Pressable 
        style={styles.nextButton} 
        onPress={handleGetStarted}>
        <ThemedText style={styles.nextText}>Get Started</ThemedText>
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
