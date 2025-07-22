import SafeAreaLayout from "@/components/SafeAreaLayout";
import { useAuth } from "@/context/AuthContext";
import { useTabTransition } from "@/hooks/useTabTransition";
import { dutaService } from "@/services/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ClockIcon, FunnelIcon } from "react-native-heroicons/outline";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

dayjs.locale("id");

// ========== COMPONENTS ========== //
const SummaryCard = ({
  label,
  value,
  description,
  isLarge = false,
}: {
  label: string;
  value: string;
  description?: string;
  isLarge?: boolean;
}) => (
  <Animated.View
    entering={FadeIn.delay(200)}
    className={`bg-white p-4 rounded-xl shadow-sm ${isLarge ? "w-full" : "w-[48%]"} mx-1`}
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <Text className='text-sm text-gray-500 font-medium'>{label}</Text>
    <Text
      className={`${isLarge ? "text-2xl" : "text-xl"} font-bold text-gray-800 mt-1`}
    >
      {value}
    </Text>
    {description && (
      <Text className='text-xs text-gray-400 mt-1'>{description}</Text>
    )}
  </Animated.View>
);

const StatusFilterChip = ({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 ${active ? "bg-blue-600" : "bg-gray-100"}`}
  >
    <Text
      className={`text-sm font-medium ${active ? "text-white" : "text-gray-700"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SkeletonLoader = () => (
  <View className='px-4 mb-3'>
    <View className='bg-gray-100 p-4 rounded-xl h-28' />
  </View>
);

const EmptyState = () => (
  <View className='flex-1 items-center justify-center py-10'>
    <Image
      source={require("@/assets/images/empty-donation.png")}
      className='w-48 h-48 mb-4'
    />
    <Text className='text-lg font-medium text-gray-500 mb-1'>
      Tidak ada transaksi
    </Text>
    <Text className='text-gray-400 text-center px-10'>
      Anda belum memiliki riwayat donasi atau filter Anda tidak menghasilkan
      data
    </Text>
  </View>
);

// ========== UTILS ========== //
const formatRupiah = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(num)
    .replace("Rp", "Rp.");
};

const statusConfig = {
  validated: {
    label: "Terverifikasi",
    color: "bg-emerald-100 text-emerald-800",
  },
  pending: { label: "Menunggu", color: "bg-amber-100 text-amber-800" },
  rejected: { label: "Ditolak", color: "bg-rose-100 text-rose-800" },
  correction_needed: {
    label: "Perbaikan",
    color: "bg-orange-100 text-orange-800",
  },
};

// ========== MAIN SCREEN ========== //
export default function DonationsScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { opacity, translateX } = useTabTransition();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["donations", activeFilter],
    queryFn: ({ pageParam = 1 }) =>
      dutaService.getDonations({
        page: pageParam,
        status: activeFilter === "all" ? undefined : activeFilter,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.current_page < lastPage.data.meta.total_pages
        ? lastPage.data.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
  });

  const donations = data?.pages.flatMap((page) => page.data.items) || [];
  const totalAmount = donations.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );
  const verifiedCount = donations.filter(
    (item) => item.status === "validated"
  ).length;
  const pendingCount = donations.filter(
    (item) => item.status === "pending"
  ).length;

  const handleFilterChange = (filter: string) => {
    Haptics.selectionAsync();
    setActiveFilter(filter);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // ========== RENDER STATES ========== //
  if (!user) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <Text className='text-red-500 text-lg'>Silakan login kembali</Text>
      </View>
    );
  }

  if (isLoading && !data) {
    return (
      <SafeAreaLayout>
        <View className='p-6 pb-4 bg-white'>
          <View className='h-8 bg-gray-200 rounded w-40 mb-2' />
          <View className='h-4 bg-gray-200 rounded w-32' />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='px-4 py-3'
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          <View className='w-32 h-24 bg-gray-200 rounded-xl mr-2' />
          <View className='w-32 h-24 bg-gray-200 rounded-xl mr-2' />
        </ScrollView>

        <View className='px-4 py-2 flex-row'>
          {[1, 2, 3, 4].map((_, i) => (
            <View key={i} className='h-8 bg-gray-200 rounded-full w-20 mr-2' />
          ))}
        </View>

        {[1, 2, 3, 4, 5].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </SafeAreaLayout>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50 p-4'>
        <Text className='text-red-500 text-lg mb-2'>Gagal memuat data</Text>
        <Text className='text-gray-600'>
          {error?.message || "Coba lagi nanti"}
        </Text>
      </View>
    );
  }

  // ========== MAIN RENDER ========== //
  return (
    <Animated.View style={{ flex: 1, opacity, transform: [{ translateX }] }}>
      <SafeAreaLayout>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor='#3b82f6'
            />
          }
          ListHeaderComponent={
            <>
              {/* Header Section */}
              <Animated.View
                entering={FadeIn.duration(500)}
                className='bg-white px-6 pt-6 pb-4'
              >
                <Text className='text-2xl font-bold text-gray-900'>
                  Riwayat Donasi
                </Text>
                <Text className='text-gray-500 mt-1'>
                  {donations.length} transaksi
                </Text>
              </Animated.View>

              {/* Summary Cards - Top Row */}
              <View className='px-4 py-3 flex-row justify-between'>
                <SummaryCard
                  label='Terverifikasi'
                  value={verifiedCount.toString()}
                  description='Bulan ini'
                />
                <SummaryCard label='Menunggu' value={pendingCount.toString()} />
              </View>

              {/* Summary Card - Bottom (Full Width) */}
              <View className='px-4 pb-3'>
                <SummaryCard
                  label='Total Donasi'
                  value={formatRupiah(totalAmount)}
                  isLarge
                />
              </View>

              {/* Filter Chips */}
              <Animated.View
                entering={FadeInDown.delay(300)}
                className='px-4 py-2 flex-row items-center'
              >
                <StatusFilterChip
                  label='Semua'
                  active={activeFilter === "all"}
                  onPress={() => handleFilterChange("all")}
                />
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <StatusFilterChip
                    key={key}
                    label={label}
                    active={activeFilter === key}
                    onPress={() => handleFilterChange(key)}
                  />
                ))}
                <TouchableOpacity
                  className='ml-auto p-2'
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                >
                  <FunnelIcon size={18} color='#3b82f6' />
                </TouchableOpacity>
              </Animated.View>
            </>
          }
          data={donations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 50 }}
              className='px-4 mb-3'
            >
              <Link
                href={`/donations/${item.id}`}
                asChild
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <TouchableOpacity
                  className='bg-white p-4 rounded-xl border border-gray-100'
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                  activeOpacity={0.9}
                >
                  <View className='flex-row justify-between items-start mb-3'>
                    <View className='flex-1'>
                      <Text className='text-base font-semibold text-gray-900'>
                        {item.program}
                      </Text>
                      <View className='flex-row items-center mt-1'>
                        <ClockIcon size={14} color='#6b7280' />
                        <Text className='text-gray-500 text-sm ml-1'>
                          {dayjs(item.created_at).format("D MMM YYYY, HH:mm")}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-2.5 py-1 rounded-full ${statusConfig[item.status]?.color || "bg-gray-100"}`}
                    >
                      <Text className='text-xs font-medium'>
                        {statusConfig[item.status]?.label || item.status}
                      </Text>
                    </View>
                  </View>

                  <View className='flex-row justify-between items-center border-t border-gray-100 pt-3'>
                    <View className='flex-row items-center'>
                      <Image
                        source={{
                          uri:
                            item.donor.avatar ||
                            `https://ui-avatars.com/api/?name=${item.donor.name}&background=random`,
                        }}
                        className='w-8 h-8 rounded-full'
                      />
                      <View className='ml-2'>
                        <Text className='text-sm font-medium text-gray-800'>
                          {item.donor.name}
                        </Text>
                        <Text className='text-xs text-gray-500'>
                          {item.payment_method}
                        </Text>
                      </View>
                    </View>
                    <Text className='text-lg font-bold text-blue-600'>
                      {formatRupiah(item.amount)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </MotiView>
          )}
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size='small'
                color='#3b82f6'
                className='my-4'
              />
            ) : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaLayout>
    </Animated.View>
  );
}
