import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, Text, View } from "react-native";
import HomeScreen from "../app/(app)/(tabs)";
import DonationsScreen from "../app/(app)/(tabs)/donations";
import ProfileScreen from "../app/(app)/profile";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#3b82f6' />
        <Text className='mt-4 text-blue-500'>Memuat...</Text>
      </View>
    );
  }

  return (
    // <NavigationContainer>
    <Tab.Navigator
      initialRouteName={user ? "Home" : "Login"}
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
      {user ? (
        <>
          <Tab.Screen
            name='Home'
            component={HomeScreen}
            options={
              {
                /* ... */
              }
            }
          />
          <Tab.Screen
            name='Donations'
            component={DonationsScreen}
            options={
              {
                /* ... */
              }
            }
          />
          <Tab.Screen
            name='Profile'
            component={ProfileScreen}
            options={
              {
                /* ... */
              }
            }
          />
        </>
      ) : (
        <Tab.Screen
          name='Login'
          component={require("../app/(auth)/login").default}
          options={{ tabBarButton: () => null }} // Sembunyikan dari tab bar
        />
      )}
    </Tab.Navigator>
    // </NavigationContainer>
  );
}
