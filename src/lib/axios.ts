import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response Interceptor: Menangani error 401 dan melakukan auto-refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

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

        setAuth(newAccessToken, newRefreshToken, newRole);

        // Ulangi request yang gagal tadi dengan token yang baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Jika refresh token juga gagal/expired, paksa user logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
