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
import { auth } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type User = {
  displayName: string | null;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  googleSignIn: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    redirectUri: "com.splitupandroid.app:/oauth2redirect",  
  });

  useEffect(() => {
    console.log(response,"response")
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
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkStoredUser();
        const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
          if (user) {
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
    } catch (error: any) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
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

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};