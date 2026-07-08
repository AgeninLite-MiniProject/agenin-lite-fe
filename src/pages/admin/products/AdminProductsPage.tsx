import { Search, Plus, Pencil } from "lucide-react";
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

const products = [
  {
    id: 1,
    name: "Paket Perdana Premium",
    costPrice: "Rp 40.000",
    price: "Rp 50.000",
    agentFee: "10%",
    superAgentFee: "5%",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Paket Data 10GB",
    costPrice: "Rp 90.000",
    price: "Rp 100.000",
    agentFee: "15%",
    superAgentFee: "5%",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Voucher Game 1000",
    costPrice: "Rp 18.000",
    price: "Rp 20.000",
    agentFee: "5%",
    superAgentFee: "2%",
    status: "INACTIVE",
  },
];

export default function AdminProductsPage() {
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
            {products.map((product) => (
              <TableRow key={product.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-600 py-4 pl-6">{product.id}</TableCell>
                <TableCell className="font-semibold text-slate-900 py-4">{product.name}</TableCell>
                <TableCell className="text-slate-600 py-4">{product.costPrice}</TableCell>
                <TableCell className="text-slate-600 py-4">{product.price}</TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="bg-indigo-100/70 text-indigo-700 hover:bg-indigo-100/70 shadow-none border-transparent font-semibold">
                    {product.agentFee}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="bg-indigo-100/70 text-indigo-700 hover:bg-indigo-100/70 shadow-none border-transparent font-semibold">
                    {product.superAgentFee}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="secondary"
                    className={`shadow-none border-transparent font-semibold ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold gap-1.5 px-3">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
