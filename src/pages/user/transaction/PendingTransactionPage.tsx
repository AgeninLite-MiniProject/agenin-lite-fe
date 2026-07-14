import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, ChevronDown, XCircle, Ban, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTransactionListQuery } from "@/hooks/useTransactionListQuery";
import { useUpdateTransactionStatus } from "@/hooks/useUpdateTransactionStatus";
import toast from "react-hot-toast";

export default function PendingTransactionPage() {
  const { data: responseData, isLoading, isError } = useTransactionListQuery({ status: "PENDING", page: 0, size: 50 });
  const updateStatusMutation = useUpdateTransactionStatus();
  
  // State untuk toggle rincian produk
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pendingTransactions = responseData?.transactions || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp").trim();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleUpdateStatus = (id: string, action: "complete" | "cancel" | "fail") => {
    updateStatusMutation.mutate(
      { id, action },
      {
        onSuccess: () => {
          toast.success(`Transaksi berhasil di-update (${action})`);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || `Gagal update transaksi (${action})`);
        }
      }
    );
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-[#fbfbfb] min-h-screen">

      {/* Tombol Kembali */}
      <Link to="/transaksi" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Transaksi
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Menunggu Konfirmasi</h1>
        <p className="text-slate-500 text-[14px] leading-relaxed max-w-2xl">
          Daftar transaksi yang harus Anda selesaikan. Transaksi yang sudah di-update akan otomatis pindah ke halaman Riwayat.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center p-8 text-red-500">
            <p>Gagal memuat transaksi.</p>
          </div>
        ) : pendingTransactions.length === 0 ? (
          <div className="text-center p-8 text-slate-500 bg-white rounded-2xl border border-slate-200">
            <p>Tidak ada transaksi PENDING saat ini.</p>
          </div>
        ) : (
          pendingTransactions.map((trx) => (
            <Card key={trx.id} className="rounded-[24px] border border-slate-200 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start p-5 md:p-6 gap-4 md:gap-6">

                  {/* Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[12px] font-mono font-semibold text-slate-500">{trx.id.split("-")[0]}...</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[12px] text-slate-500">{formatDate(trx.createdAt)}</span>
                    </div>

                    <div className="mb-4">
                      <button 
                        onClick={() => toggleExpand(trx.id)}
                        className="flex items-center gap-2 text-[13px] font-medium text-[#004cd1] hover:text-[#004cd1]/80 transition-colors"
                      >
                        {trx.items && trx.items.length > 0 ? `Lihat ${trx.items.length} Produk` : "Tidak ada produk"}
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedIds.has(trx.id) ? "rotate-180" : ""}`} />
                      </button>
                      
                      {expandedIds.has(trx.id) && trx.items && trx.items.length > 0 && (
                        <div className="mt-3 space-y-2 pl-3 border-l-2 border-slate-100">
                          {trx.items.map(item => (
                            <h3 key={item.itemId} className="font-bold text-[14px] text-slate-800 truncate">
                              {item.productName} <span className="text-slate-500 font-medium text-[12px]">x{item.quantity}</span>
                            </h3>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 gap-y-3">
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 mb-0.5">Total Tagihan</p>
                        <p className="font-bold text-[14px] text-slate-900">{formatCurrency(trx.amount)}</p>
                      </div>
                      {/* Note: Estimasi Fee dihapus karena di Backend nilai komisi PENDING selalu 0 */}
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-0 sm:mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-700 tracking-wider">PENDING</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          disabled={updateStatusMutation.isPending}
                          variant="outline" 
                          className="rounded-full h-9 text-[#004cd1] border-[#004cd1] hover:bg-[#004cd1]/5 font-semibold text-[13px] px-4 w-full sm:w-auto">
                          Update Status <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-100 p-1">
                        <DropdownMenuItem onClick={() => handleUpdateStatus(trx.id, "complete")} className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-green-50 focus:bg-green-50 text-slate-700 focus:text-green-700 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Selesai (Completed)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(trx.id, "fail")} className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-red-50 focus:bg-red-50 text-slate-700 focus:text-red-700 rounded-lg mt-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Gagal (Failed)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(trx.id, "cancel")} className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-slate-100 focus:bg-slate-100 text-slate-700 focus:text-slate-900 rounded-lg mt-1">
                          <Ban className="w-4 h-4 text-slate-500" />
                          Batalkan (Canceled)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
