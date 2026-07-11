import axios from 'axios';

const axiosClient = axios.create({
  // Gunakan variabel environment Vite, atau fallback ke localhost:8080
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Menyisipkan JWT Token (Access Token)
axiosClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('access_token'); 
    
    // Jika token ada dan endpoint BUKAN /auth/login atau /auth/register
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Menangani error (misal 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Jika API menolak dengan status 401 (Token Kadaluarsa) dan request belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // TODO: Implementasi logika refresh token jika nanti sudah siap
        // const refreshToken = localStorage.getItem('refresh_token');
        // const res = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
        // localStorage.setItem('access_token', res.data.accessToken);
        // originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        // return axiosClient(originalRequest);
        
        // Untuk sekarang, jika 401 kita paksa hapus token dan kembali ke halaman login
        console.warn("Token expired atau tidak valid. Mengarahkan ke halaman login...");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
