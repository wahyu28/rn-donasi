import SafeAreaLayout from "@/components/SafeAreaLayout";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

type FormData = {
  login: string;
  password: string;
};

type ErrorType = {
  type: "network" | "credentials" | "server" | "validation" | "unknown";
  message: string;
};

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<ErrorType | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Helper function untuk menentukan jenis error
  const getErrorType = (error: any): ErrorType => {
    if (!error) {
      return {
        type: "unknown",
        message: "Terjadi kesalahan yang tidak diketahui",
      };
    }

    if (error.code === "NETWORK_ERROR" || error.message?.includes("Network")) {
      return {
        type: "network",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      };
    }

    if (error.status === 401 || error.code === "UNAUTHORIZED") {
      return {
        type: "credentials",
        message: "Username atau password salah. Silakan periksa kembali.",
      };
    }

    if (error.status >= 500) {
      return {
        type: "server",
        message: "Server sedang mengalami gangguan. Silakan coba lagi nanti.",
      };
    }

    if (error.status === 429) {
      return {
        type: "validation",
        message:
          "Terlalu banyak percobaan login. Silakan tunggu beberapa menit.",
      };
    }

    return {
      type: "unknown",
      message:
        error.message || "Terjadi kesalahan saat login. Silakan coba lagi.",
    };
  };

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    clearErrors();
    setLoginError(null);

    if (!data.login.trim()) {
      setError("login", { message: "Username atau email wajib diisi" });
      isValid = false;
    } else if (data.login.length < 3) {
      setError("login", { message: "Username minimal 3 karakter" });
      isValid = false;
    }

    if (!data.password) {
      setError("password", { message: "Password wajib diisi" });
      isValid = false;
    } else if (data.password.length < 6) {
      setError("password", { message: "Password minimal 6 karakter" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoginError(null);

      if (!validateForm(data)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAttemptCount((prev) => prev + 1);

      await login(data.login.trim(), data.password);
      setAttemptCount(0);
    } catch (error: any) {
      const errorInfo = getErrorType(error);
      setLoginError(errorInfo);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      if (errorInfo.type === "server" || errorInfo.type === "network") {
        Alert.alert("Masalah Koneksi", errorInfo.message, [
          {
            text: "Coba Lagi",
            onPress: () => handleSubmit(onSubmit)(),
          },
          { text: "Batal", style: "cancel" },
        ]);
      }
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    Haptics.selectionAsync();
    setShowForgotPasswordModal(false);
  };

  const renderErrorMessage = () => {
    if (!loginError) return null;

    const errorStyles = {
      network: "bg-orange-50 border-orange-200",
      credentials: "bg-red-50 border-red-200",
      server: "bg-red-50 border-red-200",
      validation: "bg-yellow-50 border-yellow-200",
      unknown: "bg-gray-50 border-gray-200",
    };

    const textStyles = {
      network: "text-orange-800",
      credentials: "text-red-800",
      server: "text-red-800",
      validation: "text-yellow-800",
      unknown: "text-gray-800",
    };

    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: -10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 300 }}
        className={`p-4 mb-6 border rounded-xl ${errorStyles[loginError.type]}`}
        style={{
          shadowColor:
            loginError.type === "credentials" ? "#dc2626" : "#f59e0b",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text className={`text-sm font-medium ${textStyles[loginError.type]}`}>
          {loginError.message}
        </Text>
        {attemptCount > 2 && loginError.type === "credentials" && (
          <Text
            className={`text-xs mt-2 ${textStyles[loginError.type]} opacity-80`}
          >
            💡 Tip: Pastikan Caps Lock tidak aktif dan periksa ejaan
            username/email Anda.
          </Text>
        )}
      </MotiView>
    );
  };

  const renderForgotPasswordModal = () => {
    return (
      <Modal
        visible={showForgotPasswordModal}
        transparent
        animationType='fade'
        onRequestClose={closeForgotPasswordModal}
      >
        <TouchableWithoutFeedback onPress={closeForgotPasswordModal}>
          <View className='flex-1 bg-black/50 justify-center items-center px-6'>
            <TouchableWithoutFeedback>
              <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 300 }}
                className='bg-white rounded-2xl p-6 w-full max-w-sm'
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                {/* Close Button */}
                <TouchableOpacity
                  className='absolute top-4 right-4 p-2'
                  onPress={closeForgotPasswordModal}
                >
                  <XMarkIcon size={20} color='#6b7280' />
                </TouchableOpacity>

                {/* Icon */}
                <View className='items-center mb-4'>
                  <View className='w-16 h-16 bg-amber-100 rounded-full items-center justify-center mb-3'>
                    <ExclamationTriangleIcon size={28} color='#f59e0b' />
                  </View>

                  <Text className='text-xl font-bold text-gray-900 text-center'>
                    Lupa Password?
                  </Text>
                </View>

                {/* Content */}
                <View className='mb-6'>
                  <Text className='text-gray-600 text-center leading-6 mb-4'>
                    Untuk keamanan akun Anda, silakan hubungi administrator
                    untuk melakukan reset password.
                  </Text>

                  <View className='bg-blue-50 p-4 rounded-xl border border-blue-200'>
                    <Text className='text-sm font-medium text-blue-800 mb-2'>
                      Hubungi Administrator:
                    </Text>
                    <Text className='text-sm text-blue-700'>
                      📧 Email: admin@yourapp.com
                    </Text>
                    <Text className='text-sm text-blue-700 mt-1'>
                      📱 WhatsApp: +62 812-3456-7890
                    </Text>
                    <Text className='text-sm text-blue-700 mt-1'>
                      ⏰ Jam Kerja: 09:00 - 17:00 WIB
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className='space-y-3'>
                  <TouchableOpacity
                    className='bg-blue-600 p-4 rounded-xl'
                    onPress={() => {
                      // Logic untuk membuka WhatsApp atau email
                      // Linking.openURL('whatsapp://send?phone=6281234567890&text=Halo, saya lupa password akun saya');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      closeForgotPasswordModal();
                    }}
                    style={{
                      shadowColor: "#3b82f6",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text className='text-white text-center font-semibold'>
                      Hubungi Admin
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='bg-gray-100 p-4 rounded-xl'
                    onPress={closeForgotPasswordModal}
                  >
                    <Text className='text-gray-700 text-center font-medium'>
                      Tutup
                    </Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaLayout>
        <View className='flex-1 bg-gradient-to-br from-blue-50 to-indigo-100'>
          {/* Header Section */}
          <Animated.View
            entering={FadeInUp.duration(800)}
            className='items-center pt-12 pb-8'
          >
            <View
              className='w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-6'
              style={{
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <UserIcon size={32} color='white' />
            </View>

            <Text className='text-3xl font-bold text-gray-900 mb-2'>
              Selamat Datang
            </Text>
            <Text className='text-gray-600 text-center px-8'>
              Masuk ke akun Anda untuk melanjutkan
            </Text>
          </Animated.View>

          {/* Form Container */}
          <Animated.View
            entering={FadeIn.delay(200).duration(800)}
            className='flex-1 bg-white rounded-t-3xl px-6 pt-8'
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Error Message */}
            {renderErrorMessage()}

            {/* Username/Email Field */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              className='mb-6'
            >
              <Text className='text-gray-700 font-medium mb-3'>
                Username atau Email
              </Text>
              <View className='relative'>
                <View className='absolute left-4 top-4 z-10'>
                  <UserIcon
                    size={20}
                    color={errors.login ? "#dc2626" : "#9ca3af"}
                  />
                </View>
                <Controller
                  control={control}
                  rules={{
                    required: "Wajib diisi",
                    minLength: {
                      value: 3,
                      message: "Username minimal 3 karakter",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border rounded-xl p-4 pl-12 bg-gray-50 text-gray-900 ${
                        errors.login
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      style={{
                        shadowColor: errors.login ? "#dc2626" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: errors.login ? 0.1 : 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        if (loginError?.type === "credentials") {
                          setLoginError(null);
                        }
                      }}
                      value={value}
                      placeholder='Masukkan username atau email'
                      placeholderTextColor='#9ca3af'
                      autoCapitalize='none'
                      autoCorrect={false}
                      editable={!loading}
                    />
                  )}
                  name='login'
                />
              </View>
              {errors.login && (
                <MotiView
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  <Text className='text-red-500 text-sm mt-2 ml-1'>
                    {errors.login.message}
                  </Text>
                </MotiView>
              )}
            </Animated.View>

            {/* Password Field */}
            <Animated.View
              entering={FadeInDown.delay(500).duration(600)}
              className='mb-8'
            >
              <Text className='text-gray-700 font-medium mb-3'>Password</Text>
              <View className='relative'>
                <View className='absolute left-4 top-4 z-10'>
                  <LockClosedIcon
                    size={20}
                    color={errors.password ? "#dc2626" : "#9ca3af"}
                  />
                </View>
                <Controller
                  control={control}
                  rules={{
                    required: "Wajib diisi",
                    minLength: {
                      value: 6,
                      message: "Password minimal 6 karakter",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border rounded-xl p-4 pl-12 pr-12 bg-gray-50 text-gray-900 ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      style={{
                        shadowColor: errors.password ? "#dc2626" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: errors.password ? 0.1 : 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        if (loginError?.type === "credentials") {
                          setLoginError(null);
                        }
                      }}
                      value={value}
                      placeholder='Masukkan password'
                      placeholderTextColor='#9ca3af'
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                  )}
                  name='password'
                />
                <TouchableOpacity
                  className='absolute right-4 top-4'
                  onPress={() => {
                    setShowPassword(!showPassword);
                    Haptics.selectionAsync();
                  }}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon
                      size={20}
                      color={loading ? "#ccc" : "#6b7280"}
                    />
                  ) : (
                    <EyeIcon size={20} color={loading ? "#ccc" : "#6b7280"} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <MotiView
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  <Text className='text-red-500 text-sm mt-2 ml-1'>
                    {errors.password.message}
                  </Text>
                </MotiView>
              )}
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.delay(600).duration(600)}>
              <TouchableOpacity
                className={`rounded-xl p-4 flex-row justify-center items-center ${
                  loading ? "bg-blue-400" : "bg-blue-600"
                }`}
                style={{
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: loading ? 0.2 : 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleSubmit(onSubmit)();
                }}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading && (
                  <ActivityIndicator
                    size='small'
                    color='white'
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text className='text-white text-lg font-semibold'>
                  {loading ? "Sedang masuk..." : "Masuk"}
                </Text>
              </TouchableOpacity>

              {/* Retry Hint */}
              {attemptCount > 1 && !loading && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 200 }}
                  className='items-center mt-3'
                >
                  <Text className='text-gray-500 text-sm'>
                    Percobaan ke-{attemptCount}
                  </Text>
                </MotiView>
              )}
            </Animated.View>

            {/* Forgot Password Link */}
            <Animated.View
              entering={FadeInDown.delay(700).duration(600)}
              className='items-center mt-6'
            >
              <TouchableOpacity
                disabled={loading}
                onPress={handleForgotPassword}
                className='py-2'
              >
                <Text
                  className={`text-base font-medium ${
                    loading ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  Lupa password?
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bottom Spacer */}
            <View className='flex-1 min-h-[40px]' />
          </Animated.View>
        </View>

        {/* Forgot Password Modal */}
        {renderForgotPasswordModal()}
      </SafeAreaLayout>
    </TouchableWithoutFeedback>
  );
}
