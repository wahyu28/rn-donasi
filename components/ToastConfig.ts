// components/ToastConfig.ts
import Toast from 'react-native-toast-message';

export const toastConfig = {
  success: ({ text1, props }: any) => (
    <View className="bg-green-500 p-4 rounded-md w-full max-w-xs">
      <Text className="text-white font-medium">{text1}</Text>
      {props?.description && (
        <Text className="text-white mt-1">{props.description}</Text>
      )}
    </View>
  ),
  error: ({ text1, props }: any) => (
    <View className="bg-red-500 p-4 rounded-md w-full max-w-xs">
      <Text className="text-white font-medium">{text1}</Text>
      {props?.description && (
        <Text className="text-white mt-1">{props.description}</Text>
      )}
    </View>
  ),
  info: ({ text1, props }: any) => (
    <View className="bg-blue-500 p-4 rounded-md w-full max-w-xs">
      <Text className="text-white font-medium">{text1}</Text>
      {props?.description && (
        <Text className="text-white mt-1">{props.description}</Text>
      )}
    </View>
  ),
};

// Wrap your app with Toast component in the root layout