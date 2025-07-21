// app/(app)/donations/index.tsx
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dutaService } from "../../../services/api";

export default function DonationsScreen() {
  const {
    data: donations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donations"],
    queryFn: () => dutaService.getDonations(),
  });

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-red-500'>Failed to load donations</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 p-4 bg-gray-50'>
      <Text className='text-2xl font-bold mb-6'>Donation History</Text>

      <FlatList
        data={donations?.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/donations/${item.id}`} asChild>
            <TouchableOpacity className='bg-white p-4 mb-3 rounded-lg shadow-sm'>
              <View className='flex-row justify-between mb-2'>
                <Text className='font-medium'>ID: {item.id}</Text>
                <Text
                  className={`font-medium ${
                    item.status === "validated"
                      ? "text-green-600"
                      : item.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {item.status}
                </Text>
              </View>
              <Text className='text-lg font-bold mb-1'>
                Rp {parseFloat(item.amount).toLocaleString()}
              </Text>
              <Text className='text-gray-500'>
                {dayjs(item.transaction_date).format("DD MMM YYYY")}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <View className='items-center justify-center py-10'>
            <Text className='text-gray-500'>No donations found</Text>
          </View>
        }
      />
    </View>
  );
}
