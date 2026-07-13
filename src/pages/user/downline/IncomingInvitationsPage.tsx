import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const mockIncoming = [
  {
    id: 1,
    name: "Budi Santoso",
    phone: "0812-xxxx-xxxx",
    time_ago: "Dikirim 2 jam yang lalu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi2"
  },
  {
    id: 2,
    name: "Siti Aminah",
    phone: "0856-xxxx-xxxx",
    time_ago: "Dikirim 1 hari yang lalu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti2"
  }
];

export default function IncomingInvitationsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-4xl mx-auto w-full min-h-[calc(100vh-140px)]">
      {/* BACK BUTTON */}
      <div className="mb-6 md:mb-10 pt-4">
        <Link to="/downline" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
        </Link>
      </div>

      {/* HEADER INFO */}
      <div className="mb-8 md:mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-[34px] font-heading font-bold text-slate-900 mb-4 tracking-tight">Undangan Jaringan Masuk</h1>
        <p className="text-slate-500 text-[15px] leading-relaxed">
          Pilih salah satu undangan untuk bergabung ke jaringan Agent. Setelah Anda menerima satu undangan, undangan lainnya akan otomatis dibatalkan.
        </p>
      </div>

      {/* LIST OF INVITATIONS */}
      <div className="space-y-3">
        {mockIncoming.map((inv) => (
          <Card key={inv.id} className="rounded-xl border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
            <CardContent className="px-5 py-4 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar className="h-11 w-11 border border-slate-100 shadow-sm">
                  <AvatarImage src={inv.image} alt={inv.name} />
                  <AvatarFallback>{inv.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-[15px] text-slate-900 leading-tight">{inv.name}</h3>
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="h-3 w-3" />
                      {inv.phone}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3 w-3" />
                      {inv.time_ago}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0">
                <Button variant="outline" className="flex-1 sm:flex-none rounded-full px-5 text-slate-600 border-slate-300 hover:bg-slate-50 font-semibold h-9 text-[13px]">
                  Tolak
                </Button>
                <Button className="flex-1 sm:flex-none rounded-full px-5 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold h-9 text-[13px] shadow-[0_4px_14px_0_rgba(0,76,209,0.3)]">
                  Terima Undangan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
