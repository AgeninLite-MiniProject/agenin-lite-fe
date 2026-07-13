import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  role: 'AGENT' | 'ADMIN' | '';
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, role: 'AGENT' | 'ADMIN' | '') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      refreshToken: '',
      role: '',
      isAuthenticated: false,
      
      // dipanggil saat Login atau Refresh Token berhasil
      setAuth: (accessToken, refreshToken, role) => 
        set({ accessToken, refreshToken, role, isAuthenticated: true }),
        
      // dipanggil saat Logout atau Refresh Token expired
      logout: () => 
        set({ accessToken: '', refreshToken: '', role: '', isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // simpan di Local Storage
    }
  )
);
