import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { getUserGroups, Group } from '@/services/firebaseService';

const { width } = Dimensions.get('window');

export default function GroupsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserGroups();
    } else {
      setGroups([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await getUserGroups(user!.uid);
      setGroups(userGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
  };

  const handleOpenGroup = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title">Your Groups</ThemedText>
          <ThemedText style={styles.subtitle}>
            Create and manage your expense groups
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Active Groups</ThemedText>
            
            {loading ? (
              <ThemedText style={styles.placeholder}>Loading groups...</ThemedText>
            ) : groups.length > 0 ? (
              groups.map((group) => (
                <Button 
                  key={group.id}
                  onPress={() => handleOpenGroup(group.id)}
                  variant="outline"
                  style={styles.groupButton}
                >
                  {group.name}
                </Button>
              ))
            ) : (
              <ThemedText style={styles.placeholder}>
                No active groups to show
              </ThemedText>
            )}
            
            <Button 
              onPress={handleCreateGroup}
              style={styles.createButton}
            >
              Create New Group
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
  createButton: {
    marginTop: 8,
  },
  groupButton: {
    marginVertical: 4,
  },
});
