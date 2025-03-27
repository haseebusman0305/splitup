import { createContext, useContext, useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithCredential,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { createUserProfile } from '@/services/firebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User as FirestoreUser } from '@/services/firebaseService';

WebBrowser.maybeCompleteAuthSession();

type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  profilePicture?: string;
  firestoreData?: FirestoreUser | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, profilePicture?: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<any>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  googleSignIn: async () => null,
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    redirectUri: "com.splitupandroid.app:/oauth2redirect",  
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google Auth Response:', response);
      const { authentication } = response;
      handleGoogleResponse(authentication).catch(error => {
        console.error('Failed to handle Google response:', error);
      });
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [response]);

  const handleGoogleResponse = async (authentication: any): Promise<User> => {
    try {
      if (!authentication?.idToken) {
        throw new Error('No ID token present in Google response');
      }

      const credential = GoogleAuthProvider.credential(
        authentication.idToken,
        authentication.accessToken
      );

      const userCredential = await signInWithCredential(auth, credential);
      const { uid, email, displayName, photoURL } = userCredential.user;
      
      // Check if user exists in Firestore, create if not
      await ensureFirestoreUser(uid, {
        name: displayName || '',
        email: email || '',
        profilePicture: photoURL || '',
      });
      
      // Get updated user data from Firestore
      const firestoreData = await getUserFromFirestore(uid);

      const userData: User = {
        uid,
        email,
        displayName,
        profilePicture: photoURL || undefined,
        firestoreData,
      };

      await AsyncStorage.setItem('googleAccessToken', authentication.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Error handling Google response:', error);
      throw error;
    }
  };

  // Get user data from Firestore
  const getUserFromFirestore = async (uid: string): Promise<FirestoreUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return null;
    }
  };

  // Create or update user in Firestore
  const ensureFirestoreUser = async (
    uid: string, 
    userData: { name: string; email: string; profilePicture?: string }
  ): Promise<void> => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user
        await createUserProfile(uid, {
          id: uid,
          name: userData.name,
          email: userData.email,
          profilePicture: userData.profilePicture,
          groups: [],
        });
      }
    } catch (error) {
      console.error('Error ensuring user in Firestore:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkStoredUser();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            const { uid, email, displayName, photoURL } = firebaseUser;
            
            // Get user data from Firestore
            const firestoreData = await getUserFromFirestore(uid);
            
            const userData: User = {
              uid,
              email,
              displayName,
              profilePicture: photoURL || undefined,
              firestoreData,
            };
            
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            await AsyncStorage.removeItem('user');
          }
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking stored user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, photoURL } = userCredential.user;
      
      // Get user data from Firestore
      const firestoreData = await getUserFromFirestore(uid);
      
      // Update the user state with Firestore data
      const userData: User = {
        uid,
        email,
        displayName,
        profilePicture: photoURL || undefined,
        firestoreData,
      };
      
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, profilePicture?: string) => {
    try {
      // Create user in Firebase Auth
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name and profile picture if available
      await updateProfile(firebaseUser, { 
        displayName: name,
        photoURL: profilePicture
      });
      
      // Create user in Firestore
      await createUserProfile(firebaseUser.uid, {
        id: firebaseUser.uid,
        name: name,
        email: email,
        profilePicture: profilePicture,
        groups: [],
      });
      
      // Get updated user data from Firestore
      const firestoreData = await getUserFromFirestore(firebaseUser.uid);
      
      // Update the user state with Firestore data
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        profilePicture,
        firestoreData,
      };
      
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('googleAccessToken');
      setUser(null);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await promptAsync();    
      if (result?.type !== 'success') {
        console.log('Sign in was not successful:', result);
        return null;
      }
      const userData = await handleGoogleResponse(result.authentication);
      return userData;
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
      throw error;
    }
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user || !user.uid) throw new Error('No authenticated user');
      
      // Update Firebase Auth profile if name or profile picture changed
      if (data.displayName || data.profilePicture) {
        await updateProfile(auth.currentUser!, {
          displayName: data.displayName || undefined,
          photoURL: data.profilePicture || undefined,
        });
      }
      
      // Update user in Firestore
      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {};
      
      if (data.displayName) updateData.name = data.displayName;
      if (data.profilePicture) updateData.profilePicture = data.profilePicture;
      
      if (Object.keys(updateData).length > 0) {
        await setDoc(userRef, updateData, { merge: true });
      }
      
      // Get updated user data from Firestore
      const firestoreData = await getUserFromFirestore(user.uid);
      
      // Update local state
      const updatedUser = { 
        ...user, 
        ...data,
        firestoreData 
      };
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};