import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Receipt, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDownlineDetail } from "@/hooks/useDownlineDetail";

export default function DownlineDetailPage() {

  const { id } = useParams<{ id: string }>();
  const { data: detailData, isLoading, isError } = useDownlineDetail(id || "");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp").trim();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !detailData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <p className="text-destructive font-semibold text-lg mb-2">Gagal memuat detail downline</p>
        <Link to="/downline" className="text-primary hover:underline mt-2">Kembali ke Daftar Downline</Link>
      </div>
    );
  }

  const { agent, profit_income_from_agent, content: transactions } = detailData;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* BACK BUTTON */}
      <Link to="/downline" className="inline-flex items-center text-[13px] text-slate-500 hover:text-slate-800 font-medium mb-2 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Downline
      </Link>
      {/* AGENT DETAIL CARD */}
      <Card className="rounded-[24px] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-slate-50 shadow-sm bg-slate-100 shrink-0">
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">{agent.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-6 w-full">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
                  <Badge variant="secondary" className={
                    agent.status === "ACTIVE" 
                      ? "bg-green-100/70 text-green-700 hover:bg-green-100/70 border-transparent text-[10px] px-2.5 py-0.5 rounded-md font-medium"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-transparent text-[10px] px-2.5 py-0.5 rounded-md font-medium"
                  }>
                    {agent.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {agent.phone}
                  </div>
                  {agent.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {agent.email}
                    </div>
                  )}
                </div>
              </div>
              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-[#F8F9FE] p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-colors">
                  <p className="text-[11px] text-slate-500 mb-1 font-medium">Tanggal Bergabung</p>
                  <p className="font-semibold text-sm text-slate-900">{formatDate(agent.joined_at)}</p>
                </div>
                <div className="bg-[#F8F9FE] p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-colors">
                  <p className="text-[11px] text-slate-500 mb-1 font-medium">Transaksi Terakhir</p>
                  <p className="font-semibold text-sm text-slate-900">{agent.last_transaction_at ? formatDate(agent.last_transaction_at) : "-"}</p>
                </div>
                <div className="bg-green-50/80 p-4 rounded-2xl border border-transparent hover:border-green-100 transition-colors">
                  <p className="text-[11px] text-green-700/80 mb-1 font-medium">Total Komisi Dihasilkan</p>
                  <p className="font-semibold text-sm text-green-700">{formatCurrency(profit_income_from_agent)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* TRANSACTIONS SECTION */}
      <div className="pt-6">
        <div className="flex items-center gap-2.5 mb-5 px-1">
          <Receipt className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
        </div>
        <div className="space-y-4">
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Belum ada riwayat transaksi.</div>
          ) : (
            transactions.map((trx) => (
              <Card key={trx.id} className="rounded-[20px] border-slate-100 shadow-sm hover:shadow-md transition-all bg-white group">
                <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-[14px] text-slate-900 leading-snug">{trx.product_name}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {trx.quantity} Unit • {formatCurrency(trx.amount)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDate(trx.completed_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-transparent text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-md">
                      {trx.status}
                    </Badge>
                    <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                      <div className="bg-slate-50 px-2.5 py-1 rounded-full sm:bg-transparent sm:p-0">
                        <p className="text-[10px] text-slate-400 mb-0.5 font-medium hidden sm:block">Komisi Anda</p>
                        <p className="font-bold text-[13px] text-green-600">
                          <span className="sm:hidden text-slate-500 font-normal mr-1 text-[11px]">Komisi Anda:</span>
                          + {formatCurrency(trx.commission_earned)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
