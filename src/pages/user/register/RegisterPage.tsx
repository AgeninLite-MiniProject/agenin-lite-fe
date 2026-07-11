import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const { confirm_password, ...payload } = data;
    
    try {
      const response = await apiClient.post('/api/auth/register', payload);
      if(response.status === 201) {
        toast.success("Registrasi Akun Berhasil! Silakan login.");
        navigate("/login")
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorCode = error.response.data?.code || error.response.data?.errorCode;
        const errorMessage = error.response.data?.message;
        switch (errorCode) {
          case 'AUTH_0001':
            setError('phone', { type: 'manual', message: 'Nomor telepon sudah terdaftar!' });
            break;
          case 'AUTH_0004':
            setError('email', { type: 'manual', message: 'Email ini sudah terdaftar!' });
            break;
          case 'AUTH_0006':
            setError('referral_code', { type: 'manual', message: 'Kode referral tidak valid atau tidak ditemukan.' });
            break;
          case 'AUTH_0007':
            setError('referral_code', { type: 'manual', message: 'Pemilik kode referral ini sudah mencapai batas maksimum downliner.' });
            break;
          case 'AUTH_0008':
            setError('referral_code', { type: 'manual', message: 'Pemilik kode referral ini sudah tidak aktif/dihapus.' });
            break;
          default:
            toast.error(errorMessage || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        }
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
              Mulai jual produk & <br/>bangun jaringan Agent kamu.
            </h2>
            <p className="text-blue-100 text-lg max-w-md">
              Bergabunglah dengan ribuan agent lainnya untuk meraih keuntungan maksimal.
            </p>
          </div>
          <div className="relative z-10"></div>
        </div>

        {/* Bagian Kanan: Form */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
          
          <div className="max-w-[500px] w-full">
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
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daftar Akun</h1>
                <p className="text-gray-500 mt-2">Silakan lengkapi data diri kamu di bawah ini.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    {...register("name")}
                    className={`block w-full rounded-lg border bg-white h-12 px-4 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

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
                  {errors.phone ? (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Gunakan format angka, misal: 08123456789</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    {...register("email")}
                    className={`block w-full rounded-lg border bg-white h-12 px-4 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Group (Side by Side on Desktop) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                    {errors.password ? (
                      <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">Minimal 8 karakter</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                      <input
                        id="confirm_password"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirm_password")}
                        className={`block w-full rounded-lg border bg-white h-12 pl-4 pr-10 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                          errors.confirm_password
                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </div>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </div>

                {/* Kode Referral */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="referral_code" className="block text-sm font-medium text-gray-700">Kode Referral</label>
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Opsional</span>
                  </div>
                  <input
                    id="referral_code"
                    type="text"
                    placeholder="AGN-XXXX"
                    {...register("referral_code")}
                    className={`block w-full rounded-lg border bg-white h-12 px-4 uppercase outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                      errors.referral_code
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                  {errors.referral_code && (
                    <p className="text-sm text-red-500 mt-1">{errors.referral_code.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
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
                        <span>Mendaftar...</span>
                      </span>
                    ) : "Daftar Sekarang"}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun? <a className="font-semibold text-blue-700 hover:text-blue-800 transition-colors" href="/login">Masuk di sini</a>
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
