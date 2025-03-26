import { Tabs } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Pressable, LayoutChangeEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type TabBarIconProps = {
  name: keyof typeof FontAwesome.glyphMap;
  color: string;
  focused: boolean;
  label: string;
  index: number;
};

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40; 
const INITIAL_TAB_POSITIONS: { [key: string]: number } = {};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabPositions = useRef<{ [key: string]: number }>(INITIAL_TAB_POSITIONS).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: tabPositions[activeTabIndex] || 0,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [activeTabIndex, tabPositions]);

  const measureTab = (index: number, event: LayoutChangeEvent) => {
    const { x } = event.nativeEvent.layout;
    tabPositions[index] = x;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: isDark ? Colors.dark.primary : Colors.light.primary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25 + insets.bottom,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
          borderRadius: 30,
          height: 60,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          paddingHorizontal: 0,
          overflow: 'hidden',
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
        headerTintColor: isDark ? Colors.dark.text : Colors.light.text,
      }}
      tabBar={(props) => <CustomTabBar {...props} slideAnim={slideAnim} measureTab={measureTab} setActiveTabIndex={setActiveTabIndex} colorScheme={colorScheme} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="home" 
              color={focused ? '#FFFFFF' : (isDark ? Colors.dark.primary : Colors.light.primary)} 
              focused={focused} 
              label="Home" 
              index={0} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="compass" 
              color={focused ? '#FFFFFF' : (isDark ? Colors.dark.primary : Colors.light.primary)} 
              focused={focused} 
              label="Explore" 
              index={1} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="user" 
              color={focused ? '#FFFFFF' : (isDark ? Colors.dark.primary : Colors.light.primary)} 
              focused={focused} 
              label="Profile" 
              index={2} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation, slideAnim, measureTab, setActiveTabIndex, colorScheme }: any) {
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.tabBarContainer,
      { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
    ]}>
      {/* Moving background indicator */}
      <Animated.View 
        style={[
          styles.slidingIndicator,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary,
          }
        ]}
      />
      
      {/* Tab buttons */}
      <View style={styles.tabsRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          // Update active tab index when it changes
          useEffect(() => {
            if (isFocused) {
              setActiveTabIndex(index);
            }
          }, [isFocused]);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              onLayout={(e) => measureTab(index, e)}
            >
              {options.tabBarIcon && 
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? '#FFFFFF' : (isDark ? Colors.dark.primary : Colors.light.primary),
                  size: 24,
                })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TabBarIcon({ name, color, focused, label, index }: TabBarIconProps) {
  return (
    <View style={styles.tabIconContainer}>
      <FontAwesome
        name={name}
        size={20}
        color={color}
        style={styles.icon}
      />
      {focused && (
        <Text style={[styles.tabLabel, { color: '#FFFFFF' }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  slidingIndicator: {
    position: 'absolute',
    width: TAB_BAR_WIDTH / 3,
    height: 60,
    borderRadius: 30,
    zIndex: 0,
  },
  tabIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  icon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  }
});