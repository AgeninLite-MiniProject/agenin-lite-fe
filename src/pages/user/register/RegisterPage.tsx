import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/validations/auth.schema";
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
      console.log("Data Siap Kirim ke API!", payload);
      // axios fetching
      const response = await apiClient.post('/api/auth/register', payload);
      if(response.status === 201) {
        toast.success("Registrasi Akun Berhasil! Silakan login.");
        navigate("/login")
      }
    } catch (error) {
      console.error("Gagal Mendaftar!", error);
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
            setError('referral_code', { type: 'manual', message: 'Pemilik kode referral ini sudah mencapai batas maksimum downliner (10).' });
            break;
          case 'AUTH_0008':
            setError('referral_code', { type: 'manual', message: 'Pemilik kode referral ini sudah tidak aktif/dihapus.' });
            break;
          default:
            // Error generic kalau tidak masuk case di atas
            toast.error(errorMessage || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-surface-container-lowest flex-1 flex font-body-md text-on-surface">
        {/* Bagian Kiri: Hero Section */}
        <div className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-12 bg-gradient-to-br from-[#1B56FD] to-[#0118D8] overflow-hidden">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="20" cy="20" r="10" fill="white"></circle>
              <circle cx="80" cy="50" r="15" fill="white"></circle>
              <circle cx="30" cy="80" r="12" fill="white"></circle>
              <line x1="20" y1="20" x2="80" y2="50" stroke="white" strokeWidth="2"></line>
              <line x1="80" y1="50" x2="30" y2="80" stroke="white" strokeWidth="2"></line>
            </svg>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center space-x-3">
            <span className="material-symbols-outlined text-white text-4xl">hub</span>
            <span className="font-headline-xl text-white">Agentin</span>
          </div>

          {/* Headline */}
          <div className="relative z-10 space-y-6">
            <h2 className="font-headline-xl text-white leading-tight">
              Mulai jual produk dan bangun jaringan Agent kamu
            </h2>
          </div>
          
          {/* Decorative spacer for bottom */}
          <div className="relative z-10"></div>
        </div>

        {/* Bagian Kanan: Form */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest relative">
          <div className="max-w-[480px] w-full space-y-8">
            
            {/* Mobile Logo */}
            <div className="flex lg:hidden flex-col items-center justify-center space-y-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary text-4xl">hub</span>
                <span className="font-headline-xl text-primary">Agentin</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-headline-lg text-on-surface">Daftar Akun Agentin</h1>
              <p className="font-body-md text-outline lg:hidden">Mulai jual produk dan bangun jaringan Agent kamu</p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label htmlFor="name" className="block font-label-md text-on-surface">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  {...register("name")}
                  className={`block w-full rounded-full h-12 px-4 focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${
                    errors.name
                      ? "border-error focus:ring-error focus:border-error"
                      : "border-outline-variant"
                  }`}
                />
                {errors.name && (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.name.message}</p>
                )}
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block font-label-md text-on-surface">Nomor Telepon</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  {...register("phone")}
                  className={`block w-full rounded-full h-12 px-4 focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${
                    errors.phone ? "border-error focus:ring-error focus:border-error" : "border-outline-variant"
                  }`}
                />
                {errors.phone ? (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.phone.message}</p>
                ) : (
                  <p className="font-label-sm text-outline mt-1 px-2">Digunakan sebagai ID unik & untuk login</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="email" className="block font-label-md text-on-surface">Email</label>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  {...register("email")}
                  className={`block w-full rounded-full h-12 px-4 focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${
                    errors.email ? "border-error focus:ring-error focus:border-error" : "border-outline-variant"
                  }`}
                />
                {errors.email && (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block font-label-md text-on-surface">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="•••••••••••••••"
                    {...register("password")}
                    className={`block w-full rounded-full h-12 px-4 pr-12 focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${
                      errors.password ? "border-error focus:ring-error focus:border-error" : "border-outline-variant"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer">
                    <span className="material-symbols-outlined text-outline">visibility</span>
                  </div>
                </div>
                {errors.password ? (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.password.message}</p>
                ) : (
                  <p className="font-label-sm text-outline mt-1 px-2">8-15 karakter</p>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-2">
                <label htmlFor="confirm_password" className="block font-label-md text-on-surface">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="•••••••••••••••"
                    {...register("confirm_password")}
                    className={`block w-full rounded-full h-12 px-4 pr-12 focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${
                      errors.confirm_password ? "border-error focus:ring-error focus:border-error" : "border-outline-variant"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer">
                    <span className="material-symbols-outlined text-outline">visibility_off</span>
                  </div>
                </div>
                {errors.confirm_password && (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.confirm_password.message}</p>
                )}
              </div>

              {/* Kode Referral */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="referral_code" className="block font-label-md text-on-surface">Kode Referral</label>
                  <span className="inline-flex items-center rounded-full bg-surface-variant px-2.5 py-0.5 font-label-sm text-on-surface-variant">Opsional</span>
                </div>
                <input
                  id="referral_code"
                  type="text"
                  placeholder="AGN-7X2K"
                  {...register("referral_code")}
                  className={`block w-full rounded-full h-12 px-4 focus:ring-primary focus:border-primary sm:text-sm text-on-surface uppercase ${
                    errors.referral_code ? "border-error focus:ring-error focus:border-error" : "border-outline-variant"
                  }`}
                />
                {errors.referral_code ? (
                  <p className="font-label-sm text-error mt-1 px-2">{errors.referral_code.message}</p>
                ) : (
                  <p className="font-label-sm text-outline mt-1 px-2">Isi jika kamu diajak Agent lain</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center items-center h-12 rounded-full bg-primary px-4 py-3.5 font-label-md text-on-primary shadow-sm hover:bg-primary-container disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Mendaftar..." : "Daftar Sekarang"}
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <p className="font-body-sm text-on-surface-variant">
                Sudah punya akun? <a className="font-label-md text-primary hover:text-primary-container underline" href="/login">Masuk di sini</a>
              </p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer Komponen Eksternal */}
      <Footer />
    </div>
  );
}
