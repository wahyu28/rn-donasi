import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import {
  ClipboardDocumentListIcon,
  CreditCardIcon,
  HomeIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1f2937", // Dark color for active text
        tabBarInactiveTintColor: "#9ca3af", // Light gray for inactive text
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: "#ffffff", // White background
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6", // Light border
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 4 : 8,
          paddingTop: 2,
          height: Platform.OS === "ios" ? 80 + insets.bottom : 80,
          elevation: 8, // Add shadow for Android
          shadowOpacity: 0.1, // Add shadow for iOS
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },
        headerShown: false,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: focused ? 56 : size,
                height: focused ? 56 : size,
                backgroundColor: "transparent", // Light gray bg for focused
                borderRadius: focused ? 28 : 0,
              }}
            >
              <HomeIcon
                color={focused ? "#1f2937" : "#9ca3af"} // Dark for focused, gray for unfocused
                size={focused ? 24 : size}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name='donations'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: focused ? 56 : size,
                height: focused ? 56 : size,
                backgroundColor: "transparent",
                borderRadius: focused ? 28 : 0,
              }}
            >
              <ClipboardDocumentListIcon
                color={focused ? "#1f2937" : "#9ca3af"}
                size={focused ? 24 : size}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          tabBarLabel: "Donasi",
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                backgroundColor: "#6366f1", // Keep purple for center button
                borderRadius: 28,
                marginBottom: 0,
                // Add subtle shadow for the floating button
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <CreditCardIcon color='#ffffff' size={28} strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: focused ? 56 : size,
                height: focused ? 56 : size,
                backgroundColor: "transparent",
                borderRadius: focused ? 28 : 0,
              }}
            >
              <ClipboardDocumentListIcon
                color={focused ? "#1f2937" : "#9ca3af"}
                size={focused ? 24 : size}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          tabBarLabel: "History",
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: focused ? 56 : size,
                height: focused ? 56 : size,
                backgroundColor: "transparent",
                borderRadius: focused ? 28 : 0,
              }}
            >
              <UserIcon
                color={focused ? "#1f2937" : "#9ca3af"}
                size={focused ? 24 : size}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
