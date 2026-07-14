import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";

// --- Animasi Peta Titik (Dot Map) disesuaikan dengan warna biru AgeninLite ---
type RoutePoint = {
  x: number;
  y: number;
  delay: number;
};

const DotMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
    // Top routes
    { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: "#93c5fd" },
    { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: "#93c5fd" },
    { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: "#93c5fd" },
    { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: "#93c5fd" },
    // Bottom routes
    { start: { x: 120, y: 450, delay: 1 }, end: { x: 220, y: 520, delay: 3 }, color: "#93c5fd" },
    { start: { x: 220, y: 520, delay: 3 }, end: { x: 320, y: 460, delay: 5 }, color: "#93c5fd" },
    { start: { x: 80, y: 550, delay: 1.5 }, end: { x: 180, y: 480, delay: 3.5 }, color: "#93c5fd" },
    { start: { x: 250, y: 420, delay: 0.5 }, end: { x: 150, y: 500, delay: 2.5 }, color: "#93c5fd" },
  ];

  const generateDots = (width: number, height: number) => {
    const dots = [];
    const gap = 12;
    const dotRadius = 1;

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({
            x,
            y,
            radius: dotRadius,
            opacity: Math.random() * 0.4 + 0.1, // Opasitas untuk background gelap
          });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement as Element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId: number;
    let startTime = Date.now();

    function drawDots() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`; // Titik putih
        ctx.fill();
      });
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000;
      
      routes.forEach(route => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;
        
        const duration = 3; 
        const progress = Math.min(elapsed / duration, 1);
        
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;
        
        ctx.beginPath();
        ctx.moveTo(route.start.x, route.start.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = route.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
        
        if (progress === 1) {
          ctx.beginPath();
          ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = route.color;
          ctx.fill();
        }
      });
    }
    
    function animate() {
      drawDots();
      drawRoutes();
      
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) { 
        startTime = Date.now();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-90">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

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
        const { access_token, refresh_token, role, name } = response.data;
        
        setAuth(access_token, refresh_token, role, name);
        
        toast.success("Login Berhasil!");
        setTimeout(() => {
          if (role === 'ADMIN') navigate("/admin");
          else navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const backendMessage = error.response.data?.message || "";
        
        let errorCode = error.response.data?.error_code || 
                        error.response.data?.errorCode || 
                        error.response.data?.code;

        if (!errorCode && backendMessage.includes(':')) {
          errorCode = backendMessage.split(':')[0].trim();
        }
        
        switch (errorCode) {
          case 'AUTH_0010':
            setError('phone_number', { type: 'manual', message: 'Nomor telepon atau password salah!' });
            setError('password', { type: 'manual', message: 'Nomor telepon atau password salah!' });
            break;
          case 'AUTH_0011':
            toast.error('Akun ini telah di-soft-delete oleh Admin.');
            break;
          default:
            const cleanMessage = backendMessage.includes(':') 
              ? backendMessage.split(':').slice(1).join(':').trim() 
              : backendMessage;
              
            toast.error(cleanMessage || 'Terjadi kesalahan saat login. Silakan coba lagi.');
        }
      } else {
        toast.error('Gagal terhubung ke server.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex-1 flex w-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl overflow-hidden rounded-2xl flex bg-white shadow-xl min-h-[600px] border border-gray-100"
        >
          {/* Left side - Map Animasi */}
          <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900">
            <DotMap />
            
            {/* Logo dan Teks */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10 bg-black/10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-6"
              >
                <img
                  src="/src/assets/ageninlitewhite2.webp"
                  alt="AgeninLite Logo"
                  className="h-14 w-auto drop-shadow-md"
                />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-3xl font-bold text-center text-white tracking-wide drop-shadow-md"
              >
                Grow Together
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-sm text-center text-blue-100 max-w-xs mt-2 drop-shadow-sm leading-relaxed"
              >
                Masuk untuk kelola jaringan downline dan nikmati komisi penjualan tanpa batas.
              </motion.p>
            </div>
          </div>
          
          {/* Right side - Form Login (Tetap Mempertahankan Validasi Asli) */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[440px] w-full mx-auto"
            >
              {/* Mobile Logo */}
              <div className="flex lg:hidden flex-col items-center justify-center space-y-4 mb-8">
                <img
                  src="/src/assets/ageninliteBlue.webp"
                  alt="AgeninLite Logo"
                  className="h-8 w-auto"
                />
              </div>

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
                    placeholder="+628xxxxxxxxxx"
                    {...register("phone_number")}
                    className={`block w-full rounded-lg border bg-white h-12 px-4 outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                      errors.phone_number
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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

                {/* Submit Button (Animated) */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
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
                </motion.div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun? <a className="font-semibold text-blue-700 hover:text-blue-800 transition-colors" href="/register">Daftar sekarang</a>
                </p>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
