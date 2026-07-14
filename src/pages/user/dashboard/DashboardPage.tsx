import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Send, Copy, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardSummary } from "@/hooks/useDashboard";

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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <p className="text-destructive font-semibold text-lg mb-2">Gagal memuat data Dashboard</p>
        <p className="text-muted-foreground">{error?.message || "Terjadi kesalahan pada server"}</p>
      </div>
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
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Selamat datang, {user.user_name}
            </h1>
            <TooltipProvider delayDuration={200}>
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
                          ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {user.user_status}
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-center">
                  {user.user_status === "PASSIVE" 
                    ? <p>Selesaikan 1 transaksi untuk mulai bisa mengundang orang lain</p>
                    : <p>Status Anda aktif! Bagikan kode referral untuk mendapatkan downline.</p>
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Here is a summary of your agent activity and performance.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Button variant="outline" className="rounded-full flex-1 md:flex-none text-primary border-primary hover:text-primary/90">
            <Calculator className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Simulasi Transaksi
          </Button>
          <Link to="/downline/invite" className="flex-1 md:flex-none">
            <Button className="rounded-full w-full">
              <Send className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Kirim Undangan
            </Button>
          </Link>
        </div>
      </div>
      {/* BANNER SECTION */}
      <div className="bg-primary/5 rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 border border-primary/10">
        <div className="flex items-center gap-5">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-primary mb-1">Ajak teman dan dapatkan Super Agent Fee</h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">Bagikan kode referral Anda kepada rekan untuk bergabung sebagai downline dan nikmati tambahan komisi dari setiap transaksi mereka.</p>
          </div>
        </div>
        <div className="bg-background rounded-full py-1.5 px-2 flex items-center justify-between w-full lg:w-auto gap-2 border shadow-sm mt-2 lg:mt-0">
          <span className="font-medium text-sm px-3 tracking-wide">{user.referral_code}</span>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm" 
              variant="outline" 
              className={`rounded-full h-7 px-3 flex items-center gap-1.5 transition-colors ${
                isCopied ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-700" : ""
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
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </motion.div>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Agent Langsung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold">{dashboard.downliners.length}</span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Maksimal 10 agent langsung</p>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Menunggu Respon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold">{dashboard.pending_invitations_sent || 0}</span>
              <span className="text-sm text-muted-foreground">/ 3</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Maksimal 3 undangan tertunda</p>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card className="rounded-2xl shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Komisi
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="mb-3">
              <span className="text-3xl font-bold text-green-600">{formatRupiah(dashboard.total_commission)}</span>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Agent Fee</span>
                <span className="font-medium">{formatRupiah(dashboard.total_agent_fee)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-primary font-medium">Super Agent Fee</span>
                <span className="font-medium text-primary">{formatRupiah(dashboard.total_super_agent_fee)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* RECENT ACTIVITY */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
          <CardTitle className="text-lg font-semibold">Aktivitas Terakhir</CardTitle>
          <Button variant="link" className="text-primary h-auto p-0 font-medium text-sm">Lihat Semua</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            
            {dashboard.recent_commissions.length === 0 ? (
               <div className="p-6 text-center text-muted-foreground text-sm">
                 Belum ada aktivitas komisi baru.
               </div>
            ) : (
              dashboard.recent_commissions.map((comm) => (
                <div key={comm.commission_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 gap-2 sm:gap-0 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">Transaksi {comm.product_name} oleh {comm.user_name}</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0">COMPLETED</Badge>
                      </div>
                      <p className="text-xs font-medium text-green-600">+ {formatRupiah(comm.commission_amount)} {comm.commission_type === 'AGENT_FEE' ? 'Agent Fee' : 'Super Agent Fee'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground self-start sm:self-auto">{formatDate(comm.created_at)}</p>
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