import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useImagePicker } from "../../../hooks/useImagePicker";
import { masterDataService, uploadWithProgress } from "../../../services/api";

type FormData = {
  program_id: string;
  salutation_id: string;
  donor_name: string;
  donor_phone: string;
  donor_email: string;
  amount: string;
  payment_method_id: string;
  transaction_date: string;
  notes?: string;
};

export default function NewDonationScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const {
    images,
    uploadProgress,
    pickImages,
    takePhoto,
    removeImage,
    setUploadProgress,
  } = useImagePicker();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: masterData } = useQuery({
    queryKey: ["masterData"],
    queryFn: () => masterDataService.getMasterData(),
  });

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      Alert.alert("Error", "Please upload at least one proof of transfer");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append images
      images.forEach((uri, index) => {
        const filename = uri.split("/").pop();
        const type = `image/${filename?.split(".").pop()}`;
        formData.append(`proof_of_transfer_${index}`, {
          uri,
          name: filename,
          type,
        } as any);
      });

      await uploadWithProgress("/duta/donations", formData, (progress) => {
        setUploadProgress(progress);
      });

      Alert.alert("Success", "Donation submitted successfully");
      router.push("/donations");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit donation");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <ScrollView className='flex-1 p-4 bg-gray-50'>
      <Text className='text-2xl font-bold mb-6'>New Donation</Text>

      {/* Program Selection */}
      <View className='mb-4'>
        <Text className='mb-2 text-gray-700'>Program</Text>
        <Controller
          control={control}
          name='program_id'
          rules={{ required: "Program is required" }}
          render={({ field: { onChange, value } }) => (
            <View className='border border-gray-300 rounded bg-white'>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label='Select Program' value='' />
                {masterData?.data.programs.map((program) => (
                  <Picker.Item
                    key={program.id}
                    label={program.name}
                    value={program.id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.program_id && (
          <Text className='text-red-500 mt-1'>{errors.program_id.message}</Text>
        )}
      </View>

      {/* Amount Input */}
      <View className='mb-4'>
        <Text className='mb-2 text-gray-700'>Amount</Text>
        <Controller
          control={control}
          name='amount'
          rules={{
            required: "Amount is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid amount",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className='border border-gray-300 rounded p-3 bg-white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder='Enter amount'
              keyboardType='numeric'
            />
          )}
        />
        {errors.amount && (
          <Text className='text-red-500 mt-1'>{errors.amount.message}</Text>
        )}
      </View>

      {/* Image Upload Section */}
      <View className='mb-4'>
        <Text className='mb-2 text-gray-700'>Proof of Transfer</Text>

        <View className='flex-row space-x-2 mb-2'>
          <TouchableOpacity
            className='bg-blue-500 p-3 rounded flex-1'
            onPress={pickImages}
          >
            <Text className='text-white text-center'>Select Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-purple-500 p-3 rounded flex-1'
            onPress={takePhoto}
          >
            <Text className='text-white text-center'>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View className='mt-2'>
            <Text className='text-gray-500 mb-1'>
              {images.length} image(s) selected
            </Text>
            <View className='flex-row flex-wrap'>
              {images.map((uri) => (
                <View key={uri} className='relative mr-2 mb-2'>
                  <Image
                    source={{ uri }}
                    className='w-20 h-20 rounded'
                    resizeMode='cover'
                  />
                  <TouchableOpacity
                    className='absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 items-center justify-center'
                    onPress={() => removeImage(uri)}
                  >
                    <Text className='text-white'>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      {uploadProgress > 0 && (
        <View className='mt-4 mb-4'>
          <Text className='text-gray-700 mb-1'>
            Uploading: {uploadProgress}%
          </Text>
          <View className='h-2 bg-gray-200 rounded-full'>
            <View
              className='h-2 bg-blue-500 rounded-full'
              style={{ width: `${uploadProgress}%` }}
            />
          </View>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        className='bg-green-500 p-3 rounded-md mt-4'
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || uploadProgress > 0}
      >
        <Text className='text-white text-center font-medium'>
          {isSubmitting ? "Submitting..." : "Submit Donation"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
