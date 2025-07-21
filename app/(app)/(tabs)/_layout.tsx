import { Tabs } from "expo-router";
import {
  CreditCardIcon,
  HomeIcon,
  UserIcon,
} from "react-native-heroicons/outline";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          tabBarLabel: "Beranda",
        }}
      />
      <Tabs.Screen
        name='donations'
        options={{
          tabBarIcon: ({ color, size }) => (
            <CreditCardIcon color={color} size={size} />
          ),
          tabBarLabel: "Donasi",
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
          tabBarLabel: "Profil",
        }}
      />
    </Tabs>
  );
}
