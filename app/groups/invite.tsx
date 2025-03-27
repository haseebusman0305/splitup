import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { inviteUserToGroup } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';

type InviteeType = {
  id: string;
  email: string;
};

export default function InviteMembersScreen() {
  const { groupId, groupName } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [invitees, setInvitees] = useState<InviteeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const addInvitee = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (invitees.some(invitee => invitee.email === email.trim())) {
      setError('This email is already added');
      return;
    }

    setInvitees([...invitees, { id: Date.now().toString(), email: email.trim() }]);
    setEmail('');
    setError('');
  };

  const removeInvitee = (id: string) => {
    setInvitees(invitees.filter(invitee => invitee.id !== id));
  };

  const handleInviteMembers = async () => {
    if (!groupId) {
      setError('Group ID is missing');
      return;
    }

    if (!user?.uid) {
      setError('You need to be logged in');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Invite all members
      await Promise.all(
        invitees.map(invitee => 
          inviteUserToGroup(groupId as string, invitee.email, user.uid)
        )
      );
      
      setSubmitSuccess(true);
      setTimeout(() => {
        // Navigate back to groups
        router.replace('/(tabs)/groups');
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'Failed to invite members');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipInvitation = () => {
    router.replace('/(tabs)/groups');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Invite Members' }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ThemedText type="title">Invite Members</ThemedText>
          <ThemedText style={styles.subtitle}>
            Add members to "{groupName || 'your group'}"
          </ThemedText>
        </View>

        <View style={styles.form}>
          <ThemedText style={styles.label}>Email Address</ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!isSubmitting && !submitSuccess}
            />
            <Button
              onPress={addInvitee}
              variant="outline"
              style={styles.addButton}
              disabled={isSubmitting || submitSuccess}
            >
              Add
            </Button>
          </View>
          
          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
          
          {invitees.length > 0 && (
            <>
              <ThemedText style={styles.listHeader}>Invitees</ThemedText>
              <FlatList
                data={invitees}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.inviteeItem}>
                    <ThemedText>{item.email}</ThemedText>
                    <TouchableOpacity onPress={() => removeInvitee(item.id)}>
                      <FontAwesome name="times" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.inviteesList}
              />
            </>
          )}
          
          {submitSuccess ? (
            <View style={styles.successMessage}>
              <FontAwesome name="check-circle" size={24} color="green" />
              <ThemedText style={styles.successText}>
                Group created successfully!
              </ThemedText>
            </View>
          ) : (
            <>
              <Button 
                onPress={handleInviteMembers}
                style={styles.button}
                disabled={isSubmitting || invitees.length === 0}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : 'Send Invitations'}
              </Button>
              
              <Button 
                onPress={skipInvitation}
                variant="outline"
                style={styles.skipButton}
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>
            </>
          )}
        </View>
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
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 16,
  },
  addButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 45,
    paddingHorizontal: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  listHeader: {
    marginTop: 16,
    fontWeight: '500',
  },
  inviteesList: {
    maxHeight: 200,
    marginTop: 8,
  },
  inviteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  skipButton: {
    marginTop: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  successText: {
    color: 'green',
    fontWeight: '500',
  }
});
