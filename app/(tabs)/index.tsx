import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getUserTransactions, getUserGroups, getGroupExpenses } from '@/services/firebaseService';
import { Transaction, Expense } from '@/services/firebaseService';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

type RecentActivity = {
  id: string;
  type: 'expense' | 'transaction';
  description: string;
  amount: number;
  date: Date;
  groupId?: string;
  groupName?: string;
}

export default function HomeScreen() {
  const { user, signOut, loading } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const router = useRouter();
  const themeColors = useColorScheme();

  useEffect(() => {
    if (user?.uid) {
      fetchRecentActivities();
    } else {
      setActivities([]);
      setLoadingActivities(false);
    }
  }, [user]);

  const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true);
      
      // Get user transactions
      const transactions = await getUserTransactions(user!.uid);
      
      // Get user groups and their expenses
      const groups = await getUserGroups(user!.uid);
      let allExpenses: Expense[] = [];
      
      for (const group of groups) {
        const expenses = await getGroupExpenses(group.id);
        allExpenses = [...allExpenses, ...expenses];
      }
      
      // Combine and sort activities
      const combinedActivities: RecentActivity[] = [
        ...transactions.map(tx => ({
          id: tx.id,
          type: 'transaction' as const,
          description: tx.payer === user!.uid ? 'You owe money' : 'Money owed to you',
          amount: tx.amount,
          date: tx.createdAt.toDate(),
          groupId: tx.groupId
        })),
        ...allExpenses.map(expense => ({
          id: expense.id,
          type: 'expense' as const,
          description: expense.description,
          amount: expense.amount,
          date: expense.createdAt.toDate(),
          groupId: expense.groupId,
          groupName: groups.find(g => g.id === expense.groupId)?.name
        }))
      ];
      
      // Sort by date (newest first) and limit to 5
      combinedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
      setActivities(combinedActivities.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const navigateToActivity = (activity: RecentActivity) => {
    if (activity.type === 'expense') {
      router.push(`/expenses/${activity.id}`);
    } else {
      // For transactions, we might want to go to a settlement screen or the group
      if (activity.groupId) {
        router.push(`/groups/${activity.groupId}`);
      }
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

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
          <View style={[styles.card, { borderColor: themeColors.border }]}>
            <ThemedText type="defaultSemiBold">Recent Activities</ThemedText>
            
            {loadingActivities ? (
              <ActivityIndicator style={styles.activitiesLoader} color={themeColors.primary} />
            ) : activities.length > 0 ? (
              <View style={styles.activitiesContainer}>
                {activities.map(activity => (
                  <TouchableOpacity 
                    key={`${activity.type}-${activity.id}`}
                    style={[styles.activityItem, { borderBottomColor: themeColors.border + '66' }]}
                    onPress={() => navigateToActivity(activity)}
                  >
                    <View style={styles.activityInfo}>
                      <ThemedText style={styles.activityDescription}>
                        {activity.description}
                      </ThemedText>
                      <ThemedText style={styles.activityDetails}>
                        {activity.groupName && `${activity.groupName} • `}
                        {formatDate(activity.date)}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.activityAmount}>
                      {formatCurrency(activity.amount)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
                
                <Button 
                  onPress={() => router.push('/(tabs)/groups')}
                  variant="ghost"
                  style={styles.viewAllButton}
                >
                  View All Groups
                </Button>
              </View>
            ) : (
              <ThemedText style={styles.placeholder}>
                No recent activities to show
              </ThemedText>
            )}
          </View>

          <View style={[styles.card, { borderColor: themeColors.border }]}>
            <ThemedText type="defaultSemiBold">Quick Actions</ThemedText>
            <View style={styles.quickActions}>
              <Button 
                onPress={() => router.push('/groups/create')}
                style={styles.quickActionButton}
                variant="outline"
              >
                <View style={styles.quickActionContent}>
                  <FontAwesome name="users" size={18} color={themeColors.primary} />
                  <ThemedText style={styles.quickActionText}>Create Group</ThemedText>
                </View>
              </Button>

              <Button 
                onPress={() => router.push('/theme-showcase')}
                style={styles.quickActionButton}
                variant="outline"
              >
                <View style={styles.quickActionContent}>
                  <FontAwesome name="paint-brush" size={18} color={themeColors.primary} />
                  <ThemedText style={styles.quickActionText}>Theme Settings</ThemedText>
                </View>
              </Button>

              <Button 
                onPress={() => {
                  if (user?.uid) {
                    fetchRecentActivities();
                  }
                }}
                style={styles.quickActionButton}
                variant="outline"
              >
                <View style={styles.quickActionContent}>
                  <FontAwesome name="refresh" size={18} color={themeColors.primary} />
                  <ThemedText style={styles.quickActionText}>Refresh</ThemedText>
                </View>
              </Button>
              
              <Button 
                onPress={handleSignOut}
                variant="destructive"
                style={styles.signOutButton}
              >
                Sign Out
              </Button>
            </View>
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
  activitiesLoader: {
    marginVertical: 20,
  },
  activitiesContainer: {
    marginTop: 8,
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontWeight: '500',
  },
  activityDetails: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  activityAmount: {
    fontWeight: '600',
    marginLeft: 16,
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  quickActions: {
    gap: 12,
    marginTop: 4,
  },
  quickActionButton: {
    marginTop: 0,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    marginLeft: 4,
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
