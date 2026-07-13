import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

const mockPending = [
  { id: 1, name: "Budi Santoso", phone: "+628123...", initials: "B" },
  { id: 2, name: "Siti Aminah", phone: "+628567...", initials: "S" },
];

export default function SendInvitationPage() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1000px] mx-auto w-full flex items-center justify-center min-h-[calc(100vh-140px)]">
      <Card className="w-full rounded-[32px] border-slate-200/60 shadow-sm overflow-hidden bg-white flex flex-col md:flex-row">
        
        {/* LEFT COLUMN - FORM */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100/80">
          <h1 className="text-3xl md:text-[34px] font-heading font-bold text-slate-900 leading-[1.15] mb-4">
            Kirim Undangan<br/>Agent<br/>Baru
          </h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-[15px] max-w-sm">
            Undang teman Anda untuk bergabung menjadi Agent. Anda memiliki kuota maksimal 3 undangan yang belum dikonfirmasi.
          </p>

          <form className="space-y-6 max-w-sm">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-slate-600">Nama Calon Agent</Label>
              <Input 
                placeholder="Masukkan nama lengkap" 
                className="rounded-full h-12 px-5 border-slate-200/80 bg-white"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-slate-600">Nomor Telepon (WhatsApp)</Label>
              <Input 
                placeholder="Contoh: 08123456789" 
                className="rounded-full h-12 px-5 border-slate-200/80 bg-white"
              />
            </div>

            <Button className="w-full rounded-full h-12 mt-4 text-[14px] font-semibold bg-primary hover:bg-primary/90">
              Kirim Undangan Sekarang 
              <Play className="ml-2 h-3.5 w-3.5 fill-current" />
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN - PENDING LIST */}
        <div className="flex-1 p-8 md:p-12 bg-white flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6 text-[15px]">Menunggu Konfirmasi (2/3)</h3>
          
          <div className="space-y-4">
            {mockPending.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3.5 pl-4 rounded-[28px] border border-slate-200/80 bg-white">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#E8E2CD] flex items-center justify-center text-[#5A5030] font-bold text-sm shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.phone}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[#E8E2CD]/60 text-[#5A5030] hover:bg-[#E8E2CD]/60 border-transparent text-[10px] font-bold px-3 py-1">
                  PENDING
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-16 text-center">
            <p className="text-[13px] text-slate-500 font-medium">Satu slot undangan tersedia.</p>
          </div>
        </div>

      </Card>
    </div>
  );
}
