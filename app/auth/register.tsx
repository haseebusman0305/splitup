import { useState } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { pickImage, uploadImageToCloudinary } from "@/services/cloudinaryService"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"

const { width, height } = Dimensions.get("window")

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { signUp } = useAuth()
  const router = useRouter()
  const theme = useColorScheme()
  const themeColors = Colors[theme]

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setProfileImage(imageUri);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      
      // Upload profile image if selected
      let profileImageUrl;
      if (profileImage) {
        const uploadResult = await uploadImageToCloudinary(profileImage);
        profileImageUrl = uploadResult?.secure_url;
      }
      
      // Register user with profile image if available
      await signUp(email, password, name, profileImageUrl);
      
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Registration error:", error.message);
      // Error is already handled by the AuthContext
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
            <View style={styles.headerContainer}>
              <ThemedText style={styles.title} bold>Create Account</ThemedText>
            </View>

            <TouchableOpacity style={styles.profileImageContainer} onPress={handlePickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: themeColors.secondary + '66', borderColor: themeColors.border }]}>
                  <ThemedText>Add Photo</ThemedText>
                </View>
              )}
            </TouchableOpacity>

            <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />

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

            <Button onPress={handleRegister} style={styles.button} disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.link}>Already have an account? Login</ThemedText>
              </TouchableOpacity>
            </Link>
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
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
})

