import { Plus, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { adminProductApi } from "@/lib/api/admin-product.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductModal } from "@/components/admin/product/ProductModal";
import { EditProductModal } from "@/components/admin/product/EditProductModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await adminProductApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage master products, prices, and commission fees.
          </p>
        </div>
        <ProductModal onSuccess={fetchProducts} />
      </div>

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search product name..."
          className="pl-11 h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-blue-500"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider py-4 pl-6 w-[80px]">ID</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">PRODUCT NAME</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">COST PRICE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">SELLING PRICE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">AGENT FEE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">SUPER AGENT FEE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">STATUS</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">Loading data...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">Tidak ada produk.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.product_id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600 py-4 pl-6" title={product.product_id}>
                    {product.product_id ? product.product_id.substring(0, 8) + '...' : '-'}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 py-4">{product.product_name}</TableCell>
                  <TableCell className="text-slate-600 py-4 font-medium">Rp {product.cost_price?.toLocaleString() || '-'}</TableCell>
                  <TableCell className="text-slate-600 py-4 font-medium">Rp {product.selling_price?.toLocaleString() || '-'}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 shadow-none border-transparent font-semibold">
                      {product.agent_fee !== undefined ? `${product.agent_fee}%` : '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 shadow-none border-transparent font-semibold">
                      {product.super_agent_fee !== undefined ? `${product.super_agent_fee}%` : '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={`shadow-none border-transparent font-semibold ${
                        product.product_status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {product.product_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <EditProductModal product={product} onSuccess={fetchProducts} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-sm text-slate-500 font-medium">
            Showing 1 to 3 of 3 entries
          </p>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50" disabled>
              Prev
            </Button>
            <Button variant="default" size="sm" className="h-9 w-9 p-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
