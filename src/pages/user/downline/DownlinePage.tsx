import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Inbox, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useReceivedPendingInvitationsQuery } from "@/hooks/useReceivedInvitations";
import { ErrorState } from "@/components/ui/ErrorState";
import Image500 from "@/assets/500-error.webp";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DownlinePage = () => {
  const { data: dashboard, isLoading, isError } = useDashboardSummary();
  const { data: receivedInbox } = useReceivedPendingInvitationsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "PASSIVE"
  >("ALL");

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <ErrorState 
        title="Gagal memuat data Downline"
        message="Terjadi kesalahan saat mengambil daftar downline dari server."
        imageSrc={Image500}
      />
    );
  }

  const pendingCount = receivedInbox?.invitations.length ?? 0;

  const filteredAgents = dashboard.downliners.filter((agent) => {
    const matchSearch =
      agent.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phone_number.includes(searchQuery);
    const matchStatus =
      filterStatus === "ALL" ? true : agent.user_status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Downline Saya
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Kelola jaringan agen Anda dan lihat performa mereka.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/downline/incoming">
            <Button
              variant="outline"
              className="rounded-full px-4 font-medium text-primary border-primary hover:bg-primary/5 hover:text-primary relative"
            >
              <Inbox className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Permintaan Masuk
              {pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/downline/invite">
            <Button className="rounded-full w-full bg-gradient-to-br from-blue-700 to-blue-900/85">
              <Send className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Kirim Undangan
            </Button>
          </Link>
        </div>
      </div>
      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[380px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            strokeWidth={1.5}
          />
          <Input
            type="text"
            placeholder="Cari nama atau nomor telepon agent..."
            className="pl-9 rounded-full bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="inline-flex items-center bg-slate-200/50 p-1 rounded-full shrink-0">
          <Button
            onClick={() => setFilterStatus("ALL")}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full h-8 px-4 md:px-5 text-xs md:text-sm font-medium transition-all",
              filterStatus === "ALL"
                ? "border-0 bg-gradient-to-br from-blue-700 to-blue-900/85 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All
          </Button>
          <Button
            onClick={() => setFilterStatus("ACTIVE")}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full h-8 px-4 md:px-5 text-xs md:text-sm font-medium transition-all",
              filterStatus === "ACTIVE"
                ? "border-0 bg-gradient-to-br from-blue-700 to-blue-900/85 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Active
          </Button>
          <Button
            onClick={() => setFilterStatus("PASSIVE")}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full h-8 px-4 md:px-5 text-xs md:text-sm font-medium transition-all",
              filterStatus === "PASSIVE"
                ? "border-0 bg-gradient-to-br from-blue-700 to-blue-900/85 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Passive
          </Button>
        </div>
      </div>
      {/* GRID */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Tidak ada agent yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredAgents.map((agent) => (
            <Link
              to={`/downline/${agent.user_id}`}
              key={agent.user_id}
              className="block"
            >
              <Card className="rounded-xl shadow-sm border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-0 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-blue-700 to-blue-900 text-white font-semibold">
                          {agent.user_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-[15px] text-slate-800 leading-tight">
                          {agent.user_name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {agent.phone_number}
                        </p>
                      </div>
                    </div>
                    {agent.user_status === "ACTIVE" ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-600 px-2.5 py-0.5 text-[10px] font-medium rounded-md"
                      >
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-slate-500 text-slate-600 px-2.5 py-0.5 text-[10px] font-medium rounded-md"
                      >
                        PASSIVE
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default DownlinePage;
