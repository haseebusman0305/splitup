import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemeToggle style={styles.themeToggle} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title">Welcome, {user?.displayName || 'User'}!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your expenses and split bills with friends
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Recent Activities</ThemedText>
            <ThemedText style={styles.placeholder}>
              No recent activities to show
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Quick Actions</ThemedText>
            <Button 
              onPress={handleSignOut}
              variant="destructive"
              style={styles.signOutButton}
            >
              Sign Out
            </Button>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 12,
  },
  placeholder: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  signOutButton: {
    marginTop: 8,
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
