import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { useAuth } from "../../context/AuthContext";

type FormData = {
  login: string;
  password: string;
};

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.login, data.password);
      // Redirect sudah ditangani di AuthContext
    } catch (error) {
      Alert.alert(
        "Login Gagal",
        "Username atau password salah. Silakan coba lagi.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className='flex-1 justify-center p-6 bg-gray-50'>
        <Text className='text-2xl font-bold text-center mb-8'>Login</Text>

        {/* Username/Email Field */}
        <View className='mb-4'>
          <Text className='mb-2 text-gray-700'>Username atau Email</Text>
          <Controller
            control={control}
            rules={{ required: "Wajib diisi" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='border border-gray-300 rounded p-3 bg-white'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder='Masukkan username atau email'
                autoCapitalize='none'
                autoCorrect={false}
              />
            )}
            name='login'
          />
          {errors.login && (
            <Text className='text-red-500 mt-1'>{errors.login.message}</Text>
          )}
        </View>

        {/* Password Field */}
        <View className='mb-6'>
          <Text className='mb-2 text-gray-700'>Password</Text>
          <View className='relative'>
            <Controller
              control={control}
              rules={{ required: "Wajib diisi" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className='border border-gray-300 rounded p-3 bg-white pr-10'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Masukkan password'
                  secureTextEntry={!showPassword}
                />
              )}
              name='password'
            />
            <TouchableOpacity
              className='absolute right-3 top-3.5'
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon size={20} color='gray' />
              ) : (
                <EyeIcon size={20} color='gray' />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className='text-red-500 mt-1'>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          className='bg-blue-500 p-3 rounded-md'
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text className='text-white text-center font-medium'>
            {loading ? "Sedang masuk..." : "Masuk"}
          </Text>
        </TouchableOpacity>

        {/* Optional: Forgot Password Link */}
        <View className='mt-4 items-center'>
          <TouchableOpacity>
            <Text className='text-blue-500'>Lupa password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
