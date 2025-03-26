import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                <ThemedText type="title">
                  {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText type="title" style={styles.userName}>
            {user?.displayName || 'User'}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.email || 'No email provided'}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Account Settings</ThemedText>
            <Button 
              onPress={() => console.log('Edit profile pressed')}
              style={styles.profileButton}
            >
              Edit Profile
            </Button>
            
            <Button 
              onPress={() => console.log('Change password pressed')}
              style={styles.profileButton}
              variant="outline"
            >
              Change Password
            </Button>
          </View>

          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Preferences</ThemedText>
            <Button 
              onPress={() => console.log('Notification settings pressed')}
              style={styles.profileButton}
              variant="outline"
            >
              Notification Settings
            </Button>
          </View>
          
          <Button 
            onPress={handleSignOut}
            variant="destructive"
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
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
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    marginTop: 8,
  },
  userEmail: {
    marginTop: 4,
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
  profileButton: {
    marginTop: 8,
  },
  signOutButton: {
    marginTop: 8,
  },
});
