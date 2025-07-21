// components/BottomTabsNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CreditCardIcon,
  HomeIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import HomeScreen from "../app/(app)/(tabs)";
import DonationsScreen from "../app/(app)/(tabs)/donations";
import ProfileScreen from "../app/(app)/profile";

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6", // Warna aktif
        tabBarInactiveTintColor: "#9ca3af", // Warna non-aktif
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false, // Sembunyikan header default
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          tabBarLabel: "Beranda",
        }}
      />
      <Tab.Screen
        name='Donations'
        component={DonationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CreditCardIcon color={color} size={size} />
          ),
          tabBarLabel: "Donasi",
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
          tabBarLabel: "Profil",
        }}
      />
    </Tab.Navigator>
  );
}
