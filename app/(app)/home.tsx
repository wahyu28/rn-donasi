import SafeAreaLayout from "@/components/SafeAreaLayout";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { MotiView } from "moti";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowRightIcon, ClockIcon } from "react-native-heroicons/outline";
import { useAuth } from "../../context/AuthContext";
import { dutaService } from "../../services/api";

dayjs.locale("id");

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

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
      dutaService.getRecentDonations({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.has_more ? allPages.length + 1 : undefined,
    select: (data) => data.pages.flatMap((page) => page.data.items),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDashboard(), refetchRecent()]);
    setRefreshing(false);
  };

  const formatRupiah = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return (
      "Rp. " +
      new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(num)
    );
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "validated":
        return "Terverifikasi";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      case "correction_needed":
        return "Perbaikan";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "validated":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "correction_needed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <Text className='text-red-500 text-lg'>
          Data user tidak tersedia, silakan login kembali
        </Text>
      </View>
    );
  }

  if (isLoadingDashboard) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#3b82f6' />
        <Text className='mt-4 text-blue-500'>Memuat dashboard...</Text>
      </View>
    );
  }

  if (isErrorDashboard) {
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

  const dashboardCards = [
    {
      label: "Menunggu",
      value: dashboardData.data.pending_count.toLocaleString("id-ID"),
      bg: "bg-yellow-50",
      textColor: "text-yellow-600",
      badge: "Pending",
    },
    {
      label: "Ditolak",
      value:
        dashboardData.data.rejected_count_this_month.toLocaleString("id-ID"),
      bg: "bg-red-50",
      textColor: "text-red-600",
      badge: "Bulan Ini",
    },
    {
      label: "Terverifikasi",
      value: formatRupiah(dashboardData.data.total_verified_this_month),
      bg: "bg-green-50",
      textColor: "text-green-600",
      badge: "Bulan Ini",
    },
  ];

  return (
    <SafeAreaLayout>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              className='p-6 pb-4 bg-white shadow-sm'
            >
              <Text className='text-2xl font-bold text-gray-800'>
                Selamat Datang, {user.name}
              </Text>
              <Text className='text-gray-500 mt-1'>
                {user.role === "duta" ? "Duta" : "Admin"} {user.duta_type}
              </Text>
            </MotiView>

            {/* Dashboard Cards */}
            <View className='px-4 py-3'>
              <Text className='text-xl font-semibold text-gray-800 mb-3'>
                Ringkasan Bulan Ini
              </Text>
              <View className='flex-row flex-wrap justify-between gap-4'>
                {dashboardCards.map((item, index) => (
                  <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: index * 150 }}
                    key={index}
                    className={`p-4 rounded-2xl shadow-sm ${item.bg} flex-1 min-w-[45%]`}
                  >
                    <View className='flex-row justify-between items-center mb-1'>
                      <Text className='text-sm text-gray-500'>
                        {item.label}
                      </Text>
                      <View className='bg-white px-2 py-0.5 rounded-full'>
                        <Text
                          className={`text-xs font-medium ${item.textColor}`}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    </View>
                    <Text className={`text-2xl font-bold ${item.textColor}`}>
                      {item.value}
                    </Text>
                  </MotiView>
                ))}
              </View>
            </View>

            {/* Recent Activity Title */}
            <View className='px-4 pb-3 flex-row justify-between items-center'>
              <Text className='text-lg font-semibold text-gray-800'>
                Aktivitas Terkini
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className='text-sm text-blue-600 font-medium'>
                  Lihat Semua
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 60 }}
            className='px-4 mb-3'
          >
            <TouchableOpacity
              className='bg-white p-4 rounded-xl border border-gray-200 shadow-sm'
              activeOpacity={0.85}
            >
              <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-base font-medium text-gray-800'>
                  {item.program}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}
                >
                  <Text className='text-xs font-medium'>
                    {formatStatus(item.status)}
                  </Text>
                </View>
              </View>

              <View className='flex-row justify-between items-center'>
                <View>
                  <Text className='text-lg font-bold text-blue-600'>
                    {formatRupiah(item.amount)}
                  </Text>
                  <View className='flex-row items-center mt-1'>
                    <ClockIcon size={14} color='#6b7280' />
                    <Text className='text-gray-500 text-sm ml-1'>
                      {dayjs(item.created_at).format("DD MMM YYYY, HH:mm")}
                    </Text>
                  </View>
                </View>
                <ArrowRightIcon size={20} color='#9ca3af' />
              </View>

              <View className='mt-3 border-t border-gray-100 pt-2 flex-row justify-between items-center'>
                <View className='flex-row items-center space-x-2'>
                  <Image
                    source={{
                      uri:
                        item.donor.avatar ||
                        `https://ui-avatars.com/api/?name=${item.donor.name}`,
                    }}
                    className='w-6 h-6 rounded-full'
                  />
                  <Text className='text-sm text-gray-600'>
                    {item.donor.name}
                  </Text>
                </View>
                <Text className='text-sm text-gray-500'>
                  {item.payment_method}
                </Text>
              </View>
            </TouchableOpacity>
          </MotiView>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator className='my-4' color='#3b82f6' />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaLayout>
  );
}
