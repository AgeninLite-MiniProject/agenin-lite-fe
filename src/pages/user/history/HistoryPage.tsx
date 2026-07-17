import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Wallet,
  CheckCircle2,
  Hourglass,
  XCircle,
  Package,
} from "lucide-react";
import { useTransactionListQuery } from "@/hooks/useTransactionListQuery";
import { useTransactionDetailQuery } from "@/hooks/useTransactionDetailQuery";
import { ErrorState } from "@/components/ui/ErrorState";
import Image500 from "@/assets/500-error.webp";
import { DotMap } from "@/components/ui/DotMap";
import { formatRupiah, formatDateId, formatTrxId } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/schemas/transaction.schema";

const STATUS_CONFIG: Record<
  TransactionStatus,
  {
    label: string;
    badgeClass: string;
    rowAmountClass: string;
    showAmount: boolean;
  }
> = {
  COMPLETED: {
    label: "COMPLETED",
    badgeClass: "border-green-500 text-green-600",
    rowAmountClass: "text-green-600",
    showAmount: true,
  },
  PENDING: {
    label: "PENDING",
    badgeClass: "border-amber-500 text-amber-600",
    rowAmountClass: "text-slate-400",
    showAmount: false,
  },
  FAILED: {
    label: "FAILED",
    badgeClass: "border-red-500 text-red-600",
    rowAmountClass: "text-slate-400",
    showAmount: false,
  },
  CANCELLED: {
    label: "CANCELLED",
    badgeClass: "border-slate-500 text-slate-600",
    rowAmountClass: "text-slate-400",
    showAmount: false,
  },
};

const STATUS_TABS: Array<{ value: TransactionStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function getStatusIcon(status: TransactionStatus) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={1.5} />;
    case "PENDING":
      return <Hourglass className="h-5 w-5 text-amber-600" strokeWidth={1.5} />;
    case "FAILED":
    case "CANCELLED":
      return <XCircle className="h-5 w-5 text-red-500" strokeWidth={1.5} />;
  }
}

function ExpandedItems({ trxId }: { trxId: string }) {
  const { data, isLoading, isError } = useTransactionDetailQuery(trxId);

  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-muted-foreground flex items-center justify-center py-4">
        <span className="animate-pulse">Memuat detail produk...</span>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-red-600">
        Gagal memuat detail transaksi.
      </div>
    );
  }

  return (
    <div className="mt-3 pt-4 border-t border-slate-100">
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80">
        <p className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-wider">
          Detail Produk ({data.items.length})
        </p>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-center text-[13px] bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="min-w-0 pr-3">
                <h3 className="font-bold text-slate-800 truncate">
                  {item.productName ?? "(Produk telah dihapus)"} <span className="text-slate-500 font-medium text-[12px] ml-1">x{item.quantity}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Total Harga: {formatRupiah(item.itemAmount)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-slate-400 mb-0.5 font-medium">Komisi Item</p>
                <p className="text-green-600 font-semibold text-[13px]">+ {formatRupiah(item.profit)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HistoryPage = () => {
  const [status, setStatus] = useState<TransactionStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useTransactionListQuery({ status, page, size: 20 });

  const handleStatusChange = (next: TransactionStatus | "ALL") => {
    setStatus(next);
    setPage(0);
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  return (
    <div className="flex-1 space-y-6 md:space-y-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          Riwayat Transaksi
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Pantau dan kelola seluruh komisi dari jaringan Anda.
        </p>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <DotMap />
        
        {/* Pattern / Logo Overlay */}
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none z-0">
          <img src="/src/assets/ageninlitewhite2.webp" alt="" className="w-64 h-auto" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6 md:gap-0">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="h-7 w-7 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-blue-200 uppercase tracking-widest mb-1">
                Total Komisi Anda
              </p>
              <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {data ? formatRupiah(data.totalCommission) : "—"}
              </p>
            </div>
          </div>
          
          <div className="md:border-l border-white/20 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 flex flex-col md:items-end md:text-right">
            <p className="text-xs md:text-sm font-medium text-blue-200 uppercase tracking-widest mb-1">
              Total Transaksi Selesai
            </p>
            <p className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">
              {data ? `${data.completedCount} Transaksi` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center bg-slate-200/50 p-1 rounded-full">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          return (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                "rounded-full h-8 px-4 md:px-5 text-xs md:text-sm font-medium transition-all",
                isActive
                  ? "border-0 bg-gradient-to-br from-blue-700 to-blue-900/75 text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-slate-100">
              <CardContent className="p-5 md:p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          <ErrorState 
            title="Gagal memuat riwayat"
            message="Terjadi kesalahan sistem saat mengambil data riwayat transaksi dari server."
            imageSrc={Image500}
          />
        ) : data && data.transactions.length === 0 ? (
          <Card className="rounded-2xl border-slate-100">
            <CardContent className="p-10 text-center">
              <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi pada filter ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          data?.transactions.map((trx) => {
            const config = STATUS_CONFIG[trx.status];
            return (
              <Card
                key={trx.id}
                className={cn(
                  "rounded-2xl border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all",
                  isPlaceholderData && "opacity-60",
                )}
              >
                <CardContent className="p-4 md:p-5">
                  <button
                    type="button"
                    onClick={() => toggleExpand(trx.id)}
                    className="w-full flex items-center gap-4 text-left"
                    aria-expanded={expandedIds.has(trx.id)}
                  >
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {getStatusIcon(trx.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-semibold text-[12px] md:text-[13px] text-foreground truncate">
                        {formatTrxId(trx.id)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {trx.createdAt ? formatDateId(trx.createdAt) : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {trx.totalQuantity} Unit • Total: {formatRupiah(trx.amount)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {config.showAmount && (
                        <p
                          className={cn(
                            "text-sm md:text-base font-semibold mb-1",
                            config.rowAmountClass,
                          )}
                        >
                          + {formatRupiah(trx.agentFeeAmount)}
                        </p>
                      )}
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold",
                          config.badgeClass,
                        )}
                      >
                        {config.label}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 mx-auto mt-1 transition-transform",
                          expandedIds.has(trx.id) && "rotate-180",
                        )}
                        strokeWidth={2}
                      />
                    </div>
                  </button>

                  {expandedIds.has(trx.id) && <ExpandedItems trxId={trx.id} />}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {data && page + 1 < data.totalPages && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="rounded-full px-6 h-10 text-sm font-medium border-primary text-primary hover:bg-primary/5"
          >
            Muat Lebih Banyak
            <ChevronDown className="ml-2 h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
