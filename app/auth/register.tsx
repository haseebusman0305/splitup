import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScreenTransition } from '@/components/ScreenTransition';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Implement your registration logic here
    console.log('Register:', name, email, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemeToggle />
      <ScreenTransition>
        <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
        
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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

        <Button onPress={handleRegister} style={styles.button}>
          Sign Up
        </Button>

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <ThemedText style={styles.link}>Already have an account? Login</ThemedText>
        </TouchableOpacity>
      </ScreenTransition>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
  },
});
