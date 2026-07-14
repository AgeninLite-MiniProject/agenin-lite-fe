import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Box, CheckCircle2, ChevronDown, Clock, Package, ShoppingBag, XCircle, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PendingTransactionPage() {
  const pendingTransactions = [
    {
      id: "#TRX-99213",
      date: "14 Jul 2026, 09:30",
      productName: "Teh Pucuk Harum 1 Karton",
      quantity: 2,
      total: 100000,
      commission: 10000,
      icon: <Box className="h-6 w-6 text-[#004cd1]" />
    },
    {
      id: "#TRX-99214",
      date: "14 Jul 2026, 11:15",
      productName: "Indomie Goreng 1 Dus",
      quantity: 5,
      total: 550000,
      commission: 45000,
      icon: <Package className="h-6 w-6 text-[#004cd1]" />
    },
    {
      id: "#TRX-99215",
      date: "14 Jul 2026, 14:00",
      productName: "Beras Sania 5kg",
      quantity: 1,
      total: 75000,
      commission: 5000,
      icon: <ShoppingBag className="h-6 w-6 text-[#004cd1]" />
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp").trim();
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
        {pendingTransactions.map((trx, index) => (
          <Card key={index} className="rounded-[24px] border border-slate-200 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 md:p-6 gap-4 md:gap-6">

                {/* Icon Box */}
                <div className="h-14 w-14 shrink-0 rounded-full bg-[#004cd1]/10 flex items-center justify-center">
                  {trx.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-slate-500">{trx.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[12px] text-slate-500">{trx.date}</span>
                  </div>

                  <h3 className="font-bold text-[16px] text-slate-900 mb-3 truncate">
                    {trx.productName} <span className="text-slate-500 font-medium">x{trx.quantity}</span>
                  </h3>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 mb-0.5">Total Tagihan</p>
                      <p className="font-bold text-[14px] text-slate-900">{formatCurrency(trx.total)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 mb-0.5">Estimasi Komisi</p>
                      <p className="font-bold text-[14px] text-green-600">{formatCurrency(trx.commission)}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-0 sm:mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-amber-700 tracking-wider">PENDING</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full h-9 text-[#004cd1] border-[#004cd1] hover:bg-[#004cd1]/5 font-semibold text-[13px] px-4 w-full sm:w-auto">
                        Update Status <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-100 p-1">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-green-50 focus:bg-green-50 text-slate-700 focus:text-green-700 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-red-50 focus:bg-red-50 text-slate-700 focus:text-red-700 rounded-lg mt-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Failed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium text-[13px] p-2 hover:bg-slate-100 focus:bg-slate-100 text-slate-700 focus:text-slate-900 rounded-lg mt-1">
                        <Ban className="w-4 h-4 text-slate-500" />
                        Canceled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
