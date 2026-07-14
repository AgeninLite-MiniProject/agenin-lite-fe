import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Minus, Plus, X, ShoppingCart } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionPage() {
  const { data: dynamicProducts, isLoading, isError } = useProducts();
  const createTxMutation = useCreateTransaction();
  const navigate = useNavigate();

  const [cart, setCart] = useState<Record<string, number>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp").trim();
  };

  const productsList = dynamicProducts || [];


  const handleToggleProduct = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        delete newCart[productId];
      } else {
        newCart[productId] = 1;
      }
      return newCart;
    });
  };

  // Logic untuk mengubah jumlah (quantity) produk tertentu di keranjang
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const nextQty = currentQty + delta;
      if (nextQty < 1) return prev; // Qty tidak boleh kurang dari 1
      return { ...prev, [productId]: nextQty };
    });
  };

  // Kalkulasi Total
  let totalHarga = 0;
  let totalEstimasiFee = 0;
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = productsList.find(p => p.product_id === productId);
    if (product) {
      totalHarga += product.selling_price * quantity;
      totalEstimasiFee += (product.selling_price * (product.agent_fee / 100)) * quantity;
    }
    return { product, quantity };
  }).filter(item => item.product !== undefined);

  const hasItems = cartItems.length > 0;

  const handleCreateTransaction = () => {
    if (!hasItems) return;

    const payload = {
      items: Object.entries(cart).map(([productId, quantity]) => ({
        productId,
        quantity
      }))
    };

    createTxMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Transaksi berhasil dibuat!");
        setCart({}); // Reset keranjang
        navigate("/transaksi/pending");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Gagal membuat transaksi");
      }
    });
  };

  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full min-h-[calc(100vh-121px)] bg-[#fbfbfb]">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:h-full p-4 md:p-8">

        {/* LEFT COLUMN - PRODUCT CATALOG */}
        <div className="flex-1 w-full lg:pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">Katalog Produk</h1>
              <p className="text-slate-500 text-[14px]">Pilih beberapa produk untuk ditambahkan ke transaksi</p>
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
                const isSelected = !!cart[product.product_id];
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
                        onClick={() => handleToggleProduct(product.product_id)}
                        className={`w-full rounded-full h-11 font-semibold text-[14px] ${isSelected ? 'bg-red-50 hover:bg-red-100 text-red-600 shadow-none' :
                          !isActive ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100' :
                            'bg-[#004cd1]/10 hover:bg-[#004cd1]/20 text-[#004cd1] shadow-none'
                          }`}
                      >
                        {isSelected ? 'Batal Pilih' : (!isActive ? 'Tidak tersedia' : 'Tambah ke Transaksi')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT COLUMN - CART DETAIL */}
        <div className="hidden lg:flex lg:flex-col w-[400px] shrink-0">
          <Card className="rounded-[20px] border-slate-100 shadow-lg bg-white overflow-hidden flex flex-col h-auto">

            <div className="p-5 border-b border-slate-100 shrink-0">
              <h2 className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#004cd1]" />
                Detail Transaksi
              </h2>
            </div>

            <CardContent className="p-0 flex-1 overflow-y-auto">
              {hasItems ? (
                <div className="p-5 space-y-4">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product!.product_id} className="flex items-start justify-between gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-[14px] text-slate-900 leading-snug mb-1">{product!.product_name}</h3>
                        <p className="text-[12px] text-slate-500">{formatCurrency(product!.selling_price)}</p>
                      </div>

                      <div className="flex items-center gap-2 border border-slate-200 rounded-full px-1 py-1 bg-white shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(product!.product_id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-semibold text-xs min-w-[12px] text-center text-slate-900">{quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product!.product_id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-5 flex flex-col items-center">
                  <ShoppingCart className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-500 text-[13px]">Belum ada produk yang dipilih. Silakan pilih produk dari katalog.</p>
                </div>
              )}
            </CardContent>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <div className="mb-5">
                {hasItems && (
                  <div className="mb-4 space-y-2 border-b border-slate-200/60 pb-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product!.product_id} className="flex items-center justify-between text-[12px] text-slate-600">
                        <span className="truncate pr-4">{product!.product_name} <span className="text-slate-400 font-medium">x{quantity}</span></span>
                        <span className="font-semibold text-slate-800 shrink-0">{formatCurrency(product!.selling_price * quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-medium text-slate-500">Total Harga</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {formatCurrency(totalHarga)}
                  </p>
                </div>
                {hasItems && (
                  <div className="flex items-center justify-between bg-green-50/80 px-3 py-2 rounded-lg border border-green-100">
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
                      Total Estimasi Fee Anda
                    </div>
                    <span className="font-bold text-[13px] text-green-700">{formatCurrency(totalEstimasiFee)}</span>
                  </div>
                )}
              </div>

              <Button 
                disabled={!hasItems || createTxMutation.isPending} 
                onClick={handleCreateTransaction}
                className="w-full rounded-full h-11 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold text-[14px] shadow-[0_8px_20px_-8px_rgba(0,76,209,0.5)] disabled:shadow-none disabled:bg-slate-200 disabled:text-slate-400">
                {createTxMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat Transaksi Sekarang"}
              </Button>
            </div>
          </Card>
        </div>

        {/* MOBILE BOTTOM SHEET */}
        {hasItems && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCart({})} />

            <div className="absolute bottom-0 left-0 right-0 mx-2 bg-white rounded-t-[16px] overflow-hidden max-h-[85vh] flex flex-col">
              {/* Handle */}
              <div className="pt-2 pb-1 flex justify-center shrink-0">
                <div className="w-8 h-1 bg-slate-300 rounded-full" />
              </div>

              <div className="px-5 pb-2 flex items-center justify-between shrink-0 border-b border-slate-100">
                <h2 className="text-[16px] font-bold text-slate-900">Keranjang ({cartItems.length})</h2>
                <button onClick={() => setCart({})} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-4 space-y-4">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product!.product_id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-slate-900 truncate">{product!.product_name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(product!.selling_price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-200 rounded-full px-0.5 py-0.5 bg-white shrink-0">
                      <button onClick={() => handleUpdateQuantity(product!.product_id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-semibold text-[13px] min-w-[12px] text-center">{quantity}</span>
                      <button onClick={() => handleUpdateQuantity(product!.product_id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-6 pt-2 shrink-0 border-t border-slate-100 bg-white">
                <div className="mb-4">
                  {hasItems && (
                    <div className="mb-3 space-y-1.5 border-b border-slate-100 pb-3">
                      {cartItems.map(({ product, quantity }) => (
                        <div key={product!.product_id} className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate pr-4">{product!.product_name} <span className="text-slate-400 font-medium">x{quantity}</span></span>
                          <span className="font-semibold text-slate-700 shrink-0">{formatCurrency(product!.selling_price * quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[12px] font-medium text-slate-500">Total Harga</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(totalHarga)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-green-600">Estimasi Fee Anda</p>
                    <p className="text-[12px] font-bold text-green-700">{formatCurrency(totalEstimasiFee)}</p>
                  </div>
                </div>

                <Button 
                  disabled={!hasItems || createTxMutation.isPending} 
                  onClick={handleCreateTransaction}
                  className="w-full rounded-full h-11 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold text-[14px]">
                  {createTxMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat Transaksi Sekarang"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
