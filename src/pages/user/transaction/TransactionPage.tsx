import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassWater, Cookie, CheckCircle2, Minus, Plus, X } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

export default function TransactionPage() {
  const { data: dynamicProducts, isLoading, isError } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp").trim();
  };

  const productsList = dynamicProducts || [];
  const selectedProduct = productsList.find(p => p.product_id === selectedProductId);
  const totalHarga = selectedProduct ? selectedProduct.selling_price * quantity : 0;
  const totalEstimasiFee = selectedProduct ? (selectedProduct.selling_price * (selectedProduct.agent_fee / 100)) * quantity : 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full h-auto lg:h-[calc(100vh-121px)] lg:overflow-hidden bg-[#fbfbfb]">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:h-full p-4 md:p-8">

        {/* LEFT COLUMN - PRODUCT CATALOG */}
        <div className="flex-1 w-full h-auto lg:h-full lg:overflow-y-auto pr-1 md:pr-4 lg:pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">Katalog Produk</h1>
              <p className="text-slate-500 text-[14px]">Produk dikelola oleh tim pusat — tidak bisa diubah</p>
            </div>
            <Link to="/transaksi/pending">
              <Button variant="outline" className="rounded-full h-10 text-[#004cd1] border-[#004cd1]/30 hover:bg-[#004cd1]/5 font-semibold text-[13px] px-5 w-full sm:w-auto shadow-sm">
                Lihat Daftar Transaksi Pending
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Memuat katalog produk...</p>
              </div>
            ) : isError ? (
              <div className="col-span-full flex flex-col items-center justify-center h-48 text-red-500">
                <p>Gagal memuat produk. Silakan coba lagi.</p>
              </div>
            ) : productsList.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400">
                <p>Belum ada produk aktif di katalog.</p>
              </div>
            ) : (
              productsList.map((product) => {
                const isSelected = selectedProductId === product.product_id;
                const isActive = product.product_status === "ACTIVE";

                return (
                  <Card
                    key={product.product_id}
                    className={`rounded-2xl transition-all relative overflow-hidden ${isSelected ? 'border-primary border-2 shadow-md bg-white' :
                      !isActive ? 'border-slate-100 shadow-sm bg-slate-50/50 opacity-70' :
                        'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 bg-white'
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-white rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-primary fill-primary text-white" />
                      </div>
                    )}

                    <CardContent className="p-5 md:p-6 flex flex-col h-full">
                      <div className="flex justify-end items-start mb-4 min-h-[24px]">
                        {!isSelected && (
                          <Badge variant="secondary" className={`${isActive ? 'bg-green-100/70 text-green-700' : 'bg-slate-200 text-slate-500'} hover:bg-opacity-80 border-transparent text-[10px] font-bold px-2.5 py-0.5 rounded-md`}>
                            {product.product_status}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-6 flex-1">
                        <h3 className={`font-bold text-[15px] leading-tight mb-2 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          {product.product_name}
                        </h3>
                        <p className={`text-xl font-bold tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          {formatCurrency(product.selling_price)}
                        </p>
                      </div>

                      <div className="space-y-1.5 mb-6 text-[13px]">
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Agent Fee:</span>
                          <span className={`font-bold ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>{product.agent_fee}%</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Super Agent Fee:</span>
                          <span className={`font-bold ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>{product.super_agent_fee}%</span>
                        </div>
                      </div>

                      <Button
                        disabled={!isActive}
                        onClick={() => setSelectedProductId(product.product_id)}
                        className={`w-full rounded-full h-11 font-semibold text-[14px] ${isSelected ? 'bg-[#004cd1] hover:bg-[#004cd1] text-white' :
                          !isActive ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100' :
                            'bg-[#004cd1]/10 hover:bg-[#004cd1]/20 text-[#004cd1] shadow-none'
                          }`}
                      >
                        {isSelected ? <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Terpilih</div> : (!isActive ? 'Tidak tersedia saat ini' : 'Pilih Produk')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT COLUMN - SIMULATION DETAIL */}
        <div className="hidden lg:block w-[400px] shrink-0">
          <Card className="rounded-[20px] border-slate-100 shadow-lg bg-white overflow-hidden">
            <CardContent className="p-5">
              <h2 className="text-[17px] font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                Detail Simulasi Transaksi
              </h2>

              {selectedProduct ? (
                <>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-[14px] text-slate-900 leading-snug">{selectedProduct.product_name}</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">{formatCurrency(selectedProduct.selling_price)} / unit</p>
                    </div>


                    <div className="flex items-center gap-2 border border-slate-200 rounded-full px-1 py-1 bg-white">
                      <button
                        onClick={handleDecrease}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-semibold text-sm min-w-[12px] text-center text-slate-900">{quantity}</span>
                      <button
                        onClick={handleIncrease}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-medium text-slate-500">Total Harga Pembayaran</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(totalHarga)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-green-50/80 px-3 py-2 rounded-lg border border-green-100">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
                        Total Estimasi Agent Fee
                      </div>
                      <span className="font-bold text-[13px] text-green-700">{formatCurrency(totalEstimasiFee)}</span>
                    </div>
                  </div>

                  <Button className="w-full rounded-full h-11 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold text-[14px] shadow-[0_8px_20px_-8px_rgba(0,76,209,0.5)] flex items-center justify-center gap-2">
                    Buat Transaksi <span className="text-lg leading-none">→</span>
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-[13px]">Pilih produk di katalog untuk memulai simulasi transaksi.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* MOBILE BOTTOM SHEET */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProductId(null)} />

          <div className="absolute bottom-0 left-0 right-0 mx-2 bg-white rounded-t-[16px] overflow-hidden">
            {/* Handle */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-8 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="px-5 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-slate-900">Detail Simulasi</h2>
                <button onClick={() => setSelectedProductId(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] text-slate-900 truncate">{selectedProduct.product_name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(selectedProduct.selling_price)} / unit</p>
                </div>
                <div className="flex items-center gap-1.5 border border-slate-200 rounded-full px-0.5 py-0.5 bg-white">
                  <button onClick={handleDecrease} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-semibold text-[13px] min-w-[12px] text-center">{quantity}</span>
                  <button onClick={handleIncrease} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-medium text-slate-500">Total Harga Pembayaran</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{formatCurrency(totalHarga)}</p>
                </div>
                <div className="flex items-center justify-between bg-green-50/80 px-3 py-2 rounded-lg border border-green-100">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                    Total Estimasi Agent Fee
                  </div>
                  <span className="font-bold text-[12px] text-green-700">{formatCurrency(totalEstimasiFee)}</span>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full rounded-full h-11 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold text-[14px] shadow-[0_8px_20px_-8px_rgba(0,76,209,0.5)] flex items-center justify-center gap-2">
                Buat Transaksi <span className="text-lg leading-none">→</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
