import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  Switch,
  TouchableOpacity
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { addExpense, getGroupDetails, Group } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';

export default function CreateExpenseScreen() {
  const { groupId } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [group, setGroup] = useState<Group | null>(null);
  const [splitEqually, setSplitEqually] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const groupData = await getGroupDetails(groupId as string);
      if (groupData) {
        setGroup(groupData);
      } else {
        setError('Group not found');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError('Failed to load group details');
    }
  };

  const handleAddExpense = async () => {
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!groupId || !user?.uid) {
      setError('Missing required information');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // For now, we'll split the expense among all group members
      // In a more advanced implementation, we would allow selecting specific members
      const splitAmong = group?.members || [];
      
      if (splitAmong.length === 0) {
        setError('No members to split with');
        setIsSubmitting(false);
        return;
      }

      const expenseId = await addExpense(
        groupId as string,
        description.trim(),
        Number(amount),
        user.uid,
        splitAmong
      );
      
      if (expenseId) {
        // Navigate back to the group details
        router.replace(`/groups/${groupId}`);
      } else {
        setError('Failed to add expense');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Expense' }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title">Add New Expense</ThemedText>
            <ThemedText style={styles.subtitle}>
              {group ? `For "${group.name}"` : 'Loading group...'}
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="What was this expense for?"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="sentences"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Amount</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.toggleContainer}>
                <ThemedText style={styles.label}>Split equally</ThemedText>
                <Switch
                  value={splitEqually}
                  onValueChange={setSplitEqually}
                  disabled={isSubmitting}
                />
              </View>
              <ThemedText style={styles.helpText}>
                {splitEqually 
                  ? 'The expense will be split equally among all group members' 
                  : 'You can customize how the expense is split'}
              </ThemedText>
            </View>

            {!splitEqually && (
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Custom split (coming soon)</ThemedText>
                <ThemedText style={styles.helpText}>
                  This feature is not yet available. The expense will be split equally.
                </ThemedText>
              </View>
            )}
            
            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            
            <Button 
              onPress={handleAddExpense}
              style={styles.button}
              disabled={isSubmitting || !description.trim() || !amount}
            >
              {isSubmitting ? <ActivityIndicator color="#ffffff" /> : 'Add Expense'}
            </Button>
            
            <Button 
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
              disabled={isSubmitting}
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
    gap: 16,
  },
  formGroup: {
    gap: 4,
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
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
