import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Inbox, Send } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the agents to match the design screenshot
const mockAgents = [
  {
    id: 1,
    name: "Budi Santoso",
    phone: "+628123456789",
    status: "ACTIVE",
    referral: "AGN-4K7P",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
  },
  {
    id: 2,
    name: "Andi Wijaya",
    phone: "+628987654321",
    status: "PASSIVE",
    referral: "AGN-9J2R",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi"
  },
  {
    id: 3,
    name: "Siti Aminah",
    phone: "+628551234567",
    status: "ACTIVE",
    referral: "AGN-1M3T",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti"
  },
  {
    id: 4,
    name: "Rian Hidayat",
    phone: "+628112233445",
    status: "PASSIVE",
    referral: "AGN-5S8X",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rian"
  }
];

const DownlinePage = () => {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Downline Saya</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Kelola jaringan agen Anda dan lihat performa mereka.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/downline/incoming">
            <Button variant="outline" className="rounded-full px-6 font-medium text-primary border-primary hover:bg-primary/5 hover:text-primary">
              <Inbox className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Permintaan Masuk
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Button>
          </Link>
          <Link to="/downline/invite">
            <Button className="rounded-full px-6 font-medium">
              <Send className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Kirim Undangan
            </Button>
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <Input 
            type="text" 
            placeholder="Cari nama atau nomor telepon agent..." 
            className="pl-9 rounded-full bg-white border-slate-200"
          />
        </div>
        
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-full shrink-0">
          <Button variant="ghost" size="sm" className="rounded-full bg-white shadow-sm text-primary hover:text-primary hover:bg-white h-7 px-5 text-xs font-medium">Semua</Button>
          <Button variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-slate-700 h-7 px-5 text-xs font-medium">Aktif</Button>
          <Button variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-slate-700 h-7 px-5 text-xs font-medium">Pasif</Button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {mockAgents.map(agent => (
          <Link to={`/downline/${agent.id}`} key={agent.id} className="block">
            <Card className="rounded-xl shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-100 bg-slate-50">
                      <AvatarImage src={agent.image} alt={agent.name} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-[15px] text-slate-800 leading-tight">{agent.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{agent.phone}</p>
                    </div>
                  </div>
                  {agent.status === "ACTIVE" ? (
                    <Badge variant="secondary" className="bg-green-50 hover:bg-green-100 text-green-700 border-transparent px-2.5 py-0.5 text-[10px] font-medium rounded-md">
                      ACTIVE
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent px-2.5 py-0.5 text-[10px] font-medium rounded-md">
                      PASSIVE
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DownlinePage;
