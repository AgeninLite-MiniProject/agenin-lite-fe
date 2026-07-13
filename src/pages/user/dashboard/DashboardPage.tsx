import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const DashboardPage = () => {
  const userName = "Agent"; // TODO: Fetch from dashboard API later

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Selamat datang, {userName}</h1>
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
          <span className="font-medium text-sm px-3">AGN - 7X2K</span>
          <Button size="sm" variant="outline" className="rounded-full h-7 px-3">
            Salin
          </Button>
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
              <span className="text-3xl font-bold">4</span>
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
              <span className="text-3xl font-bold">2</span>
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
              <span className="text-3xl font-bold text-green-600">Rp 850.000</span>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Agent Fee</span>
                <span className="font-medium">Rp 600.000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-primary font-medium">Super Agent Fee</span>
                <span className="font-medium text-primary">Rp 250.000</span>
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
            
            {/* Item 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 gap-2 sm:gap-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm">Transaksi Paket Perdana</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0">COMPLETED</Badge>
                  </div>
                  <p className="text-xs font-medium text-green-600">+ Rp 50.000 Agent Fee</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground self-start sm:self-auto">Hari ini, 10:42</p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 gap-2 sm:gap-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm">Siti Aminah menerima undangan Anda</p>
                  </div>
                  <p className="text-xs font-medium text-primary">
                    Masuk Jaringan
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground self-start sm:self-auto">Kemarin, 14:30</p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 gap-2 sm:gap-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm">Simulasi Transaksi</p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] px-1.5 py-0">FAILED</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Sistem timeout, silakan coba lagi.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground self-start sm:self-auto">2 Nov, 09:15</p>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;