import { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { addGroup } from '@/services/firebaseService';
import { Stack } from 'expo-router';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (!user?.uid) {
      setError('You need to be logged in');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Create the group
      const groupId = await addGroup(groupName.trim(), user.uid);
      
      if (groupId) {
        // Navigate to the invite members screen
        router.push({
          pathname: '/groups/invite',
          params: { groupId, groupName: groupName.trim() }
        });
      } else {
        setError('Failed to create group');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Create Group' }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title">Create New Group</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter a name for your group and invite members
            </ThemedText>
          </View>

          <View style={styles.form}>
            <ThemedText style={styles.label}>Group Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            
            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            
            <Button 
              onPress={handleCreateGroup}
              style={styles.button}
              disabled={isSubmitting || !groupName.trim()}
            >
              {isSubmitting ? <ActivityIndicator color="#ffffff" /> : 'Continue to Add Members'}
            </Button>
            
            <Button 
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  form: {
    padding: 20,
    gap: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  button: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
});
