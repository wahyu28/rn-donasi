import SafeAreaLayout from "@/components/SafeAreaLayout";
import { useAuth } from "@/context/AuthContext";
import { useTabTransition } from "@/hooks/useTabTransition";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CogIcon, PencilIcon } from "react-native-heroicons/outline";
import Animated, { FadeIn } from "react-native-reanimated";

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const { opacity, translateX } = useTabTransition();

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari akun?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#3b82f6' />
      </View>
    );
  }

  const handlePress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  return (
    // <Animated.View style={{ flex: 1, opacity, transform: [{ translateX }] }}>
    <SafeAreaLayout>
      <Animated.View
        entering={FadeIn.duration(500)}
        className='flex-1 bg-gray-50'
      >
        <ScrollView>
          {/* Profile Header */}
          <View className='items-center py-8 bg-white shadow-inner'>
            <View className='relative'>
              <Image
                source={{
                  uri:
                    user?.profile_photo_url ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=random`,
                }}
                className='w-32 h-32 rounded-full mb-4 border-4 border-blue-100'
              />
            </View>
            <Text className='text-2xl font-bold text-gray-900'>
              {user?.name}
            </Text>
            <Text className='text-gray-600 mt-1'>{user?.email}</Text>
            <Text className='text-gray-400 mt-1'>@{user?.username}</Text>

            {user?.duta_type && (
              <View className='bg-blue-100 px-3 py-1 rounded-full mt-3'>
                <Text className='text-blue-800 text-sm font-medium'>
                  {user.role === "duta" ? "Duta" : "Admin"} {user.duta_type}
                </Text>
              </View>
            )}
          </View>

          {/* Menu Options */}
          <View className='px-4 py-6 space-y-4'>
            <TouchableOpacity
              className='bg-white p-5 rounded-xl flex-row items-center'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
              activeOpacity={0.9}
              onPress={() => handlePress(() => router.push("/profile/edit"))}
            >
              <View className='bg-blue-100 p-2 rounded-full mr-4'>
                <PencilIcon size={20} color='#3b82f6' />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-medium text-gray-900'>
                  Edit Profile
                </Text>
                <Text className='text-sm text-gray-400 mt-1'>
                  Ubah data profil Anda
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className='bg-white p-5 rounded-xl flex-row items-center border border-red-100'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
              activeOpacity={0.9}
              onPress={handleLogout}
            >
              <View className='bg-red-100 p-2 rounded-full mr-4'>
                <CogIcon size={20} color='#ef4444' />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-medium text-red-600'>
                  Logout
                </Text>
                <Text className='text-sm text-gray-400 mt-1'>
                  Keluar dari akun Anda
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View className='px-4 py-8'>
            <Text className='text-center text-gray-400 text-sm'>
              Yis Peduli v1.0.0 @Wahyupratama
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaLayout>
    // </Animated.View>
  );
}
