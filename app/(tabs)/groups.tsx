import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

export default function GroupsScreen() {
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
            <ThemedText style={styles.placeholder}>
              No active groups to show
            </ThemedText>
            <Button 
              onPress={() => console.log('Create group pressed')}
              style={styles.createButton}
            >
              Create New Group
            </Button>
          </View>

          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Group Invitations</ThemedText>
            <ThemedText style={styles.placeholder}>
              No pending invitations
            </ThemedText>
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
});
