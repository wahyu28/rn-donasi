// components/HomeSkeletonLoader.tsx
import SafeAreaLayout from "@/components/SafeAreaLayout";
import { View } from "react-native";

export default function HomeSkeletonLoader() {
  return (
    <SafeAreaLayout>
      <View className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='p-6 pb-4 bg-white'>
          <View className='w-2/3 h-8 bg-gray-200 rounded mb-2' />
          <View className='w-1/3 h-5 bg-gray-200 rounded' />
        </View>

        {/* Dashboard Cards */}
        <View className='px-4 py-3'>
          <View className='w-1/4 h-6 bg-gray-200 rounded mb-3' />
          <View className='flex-row justify-between gap-4'>
            <View className='flex-1 min-w-[45%] h-24 bg-gray-200 rounded-2xl' />
            <View className='flex-1 min-w-[45%] h-24 bg-gray-200 rounded-2xl' />
          </View>
        </View>

        {/* Recent Activity Title */}
        <View className='px-4 pb-3 flex-row justify-between items-center'>
          <View className='w-1/4 h-6 bg-gray-200 rounded' />
          <View className='w-16 h-5 bg-gray-200 rounded' />
        </View>

        {/* Recent Activity List */}
        <View className='px-4 space-y-3 mb-20'>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              className='bg-white p-4 rounded-xl border border-gray-200'
            >
              <View className='flex-row justify-between mb-2'>
                <View className='w-2/3 h-5 bg-gray-200 rounded' />
                <View className='w-12 h-5 bg-gray-200 rounded' />
              </View>
              <View className='flex-row justify-between'>
                <View className='w-1/3 h-6 bg-gray-200 rounded' />
                <View className='w-5 h-5 bg-gray-200 rounded-full' />
              </View>
              <View className='mt-3 border-t border-gray-100 pt-2 flex-row justify-between'>
                <View className='flex-row items-center space-x-2'>
                  <View className='w-6 h-6 bg-gray-200 rounded-full' />
                  <View className='w-20 h-4 bg-gray-200 rounded' />
                </View>
                <View className='w-20 h-4 bg-gray-200 rounded' />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaLayout>
  );
}
