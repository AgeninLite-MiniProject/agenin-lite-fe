import React, { useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProductSchema, type UpdateProductFormValues } from "@/schemas/product.schema";
import { useUpdateProductMutation } from "@/hooks/useAdminProducts";

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
import { Pencil } from "lucide-react";

export function EditProductModal({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  
  const { mutate: updateProduct, isPending: isLoading } = useUpdateProductMutation();

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema) as any,
    defaultValues: {
      product_name: product.product_name,
      cost_price: product.cost_price || 0,
      selling_price: product.selling_price || 0,
      agent_fee: product.agent_fee || 0,
      super_agent_fee: product.super_agent_fee || 0,
      product_status: product.product_status as any,
    }
  });

  // reset form when opened to fetch latest prop
  React.useEffect(() => {
    if (open) {
      form.reset({
        product_name: product.product_name,
        cost_price: product.cost_price || 0,
        selling_price: product.selling_price || 0,
        agent_fee: product.agent_fee || 0,
        super_agent_fee: product.super_agent_fee || 0,
        product_status: product.product_status as any,
      });
    }
  }, [open, product, form]);

  const onSubmit: SubmitHandler<UpdateProductFormValues> = (data) => {
    updateProduct({ productId: product.product_id, data }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold gap-1.5 px-3">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`name-${product.product_id}`} className="text-sm font-medium text-slate-700">Product Name</Label>
            <Input id={`name-${product.product_id}`} {...form.register("product_name")} placeholder="e.g. Kopi Susu" className="rounded-lg h-11" />
            {form.formState.errors.product_name && <p className="text-red-500 text-xs">{form.formState.errors.product_name.message}</p>}
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor={`costPrice-${product.product_id}`} className="text-sm font-medium text-slate-700">Cost Price (Rp)</Label>
            <Input id={`costPrice-${product.product_id}`} {...form.register("cost_price")} placeholder="40000" type="number" className="rounded-lg h-11" />
            {form.formState.errors.cost_price && <p className="text-red-500 text-xs">{form.formState.errors.cost_price.message}</p>}
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor={`sellingPrice-${product.product_id}`} className="text-sm font-medium text-slate-700">Selling Price (Rp)</Label>
            <Input id={`sellingPrice-${product.product_id}`} {...form.register("selling_price")} placeholder="50000" type="number" className="rounded-lg h-11" />
            {form.formState.errors.selling_price && <p className="text-red-500 text-xs">{form.formState.errors.selling_price.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`agentFee-${product.product_id}`} className="text-sm font-medium text-slate-700">Agent Fee (%)</Label>
              <Input id={`agentFee-${product.product_id}`} {...form.register("agent_fee")} placeholder="10" type="number" className="rounded-lg h-11" />
              {form.formState.errors.agent_fee && <p className="text-red-500 text-xs">{form.formState.errors.agent_fee.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`superAgentFee-${product.product_id}`} className="text-sm font-medium text-slate-700">Super Agent Fee (%)</Label>
              <Input id={`superAgentFee-${product.product_id}`} {...form.register("super_agent_fee")} placeholder="5" type="number" className="rounded-lg h-11" />
              {form.formState.errors.super_agent_fee && <p className="text-red-500 text-xs">{form.formState.errors.super_agent_fee.message}</p>}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor={`status-${product.product_id}`} className="text-sm font-medium text-slate-700">Status</Label>
            <select id={`status-${product.product_id}`} {...form.register("product_status")} className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 text-slate-700">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6 h-11 text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 font-semibold">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
