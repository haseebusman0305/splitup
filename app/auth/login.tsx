import { useState, useEffect } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native"
import { Link } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { TextInput } from "@/components/ui/TextInput"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window")

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, googleSignIn, user, signOut } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      setLoading(true)
      await signIn(email, password)
      router.replace("/(tabs)")
    } catch (error: any) {
      console.error("Login error:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const response = await googleSignIn();
      if (response) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.replace('/auth/login');
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {user ? (
              <View style={styles.userInfoContainer}>
                {user.profilePicture ? (
                  <Image 
                    source={{ uri: user.profilePicture }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <View style={[styles.profileImage, styles.profilePlaceholder]}>
                    <ThemedText style={styles.profilePlaceholderText}>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </ThemedText>
                  </View>
                )}
                <ThemedText style={styles.userName} bold>
                  {user.displayName || 'User'}
                </ThemedText>
                <ThemedText style={styles.userEmail}>
                  {user.email}
                </ThemedText>
                
                {user.firestoreData && (
                  <View style={styles.firestoreDataContainer}>
                    <ThemedText style={styles.firestoreDataTitle} bold>
                      Account Information
                    </ThemedText>
                    <ThemedText style={styles.firestoreDataText}>
                      Groups: {user.firestoreData.groups?.length || 0}
                    </ThemedText>
                    {/* Additional Firestore data can be displayed here */}
                  </View>
                )}
                
                <Button 
                  onPress={handleLogout}
                  variant="destructive" 
                  style={[styles.button, styles.logoutButton]}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Log Out"}
                </Button>
                
                <Button 
                  onPress={() => router.replace('/(tabs)')}
                  style={[styles.button, styles.continueButton]}
                >
                  Continue to App
                </Button>
              </View>
            ) : (
              <>
                <View style={styles.headerContainer}>
                  <ThemedText style={styles.title} bold>Welcome Back</ThemedText>
                </View>

                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
              
                <Button onPress={handleLogin} style={styles.button} disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <Button 
                  onPress={handleGoogleLogin} 
                  variant="outline" 
                  style={styles.button}
                  disabled={loading}
                >
                  Continue with Google
                </Button>

                <Link href="/auth/register" asChild>
                  <TouchableOpacity>
                    <ThemedText style={styles.link}>Don't have an account? Register</ThemedText>
                  </TouchableOpacity>
                </Link>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ThemeToggle style={styles.themeToggle} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 60,
  },
  content: {
    width: Math.min(width * 0.9, 400),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    width: "100%",
  },
  button: {
    marginTop: 8,
    height: 50,
    width: "100%",
  },
  link: {
    textAlign: "center",
    marginTop: 20,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#dc2626', // red color for logout
  },
  continueButton: {
    marginTop: 12,
  },
  userInfoContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profilePlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
    color: '#6b7280',
  },
  firestoreDataContainer: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  firestoreDataTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  firestoreDataText: {
    fontSize: 14,
    marginBottom: 4,
  },
})

