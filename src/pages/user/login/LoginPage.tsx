import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      
      if(response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        
        // Simpan token ke Zustand (otomatis masuk LocalStorage)
        setAuth(accessToken, refreshToken);
        
        toast.success("Login Berhasil!");
        // Beri sedikit jeda agar toast terlihat sebelum pindah halaman
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorCode = error.response.data?.code || error.response.data?.errorCode;
        const errorMessage = error.response.data?.message;
        
        switch (errorCode) {
          case 'AUTH_0010':
            setError('phone', { type: 'manual', message: 'Nomor telepon atau password salah!' });
            setError('password', { type: 'manual', message: 'Nomor telepon atau password salah!' });
            break;
          case 'AUTH_0011':
            toast.error('Akun ini telah dihapus atau diblokir.');
            break;
          default:
            toast.error(errorMessage || 'Terjadi kesalahan saat login. Silakan coba lagi.');
        }
      } else {
        toast.error('Gagal terhubung ke server.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex-1 flex text-gray-900 bg-gray-50">
        
        {/* Bagian Kiri: Hero Section */}
        <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 bg-gradient-to-br from-blue-700 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="20" cy="20" r="15" fill="white" className="animate-pulse"></circle>
              <circle cx="80" cy="50" r="20" fill="white"></circle>
              <circle cx="30" cy="80" r="18" fill="white"></circle>
              <line x1="20" y1="20" x2="80" y2="50" stroke="white" strokeWidth="1"></line>
              <line x1="80" y1="50" x2="30" y2="80" stroke="white" strokeWidth="1"></line>
            </svg>
          </div>

          <div className="relative z-10 flex items-center space-x-3">
            <span className="material-symbols-outlined text-white text-5xl">hub</span>
            <span className="text-3xl font-bold text-white tracking-tight">AgeninLite</span>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Selamat datang kembali, Agent!
            </h2>
            <p className="text-blue-100 text-lg max-w-md">
              Masuk untuk melihat performa penjualanmu dan kelola jaringan downline-mu.
            </p>
          </div>
          <div className="relative z-10"></div>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
          
          <div className="max-w-[440px] w-full">
            {/* Mobile Logo */}
            <div className="flex lg:hidden flex-col items-center justify-center space-y-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-blue-700 text-4xl">hub</span>
                <span className="text-2xl font-bold text-blue-700">AgeninLite</span>
              </div>
            </div>

            {/* CARD WRAPPER */}
            <div className="bg-white shadow-xl shadow-blue-900/5 rounded-2xl border border-gray-100 p-8 sm:p-10">
              
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Masuk Akun</h1>
                <p className="text-gray-500 mt-2">Silakan masukkan nomor telepon dan password kamu.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Nomor Telepon */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register("phone")}
                    className={`block w-full rounded-lg border bg-white h-12 px-4 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors">Lupa password?</a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={`block w-full rounded-lg border bg-white h-12 pl-4 pr-10 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center items-center h-12 rounded-lg bg-blue-700 text-white font-semibold shadow-sm hover:bg-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-70 transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memproses...</span>
                      </span>
                    ) : "Masuk"}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun? <a className="font-semibold text-blue-700 hover:text-blue-800 transition-colors" href="/register">Daftar sekarang</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Komponen Eksternal */}
      <Footer />
    </div>
  );
}
