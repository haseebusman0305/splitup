import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getGroupDetails, Group, getGroupExpenses, Expense } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersCount, setMembersCount] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchGroupData();
    }
  }, [id]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const groupData = await getGroupDetails(id as string);
      
      if (groupData) {
        setGroup(groupData);
        setMembersCount(groupData.members.length);
        
        // Fetch expenses for this group
        const groupExpenses = await getGroupExpenses(id as string);
        setExpenses(groupExpenses);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
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

  const handleInviteMembers = () => {
    router.push({
      pathname: '/groups/invite',
      params: { groupId: id, groupName: group?.name }
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading group details...</ThemedText>
      </ThemedView>
    );
  }

  if (!group) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <FontAwesome name="exclamation-circle" size={40} color="red" />
        <ThemedText style={styles.errorText}>Group not found or access denied</ThemedText>
        <Button 
          onPress={() => router.replace('/(tabs)/groups')}
          style={styles.backButton}
        >
          Return to Groups
        </Button>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: group.name,
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('Settings')} style={styles.headerButton}>
            <FontAwesome name="cog" size={22} color="#007AFF" />
          </TouchableOpacity>
        ),
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.groupInfo}>
            <View style={styles.nameContainer}>
              <ThemedText type="title">{group.name}</ThemedText>
              <ThemedText style={styles.subtitle}>
                {membersCount} {membersCount === 1 ? 'Member' : 'Members'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button 
              onPress={handleAddExpense}
              style={styles.addButton}
            >
              Add Expense
            </Button>
            
            <Button 
              onPress={handleInviteMembers}
              variant="outline"
              style={styles.inviteButton}
            >
              Invite Members
            </Button>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Recent Expenses</ThemedText>
            
            {expenses.length > 0 ? (
              <View style={styles.expensesList}>
                {expenses.slice(0, 5).map((expense) => (
                  <TouchableOpacity 
                    key={expense.id} 
                    style={styles.expenseItem}
                    onPress={() => router.push(`/expenses/${expense.id}`)}
                  >
                    <View>
                      <ThemedText style={styles.expenseName}>{expense.description}</ThemedText>
                      <ThemedText style={styles.expenseDate}>
                        {expense.createdAt.toDate().toLocaleDateString()}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.expenseAmount}>
                      {formatCurrency(expense.amount)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
                
                {expenses.length > 5 && (
                  <Button 
                    onPress={() => router.push(`/groups/${id}/expenses`)}
                    variant="ghost"
                    style={styles.viewAllButton}
                  >
                    View All Expenses
                  </Button>
                )}
              </View>
            ) : (
              <ThemedText style={styles.placeholder}>
                No expenses to show
              </ThemedText>
            )}
          </View>
          
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Group Balance</ThemedText>
            {/* This would typically show balance calculations */}
            <ThemedText style={styles.placeholder}>
              Balance information will appear here
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
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  actionButtons: {
    gap: 10,
    marginTop: 10,
  },
  addButton: {
    marginBottom: 0,
  },
  inviteButton: {
    marginTop: 0,
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
  expensesList: {
    marginTop: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expenseName: {
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  expenseAmount: {
    fontWeight: '500',
  },
  viewAllButton: {
    alignSelf: 'center',
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
