import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Expense, getGroupDetails, Group } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchExpenseData();
    }
  }, [id]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch expense details
      const expenseDoc = await getDoc(doc(db, 'expenses', id as string));
      
      if (!expenseDoc.exists()) {
        setError('Expense not found');
        setLoading(false);
        return;
      }
      
      const expenseData = expenseDoc.data() as Expense;
      setExpense(expenseData);
      
      // Fetch group details
      if (expenseData.groupId) {
        const groupData = await getGroupDetails(expenseData.groupId);
        setGroup(groupData);
      }
    } catch (err) {
      console.error('Error fetching expense:', err);
      setError('Failed to load expense details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteExpense = async () => {
    // This would be implemented with proper confirmation dialog
    console.log('Delete expense:', id);
  };

  const handleEditExpense = () => {
    router.push({
      pathname: '/expenses/edit',
      params: { id }
    });
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading expense details...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !expense) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <FontAwesome name="exclamation-circle" size={40} color="red" />
        <ThemedText style={styles.errorText}>{error || 'Expense not found'}</ThemedText>
        <Button 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Expense Details',
        headerRight: () => (
          <TouchableOpacity onPress={handleEditExpense} style={styles.headerButton}>
            <FontAwesome name="pencil" size={22} color="#007AFF" />
          </TouchableOpacity>
        ),
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title">{expense.description}</ThemedText>
          <View style={styles.amountContainer}>
            <ThemedText style={styles.amountLabel}>Total</ThemedText>
            <ThemedText style={styles.amount}>{formatCurrency(expense.amount)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Details</ThemedText>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Created</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatDate(expense.createdAt)}
              </ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Group</ThemedText>
              <ThemedText 
                style={[styles.detailValue, styles.groupLink]}
                onPress={() => router.push(`/groups/${expense.groupId}`)}
              >
                {group?.name || expense.groupId}
              </ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Paid by</ThemedText>
              <ThemedText style={styles.detailValue}>
                {expense.paidBy[0] === user?.uid ? 'You' : 'Another member'}
              </ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Split among</ThemedText>
              <ThemedText style={styles.detailValue}>
                {expense.splitAmong.length} members
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Split Details</ThemedText>
            
            <ThemedText style={styles.splitDetail}>
              Each member owes: {formatCurrency(expense.amount / expense.splitAmong.length)}
            </ThemedText>
            
            {/* In a more advanced implementation, we would show exactly who owes what */}
          </View>
          
          <Button 
            onPress={handleDeleteExpense}
            variant="destructive"
            style={styles.deleteButton}
          >
            Delete Expense
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  amountContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  amountLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: '500',
  },
  groupLink: {
    color: '#007AFF',
  },
  splitDetail: {
    fontWeight: '500',
  },
  deleteButton: {
    marginTop: 10,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 20,
    color: 'red',
  },
  backButton: {
    minWidth: 150,
  },
  headerButton: {
    padding: 8,
  },
});
