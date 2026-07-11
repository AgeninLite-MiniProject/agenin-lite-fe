import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      refreshToken: '',
      isAuthenticated: false,
      
      // dipanggil saat Login atau Refresh Token berhasil
      setAuth: (accessToken, refreshToken) => 
        set({ accessToken, refreshToken, isAuthenticated: true }),
        
      // dipanggil saat Logout atau Refresh Token expired
      logout: () => 
        set({ accessToken: '', refreshToken: '', isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // simpan di Local Storage
    }
  )
);
