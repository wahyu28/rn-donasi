import SafeAreaLayout from "@/components/SafeAreaLayout";
import { Text, View } from "react-native";

export default function SearchScreen() {
  return (
    <SafeAreaLayout>
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <Text className='text-xl font-semibold text-gray-800'>
          Search Screen
        </Text>
      </View>
    </SafeAreaLayout>
  );
}
