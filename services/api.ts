import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://v2.yisadmin.com/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Jika token expired, logout user
      await AsyncStorage.removeItem("access_token");
      // Redirect ke login
      // Note: Anda mungkin perlu menggunakan navigation di sini
    }
    return Promise.reject(error);
  }
);

export const uploadWithProgress = async (
  url: string,
  formData: FormData,
  onProgress: (progress: number) => void
) => {
  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      onProgress(progress);
    },
  });
};

export const authService = {
  login: (login: string, password: string) => {
    return api.post("/login", { login, password });
  },
  logout: () => {
    return api.post("/logout");
  },
  getUser: () => {
    return api.get("/user");
  },
};

export const masterDataService = {
  getMasterData: async () => {
    return api.get("/master-data");
  },
};

export const dutaService = {
  getDashboard: async () => {
    try {
      const response = await api.get("/duta/dashboard");

      // Validasi response structure
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Invalid dashboard data structure"
        );
      }

      return response.data;
    } catch (error) {
      console.error("Dashboard error:", error);
      throw new Error("Failed to fetch dashboard data");
    }
  },

  getRecentDonations: async () => {
    try {
      const response = await api.get("/duta/donations", {
        params: {
          limit: 5,
          sort: "created_at",
          order: "desc",
        },
      });

      // Validasi response structure
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Invalid recent donations data structure"
        );
      }

      return response.data;
    } catch (error) {
      console.error("Recent donations error:", error);
      throw new Error("Failed to fetch donations data");
    }
  },
};

export default api;
