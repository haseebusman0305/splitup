import { db } from '@/config/firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, query, 
  where, addDoc, Timestamp, updateDoc, arrayUnion, 
  writeBatch, DocumentReference
} from 'firebase/firestore';
import { Alert } from 'react-native';

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  groups: string[];
};

export type Group = {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  expenses: string[];
  createdAt?: Timestamp;
};

export type Expense = {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string[];
  splitAmong: string[];
  createdAt: Timestamp;
};

export type Transaction = {
  id: string;
  payer: string;
  payee: string;
  amount: number;
  groupId: string;
  expenseId: string;
  settled: boolean;
  createdAt: Timestamp;
};

export type Invitation = {
  id: string;
  groupId: string;
  groupName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
};

// Firestore collections references
const usersCollection = collection(db, 'users');
const groupsCollection = collection(db, 'groups');
const expensesCollection = collection(db, 'expenses');
const transactionsCollection = collection(db, 'transactions');
const invitationsCollection = collection(db, 'invitations');

// Error handling wrapper
const handleFirebaseError = (operation: string) => (error: any) => {
  console.error(`Error during ${operation}:`, error);
  Alert.alert('Error', `Failed to ${operation.toLowerCase()}. ${error.message}`);
  throw error;
};

/**
 * Creates a new user document in Firestore
 */
export const createUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await setDoc(userRef, {
      id: userId,
      name: userData.name || '',
      email: userData.email || '',
      profilePicture: userData.profilePicture || '',
      groups: [],
      createdAt: Timestamp.now()
    }, { merge: true });
    
  } catch (error) {
    handleFirebaseError('creating user profile')(error);
  }
};

/**
 * Updates a user's profile information
 */
export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await setDoc(userRef, profileData, { merge: true });
  } catch (error) {
    handleFirebaseError('updating user profile')(error);
  }
};

/**
 * Adds a new group and updates the user's groups array
 */
export const addGroup = async (groupName: string, userId: string): Promise<string> => {
  const batch = writeBatch(db);
  
  try {
    // Create new group
    const groupRef = doc(groupsCollection);
    const groupId = groupRef.id;
    
    const newGroup: Group = {
      id: groupId,
      name: groupName,
      createdBy: userId,
      members: [userId],
      expenses: [],
      createdAt: Timestamp.now()
    };
    
    batch.set(groupRef, newGroup);
    
    // Update user's groups array
    const userRef = doc(usersCollection, userId);
    batch.update(userRef, {
      groups: arrayUnion(groupId)
    });
    
    await batch.commit();
    return groupId;
    
  } catch (error) {
    handleFirebaseError('adding group')(error);
    return '';
  }
};

/**
 * Adds a new expense to a group and creates corresponding transactions
 */
export const addExpense = async (
  groupId: string, 
  description: string,
  amount: number, 
  paidBy: string, 
  splitAmong: string[]
): Promise<string> => {
  const batch = writeBatch(db);
  
  try {
    // Validate inputs
    if (!groupId || amount <= 0 || !paidBy || splitAmong.length === 0) {
      throw new Error('Invalid expense data');
    }
    
    // Create new expense
    const expenseRef = doc(expensesCollection);
    const expenseId = expenseRef.id;
    
    const newExpense: Expense = {
      id: expenseId,
      groupId,
      description,
      amount,
      paidBy: [paidBy],
      splitAmong,
      createdAt: Timestamp.now()
    };
    
    batch.set(expenseRef, newExpense);
    
    // Update group with new expense
    const groupRef = doc(groupsCollection, groupId);
    batch.update(groupRef, {
      expenses: arrayUnion(expenseId)
    });
    
    // Calculate split amount and create transactions
    const splitAmount = amount / splitAmong.length;
    
    for (const memberId of splitAmong) {
      if (memberId !== paidBy) {
        const transactionRef = doc(transactionsCollection);
        const newTransaction: Transaction = {
          id: transactionRef.id,
          payer: memberId,
          payee: paidBy,
          amount: splitAmount,
          groupId,
          expenseId,
          settled: false,
          createdAt: Timestamp.now()
        };
        
        batch.set(transactionRef, newTransaction);
      }
    }
    
    await batch.commit();
    return expenseId;
    
  } catch (error) {
    handleFirebaseError('adding expense')(error);
    return '';
  }
};

/**
 * Gets all groups a user is a member of
 */
