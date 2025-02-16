
import { useState } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

const { width, height } = Dimensions.get("window")

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    try {
      setLoading(true)
      await signUp(email, password, name)
      router.replace("/(tabs)")
    } catch (error: any) {
      console.error("Registration error:", error.message)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <ThemedText style={styles.title} bold>Create Account</ThemedText>
            </View>

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
})

