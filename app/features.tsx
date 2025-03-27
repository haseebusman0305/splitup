import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme from the context we fixed

export default function FeaturesScreen() {
  const router = useRouter();
  const { isDark } = useTheme(); // Now safely uses the theme

  const features = [
    {
      title: 'Create Groups',
      description: 'Create expense groups for trips, roommates, and more',
      icon: 'users',
    },
    {
      title: 'Add Expenses',
      description: 'Track expenses and split them easily',
      icon: 'money',
    },
    {
      title: 'Settle Debts',
      description: 'See who owes what and settle up quickly',
      icon: 'exchange',
    },
    {
      title: 'Real-time Updates',
      description: 'All changes are synced instantly across devices',
      icon: 'refresh',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'App Features',
        headerBackTitle: 'Back'
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title">Key Features</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover what SplitUp can do for you
          </ThemedText>
        </View>

        <View style={styles.content}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.iconContainer, isDark ? styles.iconContainerDark : styles.iconContainerLight]}>
                <FontAwesome name={feature.icon as any} size={24} color={isDark ? "#FFFFFF" : "#007AFF"} />
              </View>
              <View style={styles.featureTextContainer}>
                <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </View>
            </View>
          ))}

          <Button 
            onPress={() => router.back()}
            style={styles.button}
          >
            Got It!
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    paddingVertical: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  content: {
    gap: 20,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerLight: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  iconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
  },
  featureDescription: {
    opacity: 0.7,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
  },
});
