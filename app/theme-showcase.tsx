import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { THEMES, THEME_NAMES } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function ThemeShowcaseScreen() {
  const { themeIndex, setThemeIndex, getThemeName } = useTheme();
  const themeColors = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <Stack.Screen options={{ 
        title: 'Theme Settings',
        headerStyle: { backgroundColor: themeColors.background },
        headerTintColor: themeColors.text,
      }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ThemedText type="title">Current Theme: {getThemeName()}</ThemedText>
          <ThemedText style={styles.subtitle}>Select a theme to apply:</ThemedText>
          
          <View style={styles.themesContainer}>
            {THEMES.map((theme, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: theme.primary,
                    borderColor: themeIndex === index ? '#FFFFFF' : 'transparent',
                    borderWidth: themeIndex === index ? 2 : 0,
                  }
                ]}
                onPress={() => setThemeIndex(index)}
              >
                <View style={styles.themeColorRow}>
                  <View style={[styles.colorDot, { backgroundColor: theme.background }]} />
                  <View style={[styles.colorDot, { backgroundColor: theme.primary }]} />
                  <View style={[styles.colorDot, { backgroundColor: theme.secondary }]} />
                </View>
                <ThemedText style={[styles.themeLabel, { color: '#FFFFFF' }]}>
                  {THEME_NAMES[index] || `Theme ${index+1}`}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Text Styles</ThemedText>
          <ThemedText type="header">Header Text</ThemedText>
          <ThemedText type="title">Title Text</ThemedText>
          <ThemedText type="subtitle">Subtitle Text</ThemedText>
          <ThemedText>Default Text</ThemedText>
          <ThemedText type="small">Small Text</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Buttons</ThemedText>
          <Button style={styles.component} onPress={() => {}}>Primary Button</Button>
          <Button style={styles.component} onPress={() => {}} variant="outline">Outline Button</Button>
          <Button style={styles.component} onPress={() => {}} variant="ghost">Ghost Button</Button>
          <Button style={styles.component} onPress={() => {}} variant="destructive">Destructive Button</Button>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Inputs</ThemedText>
          <TextInput placeholder="Regular Input" style={styles.component} />
          <TextInput placeholder="Password Input" style={styles.component} secureTextEntry />
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Color Palette</ThemedText>
          {Object.entries(themeColors).map(([key, color]) => (
            <View key={key} style={styles.colorRow}>
              <View style={[styles.colorSample, { backgroundColor: color }]} />
              <ThemedText style={styles.colorName}>{key}: {color}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.7,
  },
  component: {
    marginVertical: 8,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  themeOption: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  themeColorRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  themeLabel: {
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  colorSample: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorName: {
    flex: 1,
  },
});
