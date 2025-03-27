import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupDetails, getGroupExpenses, Group, Expense } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';

export default function GroupExpensesScreen() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchExpensesData();
    }
  }, [id]);

  const fetchExpensesData = async () => {
    try {
      setLoading(true);
      
      // Get group details
      const groupData = await getGroupDetails(id as string);
      setGroup(groupData);
      
      // Get expenses for this group
      if (groupData) {
        const groupExpenses = await getGroupExpenses(id as string);
        // Sort expenses by date, newest first
        groupExpenses.sort((a, b) => 
          b.createdAt.toMillis() - a.createdAt.toMillis()
        );
        setExpenses(groupExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    router.push({
      pathname: '/expenses/create',
      params: { groupId: id }
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity 
      style={styles.expenseItem}
      onPress={() => router.push(`/expenses/${item.id}`)}
    >
      <View style={styles.expenseDetails}>
        <ThemedText style={styles.expenseName}>{item.description}</ThemedText>
        <ThemedText style={styles.expenseDate}>
          {item.createdAt.toDate().toLocaleDateString()}
        </ThemedText>
      </View>
      <View style={styles.expenseAmount}>
        <ThemedText style={styles.amountText}>
          {formatCurrency(item.amount)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading expenses...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: group ? `${group.name} - Expenses` : 'Expenses',
      }} />
      
      <View style={styles.header}>
        <ThemedText type="title">All Expenses</ThemedText>
        <Button 
          onPress={handleAddExpense}
          style={styles.addButton}
        >
          Add Expense
        </Button>
      </View>
      
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ThemedText style={styles.placeholder}>No expenses found</ThemedText>
          }
          ListHeaderComponent={
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Total Expenses</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
                </ThemedText>
              </View>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <FontAwesome name="money" size={40} color="#ccc" />
          <ThemedText style={styles.placeholder}>No expenses yet</ThemedText>
          <ThemedText style={styles.helpText}>
            Add your first expense to start tracking
          </ThemedText>
        </View>
      )}
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
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    minWidth: 120,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '700',
    fontSize: 18,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontWeight: '500',
    fontSize: 16,
  },
  expenseDate: {
    opacity: 0.6,
    fontSize: 12,
    marginTop: 4,
  },
  expenseAmount: {
    marginLeft: 16,
  },
  amountText: {
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholder: {
    opacity: 0.5,
    fontStyle: 'italic',
    marginTop: 12,
  },
  helpText: {
    opacity: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
});