export const getUserGroups = async (userId: string): Promise<Group[]> => {
  try {
    const userDoc = await getDoc(doc(usersCollection, userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    const userGroups: Group[] = [];
    
    // If user has no groups, return empty array
    if (!userData.groups || userData.groups.length === 0) {
      return userGroups;
    }
    
    // Get all groups the user is a member of
    for (const groupId of userData.groups) {
      const groupDoc = await getDoc(doc(groupsCollection, groupId));
      if (groupDoc.exists()) {
        userGroups.push(groupDoc.data() as Group);
      }
    }
    
    return userGroups;
    
  } catch (error) {
    handleFirebaseError('fetching user groups')(error);
    return [];
  }
};

/**
 * Gets details for a specific group
 */
export const getGroupDetails = async (groupId: string): Promise<Group | null> => {
  try {
    const groupDoc = await getDoc(doc(groupsCollection, groupId));
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    
    return groupDoc.data() as Group;
    
  } catch (error) {
    handleFirebaseError('fetching group details')(error);
    return null;
  }
};

/**
 * Gets all expenses for a specific group
 */
export const getGroupExpenses = async (groupId: string): Promise<Expense[]> => {
  try {
    const groupExpensesQuery = query(expensesCollection, where('groupId', '==', groupId));
    const expenseSnapshot = await getDocs(groupExpensesQuery);
    
    const expenses: Expense[] = [];
    expenseSnapshot.forEach(doc => {
      expenses.push(doc.data() as Expense);
    });
    
    return expenses;
    
  } catch (error) {
    handleFirebaseError('fetching group expenses')(error);
    return [];
  }
};

/**
 * Gets all transactions for a user in a specific group
 */
export const getUserTransactions = async (userId: string, groupId?: string): Promise<Transaction[]> => {
  try {
    let transactionQuery;
    
    if (groupId) {
      // Get transactions for a specific group
      transactionQuery = query(
        transactionsCollection, 
        where('groupId', '==', groupId),
        where('settled', '==', false)
      );
    } else {
      // Get all user transactions across groups
      transactionQuery = query(
        transactionsCollection,
        where('settled', '==', false)
      );
    }
    
    const transactionSnapshot = await getDocs(transactionQuery);
    
    const transactions: Transaction[] = [];
    transactionSnapshot.forEach(doc => {
      const transaction = doc.data() as Transaction;
      if (transaction.payer === userId || transaction.payee === userId) {
        transactions.push(transaction);
      }
    });
    
    return transactions;
    
  } catch (error) {
    handleFirebaseError('fetching user transactions')(error);
    return [];
  }
};

/**
 * Settles a transaction
 */
export const settleTransaction = async (transactionId: string): Promise<void> => {
  try {
    const transactionRef = doc(transactionsCollection, transactionId);
    await updateDoc(transactionRef, {
      settled: true,
      settledAt: Timestamp.now()
    });
    
  } catch (error) {
    handleFirebaseError('settling transaction')(error);
  }
};

/**
 * Invites a user to join a group
 */
export const inviteUserToGroup = async (
  groupId: string,
  inviteeEmail: string,
  inviterId: string
): Promise<string> => {
  try {
    // Check if the group exists
    const groupDoc = await getDoc(doc(groupsCollection, groupId));
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupDoc.data() as Group;
    
    // Check if the inviter is a member of the group
    if (!groupData.members.includes(inviterId)) {
      throw new Error('You are not authorized to invite members to this group');
    }
    
    // Check if the user is already in the group
    const existingUserQuery = query(usersCollection, where('email', '==', inviteeEmail));
    const existingUserDocs = await getDocs(existingUserQuery);
    
    let existingUserId: string | null = null;
    
    existingUserDocs.forEach(doc => {
      const userData = doc.data() as User;
      if (userData.groups && userData.groups.includes(groupId)) {
        existingUserId = doc.id;
      }
    });
    
    if (existingUserId) {
      throw new Error('This user is already a member of this group');
    }
    
    // Get inviter details
    const inviterDoc = await getDoc(doc(usersCollection, inviterId));
    if (!inviterDoc.exists()) {
      throw new Error('Inviter not found');
    }
    
    const inviterData = inviterDoc.data() as User;
    
    // Create invitation
    const invitationRef = doc(invitationsCollection);
    const invitationId = invitationRef.id;
    
    const newInvitation: Invitation = {
      id: invitationId,
      groupId,
      groupName: groupData.name,
      inviterEmail: inviterData.email,
      inviteeEmail,
      status: 'pending',
      createdAt: Timestamp.now()
    };
    
    await setDoc(invitationRef, newInvitation);
    
    // If the invitee already has an account, add to their pending invitations
    if (existingUserId) {
      // This would typically trigger a notification or update a pending invitations list
      // For now, we'll just log it
      console.log(`Invitation sent to existing user: ${existingUserId}`);
    }
    
    return invitationId;
    
  } catch (error) {
    handleFirebaseError('inviting user to group')(error);
    return '';
  }
};

/**
 * Gets all pending invitations for a user
 */
export const getUserInvitations = async (userEmail: string): Promise<Invitation[]> => {
  try {
    const invitationsQuery = query(
      invitationsCollection, 
      where('inviteeEmail', '==', userEmail),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(invitationsQuery);
    
    const invitations: Invitation[] = [];
    snapshot.forEach(doc => {
      invitations.push(doc.data() as Invitation);
    });
    
    return invitations;
    
  } catch (error) {
    handleFirebaseError('fetching user invitations')(error);
    return [];
  }
};

/**
 * Accepts a group invitation
 */
export const acceptGroupInvitation = async (
  invitationId: string,
  userId: string
): Promise<void> => {
  const batch = writeBatch(db);
  
  try {
    const invitationRef = doc(invitationsCollection, invitationId);
    const invitationDoc = await getDoc(invitationRef);
    
    if (!invitationDoc.exists()) {
      throw new Error('Invitation not found');
    }
    
    const invitation = invitationDoc.data() as Invitation;
    
    if (invitation.status !== 'pending') {
      throw new Error('This invitation is no longer pending');
    }
    
    // Update the invitation status
    batch.update(invitationRef, {
      status: 'accepted'
    });
    
    // Add user to group members
    const groupRef = doc(groupsCollection, invitation.groupId);
    batch.update(groupRef, {
      members: arrayUnion(userId)
    });
    
    // Add group to user's groups
    const userRef = doc(usersCollection, userId);
    batch.update(userRef, {
      groups: arrayUnion(invitation.groupId)
    });
    
    await batch.commit();
    
  } catch (error) {
    handleFirebaseError('accepting invitation')(error);
  }
};

/**
 * Rejects a group invitation
 */
export const rejectGroupInvitation = async (invitationId: string): Promise<void> => {
  try {
    const invitationRef = doc(invitationsCollection, invitationId);
    
    // Update the invitation status
    await updateDoc(invitationRef, {
      status: 'rejected'
    });
    
  } catch (error) {
    handleFirebaseError('rejecting invitation')(error);
  }
};
