import { useState, useMemo } from "react";
import { useAdminProductsQuery } from "@/hooks/useAdminProducts";
import { AdminSearch } from "@/components/admin/ui/AdminSearch";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
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
  const { data: allProducts = [], isLoading } = useAdminProductsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Search Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, searchQuery]);

  // Pagination Logic
  const totalEntries = filteredProducts.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset page when search query changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage master products, prices, and commission fees.
          </p>
        </div>
        <ProductModal />
      </div>

      <AdminSearch 
        placeholder="Search product name..." 
        className="mb-6 w-full"
        value={searchQuery}
        onChange={handleSearch}
      />

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
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">Tidak ada produk ditemukan.</TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product: any) => (
                <TableRow key={product.product_id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600 py-4 pl-6" title={product.product_id}>
                    {product.product_id ? product.product_id.substring(0, 8) + '...' : '-'}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 py-4">{product.product_name}</TableCell>
                  <TableCell className="text-slate-600 py-4 font-medium">Rp {product.cost_price?.toLocaleString() || '-'}</TableCell>
                  <TableCell className="text-slate-600 py-4 font-medium">Rp {product.selling_price?.toLocaleString() || '-'}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-slate-500 text-slate-600 font-semibold">
                      {product.agent_fee !== undefined ? `${product.agent_fee}%` : '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-slate-500 text-slate-600 font-semibold">
                      {product.super_agent_fee !== undefined ? `${product.super_agent_fee}%` : '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={`font-semibold ${
                        product.product_status === "ACTIVE"
                          ? "border-green-500 text-green-600"
                          : "border-slate-500 text-slate-600"
                      }`}
                    >
                      {product.product_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <EditProductModal product={product} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <AdminPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          startEntry={startEntry} 
          endEntry={endEntry} 
          totalEntries={totalEntries} 
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
