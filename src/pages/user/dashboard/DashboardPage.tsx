import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Send, Copy, Check, Loader2, Users, Clock, Wallet, ChevronRight, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { DotMap } from "@/components/ui/DotMap";
import { ErrorState } from "@/components/ui/ErrorState";
import Image500 from "@/assets/500-error.webp";

const DashboardPage = () => {
  const { data: dashboard, isLoading, isError, error } = useDashboardSummary();
  
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !dashboard) {
    return (
      <ErrorState 
        title="Gagal memuat data Dashboard"
        message={error?.message || "Terjadi kesalahan pada server saat mengambil data."}
        imageSrc={Image500}
      />
    );
  }

  const { user } = dashboard;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  }




  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">
              Selamat datang,{" "}
              <span className="bg-gradient-to-br from-blue-700 to-blue-900/80 text-white px-3.5 py-1 rounded-2xl inline-block">
                {user.user_name}
              </span>
            </h1>
            {/* <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex"
                  >
                    <Badge 
                      variant="outline" 
                      className={`cursor-help ${
                        user.user_status === "PASSIVE" 
                          ? "border-slate-500 text-slate-600"
                          : "border-green-500 text-green-600"
                      }`}
                    >
                      {user.user_status}
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-center">
                  {user.user_status === "PASSIVE" 
                    ? <p>Selesaikan 1 transaksi untuk berubah menjadi ACTIVE</p>
                    : <p>Status Anda aktif! Bagikan kode referral untuk mendapatkan downline.</p>
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
          {/* <p className="text-sm md:text-base text-muted-foreground mt-1">Here is a summary of your agent activity and performance.</p> */}
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Link to="/transaksi" className="flex-1 md:flex-none">
            <Button variant="outline" className="rounded-full w-full text-primary border-primary hover:text-primary/90">
              <Calculator className="mr-1 h-4 w-4" strokeWidth={1.5} />
              Transaksi
            </Button>
          </Link>
          <Link to="/downline/invite" className="flex-1 md:flex-none">
            <Button className="rounded-full w-full bg-gradient-to-br from-blue-700 to-blue-900/85">
              <Send className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Kirim Undangan
            </Button>
          </Link>
        </div>
      </div>
      {/* BANNER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <DotMap />
        
        {/* Pattern / Logo Overlay */}
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none z-0">
          <img src="/src/assets/ageninlitewhite2.webp" alt="" className="w-64 h-auto" />
        </div>

        <div className="relative z-10 flex-1 w-full text-center md:text-left">
          <motion.h3 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-md"
          >
            Grow Together
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-blue-100 max-w-2xl drop-shadow-sm leading-relaxed mx-auto md:mx-0"
          >
            Ajak teman dan dapatkan Super Agent Fee. Bagikan kode referral Anda kepada rekan untuk bergabung sebagai downline dan nikmati tambahan komisi.
          </motion.p>
        </div>
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="relative z-10 bg-white/10 backdrop-blur-md rounded-full py-2 px-3 flex items-center justify-between w-full md:w-auto gap-3 border border-white/20 shadow-xl"
        >
          <span className="font-semibold text-white px-3 tracking-widest text-lg">{user.referral_code}</span>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm" 
              className={`rounded-full h-8 px-4 flex items-center gap-2 transition-colors ${
                isCopied ? "bg-green-500 hover:bg-green-600 text-white border-transparent" : "bg-white text-blue-900 hover:bg-blue-50 border-transparent"
              }`}
              onClick={() => handleCopy(user.referral_code)}
            >
              {isCopied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Tersalin</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span className="font-medium">Salin</span>
                </motion.div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="rounded-2xl shadow-sm border-blue-100/50 bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
          {/* Watermark Icon */}
          <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Agent Langsung
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-slate-800">{dashboard.downliners.length}</span>
              <span className="text-sm font-medium text-slate-400">/ 10</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 mt-4 mb-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-3.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(dashboard.downliners.length / 10) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[13px] font-medium text-slate-500">Sisa {10 - dashboard.downliners.length} slot</span>
              <Link to="/downline" className="text-[14px] font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 mt-10">
                Kelola Jaringan <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Card 2 */}
        <Card className="rounded-2xl shadow-sm border-orange-100/50 bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
          {/* Watermark Icon */}
          <Clock className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Menunggu Respon
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-slate-800">{dashboard.pending_invitations_sent || 0}</span>
              <span className="text-sm font-medium text-slate-400">/ 3</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 mt-4 mb-2 overflow-hidden">
              <div 
                className="bg-orange-400 h-3.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${((dashboard.pending_invitations_sent || 0) / 3) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[13px] font-medium text-slate-500">Sisa {3 - (dashboard.pending_invitations_sent || 0)} slot undangan</span>
              <Link to="/downline/invite" className="text-[14px] font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 mt-10">
                Cek Status <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card className="rounded-2xl shadow-md relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 border-blue-800 text-white hover:shadow-lg transition-shadow">
          <DotMap />
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-200" />
              Total Komisi
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="mb-3">
              <span className="text-3xl font-bold text-white tracking-wide">{formatRupiah(dashboard.total_commission)}</span>
            </div>
            <div className="space-y-2 pt-3 border-t border-white/20">
              <div className="flex justify-between items-center text-xs bg-white/5 rounded-md p-1.5 px-2">
                <span className="text-blue-100 font-semibold tracking-wide uppercase text-[10px]">Agent Fee</span>
                <span className="font-bold text-white text-sm">{formatRupiah(dashboard.total_agent_fee)}</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-blue-500/20 rounded-md p-1.5 px-2 border border-blue-400/30">
                <span className="text-blue-50 font-bold tracking-wide uppercase text-[10px]">Super Agent Fee</span>
                <span className="font-bold text-blue-100 text-sm">{formatRupiah(dashboard.total_super_agent_fee)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* RECENT ACTIVITY */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 px-5 pt-4">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-primary text-slate-700" />
            Aktivitas Terakhir
          </CardTitle>
          <Link to="/riwayat">
            <Button variant="link" className="text-primary h-auto p-0 font-medium text-[13px]">Lihat Semua</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            
            {dashboard.recent_commissions.length === 0 ? (
               <div className="p-6 text-center text-muted-foreground text-sm">
                 Belum ada aktivitas komisi baru.
               </div>
            ) : (
              dashboard.recent_commissions.map((comm) => (
                <div key={comm.commission_id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-5 gap-3 sm:gap-0 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-700 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="font-medium text-sm text-slate-800 line-clamp-1">
                          Transaksi {comm.product_name} oleh <span className="font-semibold text-blue-700">{comm.user_name}</span>
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-green-600">
                        + {formatRupiah(comm.commission_amount)} <span className="text-slate-400 font-normal ml-1">({comm.commission_type === 'AGENT_FEE' ? 'Agent Fee' : 'Super Agent Fee'})</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5 ml-11 sm:ml-0">
                    <Badge variant="outline" className="border-green-500 text-green-600 text-[9px] px-1.5 py-1 pt-1.5 h-4">COMPLETED</Badge>
                    <p className="text-[11px] text-slate-400">{formatDate(comm.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardPage;