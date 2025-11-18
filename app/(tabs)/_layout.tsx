import { Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/floating-tab-bar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'News',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Create',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
    </Tabs>
  );
}
