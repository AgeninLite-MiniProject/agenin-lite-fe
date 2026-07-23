import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Otomatis menyuntikkan Access Token ke setiap request (jika ada)
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isHandlingBanned = false;

// Response Interceptor: Menangani error 401 dan 403 (banned account)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/logout');

    if ((error.response?.status === 403 || error.response?.data?.error_code === 'AUTH_0011') && !isAuthEndpoint) {
      if (!isHandlingBanned) {
        isHandlingBanned = true;
        toast.dismiss();
        toast.error('Akun ini telah di-ban oleh Admin.', { id: 'banned-toast', duration: 4000 });

        setTimeout(() => {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          isHandlingBanned = false;
        }, 3000);
      }
      // Kembalikan pending promise agar try...catch di komponen tidak memicu toast tambahan
      return new Promise(() => { });
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setAuth } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error('Refresh token tidak tersedia');
        }

        // Tembak API refresh token (Pastikan tidak pakai apiClient agar tidak terjadi loop)
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;
        const newRole = response.data.role || useAuthStore.getState().role;
        const currentName = response.data.name || useAuthStore.getState().name;

        setAuth(newAccessToken, newRefreshToken, newRole, currentName);

        // Beritahu semua request yang antre bahwa refresh sukses
        processQueue(null, newAccessToken);

        // Ulangi request yang gagal tadi dengan token yang baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal, tolak semua antrean request
        processQueue(refreshError, null);

        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
