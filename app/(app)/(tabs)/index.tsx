import SafeAreaLayout from "@/components/SafeAreaLayout";
import { useAuth } from "@/context/AuthContext";
import { useTabTransition } from "@/hooks/useTabTransition";
import { dutaService } from "@/services/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
import { ArrowRightIcon, ClockIcon } from "react-native-heroicons/outline";
import Animated, { FadeIn } from "react-native-reanimated";

dayjs.locale("id");

// ========== COMPONENTS ========== //
const SummaryCard = ({
  label,
  value,
  description,
  isLarge = false,
  bgColor = "bg-white",
  textColor = "text-gray-800",
}: {
  label: string;
  value: string;
  description?: string;
  isLarge?: boolean;
  bgColor?: string;
  textColor?: string;
}) => (
  <Animated.View
    entering={FadeIn.delay(200)}
    className={`${bgColor} p-4 rounded-xl shadow-sm ${isLarge ? "w-full" : "w-[48%]"} mx-1`}
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <Text className={`text-sm ${textColor} font-medium`}>{label}</Text>
    <Text
      className={`${isLarge ? "text-2xl" : "text-xl"} font-bold ${textColor} mt-1`}
    >
      {value}
    </Text>
    {description && (
      <Text className={`text-xs ${textColor.replace("800", "400")} mt-1`}>
        {description}
      </Text>
    )}
  </Animated.View>
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
      Tidak ada aktivitas terkini
    </Text>
    <Text className='text-gray-400 text-center px-10'>
      Belum ada aktivitas donasi yang tercatat
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
export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { opacity, translateX } = useTabTransition();

  // Dashboard query
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isError: isErrorDashboard,
    error: errorDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dutaService.getDashboard(),
  });

  // Recent activity (infinite scroll)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchRecent,
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
  } = useInfiniteQuery({
    queryKey: ["recentActivities"],
    queryFn: ({ pageParam = 1 }) =>
      dutaService.getRecentDonations({
        page: pageParam,
        limit: 5, // Hanya meminta 5 item per request
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.has_more ? allPages.length + 1 : undefined,
    select: (data) => {
      // Hanya ambil 5 item pertama dari semua halaman
      const allItems = data.pages.flatMap((page) => page.data.items);
      return allItems.slice(0, 5);
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([refetchDashboard(), refetchRecent()]);
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
        <Text className='text-red-500 text-lg'>
          Data user tidak tersedia, silakan login kembali
        </Text>
      </View>
    );
  }

  if (isLoadingDashboard || isLoadingRecent) {
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
          <View className='w-32 h-24 bg-gray-200 rounded-xl' />
        </ScrollView>

        <View className='px-6 pb-3'>
          <View className='h-6 bg-gray-200 rounded w-32 mb-2' />
          <View className='h-4 bg-gray-200 rounded w-24' />
        </View>

        {[1, 2, 3, 4, 5].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </SafeAreaLayout>
    );
  }

  if (isErrorDashboard || isErrorRecent) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50 p-4'>
        <Text className='text-red-500 text-lg mb-2'>
          Gagal memuat data dashboard
        </Text>
        <Text className='text-gray-600 text-center'>
          {errorDashboard?.message || "Silakan coba lagi nanti"}
        </Text>
      </View>
    );
  }

  const recentActivities = data || [];

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
                  Selamat Datang, {user.name}
                </Text>
                <Text className='text-gray-500 mt-1'>
                  {user.role === "duta" ? "Duta" : "Admin"} {user.duta_type}
                </Text>
              </Animated.View>

              {/* Dashboard Cards - Top Row */}
              <View className='px-4 py-3 flex-row justify-between'>
                <SummaryCard
                  label='Menunggu'
                  value={dashboardData.data.pending_count.toLocaleString(
                    "id-ID"
                  )}
                  bgColor='bg-amber-50'
                  textColor='text-amber-800'
                />
                <SummaryCard
                  label='Ditolak'
                  value={dashboardData.data.rejected_count_this_month.toLocaleString(
                    "id-ID"
                  )}
                  bgColor='bg-rose-50'
                  textColor='text-rose-800'
                />
              </View>

              {/* Summary Card - Bottom (Full Width) */}
              <View className='px-4 pb-3'>
                <SummaryCard
                  label='Terverifikasi'
                  value={formatRupiah(
                    dashboardData.data.total_verified_this_month
                  )}
                  description='Bulan ini'
                  isLarge
                  bgColor='bg-emerald-50'
                  textColor='text-emerald-800'
                />
              </View>

              {/* Recent Activity Title */}
              <View className='px-6 pb-3 flex-row justify-between items-center'>
                <Text className='text-xl font-semibold text-gray-900'>
                  Aktivitas Terkini
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                >
                  <Text className='text-sm text-blue-600 font-medium'>
                    Lihat Semua
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          }
          data={data || []} // Data sudah di-slice menjadi 5 item
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
                    <View className='flex-row items-center'>
                      <Text className='text-lg font-bold text-blue-600 mr-2'>
                        {formatRupiah(item.amount)}
                      </Text>
                      <ArrowRightIcon size={18} color='#9ca3af' />
                    </View>
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
          onEndReachedThreshold={0.2}
        />
      </SafeAreaLayout>
    </Animated.View>
  );
}
