import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Loader2, ChevronDown, CheckCircle2, HistoryIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDownlineDetail } from "@/hooks/useDownlineDetail";
import { ErrorState } from "@/components/ui/ErrorState";
import { DotMap } from "@/components/ui/DotMap";
import Image500 from "@/assets/500-error.webp";
import logoWhite from "@/assets/ageninlitewhite2.webp";

export default function DownlineDetailPage() {

  const { id } = useParams<{ id: string }>();
  const { data: detailData, isLoading, isError } = useDownlineDetail(id || "");

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (trxId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(trxId)) next.delete(trxId);
      else next.add(trxId);
      return next;
    });
  };

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
      <ErrorState 
        title="Gagal memuat detail downline"
        message="Terjadi kesalahan saat mengambil informasi detail agen dari server."
        imageSrc={Image500}
      />
    );
  }

  const { agentDetail, profit_income_from_agent, content: transactions } = detailData;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* BACK BUTTON */}
      <Link to="/downline" className="inline-flex items-center text-[13px] text-slate-500 hover:text-slate-800 font-medium mb-2 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Downline
      </Link>
      {/* AGENT DETAIL CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-lg">
        <DotMap />
        
        {/* Pattern / Logo Overlay */}
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none z-0">
          <img src={logoWhite} alt="AgeninLite" className="w-64 h-auto" />
        </div>

        <Avatar className="relative z-10 h-24 w-24 md:h-28 md:w-28 border-4 border-white/20 shadow-sm bg-blue-800 shrink-0">
          <AvatarFallback className="text-3xl font-bold bg-white/20 text-white">{agentDetail.user_name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="relative z-10 flex-1 space-y-6 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">{agentDetail.user_name}</h1>
              <Badge variant="outline" className={
                agentDetail.status === "ACTIVE" 
                  ? "border-green-400 text-green-300 bg-white/0 text-[10px] px-2.5 py-0.5 rounded-md font-bold border-2"
                  : "border-white/40 text-blue-100 bg-white/0 text-[10px] px-2.5 py-0.5 rounded-md font-bold border-2"
              }>
                {agentDetail.status}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {agentDetail.phone_number}
              </div>
              {agentDetail.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {agentDetail.email}
                </div>
              )}
            </div>
          </div>
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-[11px] text-blue-200 mb-1 font-medium">Tanggal Bergabung</p>
              <p className="font-semibold text-sm text-white">{formatDate(agentDetail.joined_at)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-[11px] text-blue-200 mb-1 font-medium">Transaksi Terakhir</p>
              <p className="font-semibold text-sm text-white">{agentDetail.last_transaction_at ? formatDate(agentDetail.last_transaction_at) : "-"}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/30">
              <p className="text-[11px] text-blue-100 mb-1 font-medium">Total Komisi Dihasilkan</p>
              <p className="font-semibold text-sm text-white">{formatCurrency(profit_income_from_agent)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* TRANSACTIONS SECTION */}
      <div className="pt-6">
        <div className="flex items-center gap-2.5 mb-5 px-1">
          <HistoryIcon className="h-5 w-5 text-slate-900" strokeWidth={2.5} />
          <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
        </div>
        <div className="space-y-4">
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Belum ada riwayat transaksi.</div>
          ) : (
            transactions.map((trx) => {
              const id = trx.trxId || trx.trx_id || "";
              const totalItemsCount = trx.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
              const isExpanded = expandedIds.has(id);
              
              return (
                <Card key={id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
                  <div 
                    className="p-4 md:p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => toggleExpand(id)}
                  >
                    {/* Icon */}
                    <div className="shrink-0 w-12 h-12 bg-[#F8F9FE] rounded-2xl flex items-center justify-center border border-slate-100/50">
                      <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-bold text-[14px] text-slate-800 font-mono tracking-tight">{id}</h3>
                      <p className="text-[12px] text-slate-500 mt-1">{formatDate(trx.completed_at)}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">
                        {totalItemsCount} Unit &bull; Total: {formatCurrency(trx.amount)}
                      </p>
                    </div>

                    {/* Right Info */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                      <p className="font-bold text-[14px] text-green-600">+ {formatCurrency(trx.total_commission_earned)}</p>
                      <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0 uppercase tracking-wider rounded-md ${
                        trx.status === "COMPLETED" ? "border-green-500 text-green-600" :
                        trx.status === "PENDING" ? "border-amber-500 text-amber-600" :
                        "border-slate-500 text-slate-600"
                      }`}>
                        {trx.status}
                      </Badge>
                      <ChevronDown className={`w-4 h-4 text-slate-400 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded Items */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden px-4 md:px-5 pb-4">
                      {trx.items && trx.items.length > 0 && (
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-200/40 mt-1">
                          <p className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-wider">Detail Produk</p>
                          <div className="space-y-3">
                            {trx.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[13px] bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800">
                                  {item.product_name} <span className="text-slate-500 font-medium text-[12px] ml-1">x{item.quantity}</span>
                                </h3>
                                <div className="text-right">
                                  <p className="text-[10px] text-slate-400 mb-0.5 font-medium">Komisi Item</p>
                                  <p className="text-green-600 font-semibold text-[13px]">+ {formatCurrency(item.commission_earned)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
