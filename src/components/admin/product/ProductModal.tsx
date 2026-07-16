import { useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductFormValues } from "@/schemas/product.schema";
import { useCreateProductMutation } from "@/hooks/useAdminProducts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function ProductModal() {
  const [open, setOpen] = useState(false);

  const { mutate: createProduct, isPending: isLoading } = useCreateProductMutation();

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      product_name: "",
      cost_price: "" as any,
      selling_price: "" as any,
      agent_fee: "" as any,
      super_agent_fee: "" as any,
    }
  });

  const onSubmit: SubmitHandler<CreateProductFormValues> = (data) => {
    createProduct(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-xl shadow-md shadow-blue-900/20 px-6 h-11 self-start md:self-auto transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Product Name</Label>
            <Input id="name" {...form.register("product_name")} placeholder="e.g. Kopi Susu Gula Aren" className="rounded-lg h-11" />
            {form.formState.errors.product_name && <p className="text-red-500 text-xs">{form.formState.errors.product_name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="costPrice" className="text-sm font-medium text-slate-700">Cost Price (Rp)</Label>
            <Input id="costPrice" {...form.register("cost_price")} placeholder="40000" type="number" step="any" className="rounded-lg h-11" />
            {form.formState.errors.cost_price && <p className="text-red-500 text-xs">{form.formState.errors.cost_price.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sellingPrice" className="text-sm font-medium text-slate-700">Selling Price (Rp)</Label>
            <Input id="sellingPrice" {...form.register("selling_price")} placeholder="50000" type="number" step="any" className="rounded-lg h-11" />
            {form.formState.errors.selling_price && <p className="text-red-500 text-xs">{form.formState.errors.selling_price.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="agentFee" className="text-sm font-medium text-slate-700">Agent Fee (%)</Label>
              <Input id="agentFee" {...form.register("agent_fee")} placeholder="10" type="number" step="any" className="rounded-lg h-11" />
              {form.formState.errors.agent_fee && <p className="text-red-500 text-xs">{form.formState.errors.agent_fee.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="superAgentFee" className="text-sm font-medium text-slate-700">Super Agent Fee (%)</Label>
              <Input id="superAgentFee" {...form.register("super_agent_fee")} placeholder="5" type="number" step="any" className="rounded-lg h-11" />
              {form.formState.errors.super_agent_fee && <p className="text-red-500 text-xs">{form.formState.errors.super_agent_fee.message}</p>}
            </div>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6 h-11 text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-xl shadow-md shadow-blue-900/20 px-6 h-11 font-semibold transition-all">
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
