// app/(app)/profile.tsx
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View className='flex-1 p-6 bg-gray-50'>
      <View className='items-center mb-8'>
        <Image
          source={{ uri: user?.profile_photo_url }}
          className='w-24 h-24 rounded-full mb-4'
        />
        <Text className='text-2xl font-bold'>{user?.name}</Text>
        <Text className='text-gray-600'>{user?.email}</Text>
        <Text className='text-gray-500 mt-1'>@{user?.username}</Text>
      </View>

      <View className='space-y-4'>
        <TouchableOpacity
          className='bg-white p-4 rounded-lg shadow-sm'
          onPress={() => router.push("/profile/edit")}
        >
          <Text className='text-gray-800'>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-white p-4 rounded-lg shadow-sm'
          onPress={() => router.push("/settings")}
        >
          <Text className='text-gray-800'>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-red-500 p-4 rounded-lg'
          onPress={logout}
        >
          <Text className='text-white text-center'>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
