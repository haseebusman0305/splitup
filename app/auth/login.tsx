import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScreenTransition } from '@/components/ScreenTransition';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Login:', email, password);
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic
    console.log('Google login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemeToggle />
      <ScreenTransition>
        <Animated.View 
          entering={FadeIn.duration(800)}
          style={styles.content}>
          <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button onPress={handleLogin} style={styles.button}>
            Sign In
          </Button>

          <Button 
            onPress={handleGoogleLogin} 
            variant="outline"
            style={styles.button}>
            Continue with Google
          </Button>

          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <ThemedText style={styles.link}>Don't have an account? Register</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScreenTransition>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: Math.min(width * 0.9, 400),
    gap: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginVertical: 8,
    height: 56,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
});
