import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useHouse } from '../../contexts/HouseThemeContext';

export default function TabLayout() {
  const { colors } = useHouse();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.primary },
        tabBarActiveTintColor: colors?.activeBar ?? '#FFD700',
        tabBarInactiveTintColor: colors?.inactiveBar ?? '#AAAAAA',
        tabBarStyle: {
          backgroundColor: colors?.primary,
          borderTopWidth: 0,
          elevation: 15,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },

        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Hogwarts',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="castle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: 'Personagens',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wizard-hat" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="spells"
        options={{
          title: 'Feitiços',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="auto-fix" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="information" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}