import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function ProductModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 h-11 self-start md:self-auto">
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Add New Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Product Name</Label>
            <Input id="name" placeholder="e.g. Paket Data 50GB" className="rounded-lg h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="costPrice" className="text-sm font-medium text-slate-700">Cost Price (Rp)</Label>
            <Input id="costPrice" placeholder="40000" type="number" className="rounded-lg h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sellingPrice" className="text-sm font-medium text-slate-700">Selling Price (Rp)</Label>
            <Input id="sellingPrice" placeholder="50000" type="number" className="rounded-lg h-11" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="agentFee" className="text-sm font-medium text-slate-700">Agent Fee (%)</Label>
              <Input id="agentFee" placeholder="10" type="number" className="rounded-lg h-11" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="superAgentFee" className="text-sm font-medium text-slate-700">Super Agent Fee (%)</Label>
              <Input id="superAgentFee" placeholder="5" type="number" className="rounded-lg h-11" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
            <select id="status" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 text-slate-700">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-end gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl px-6 h-11 text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold">
              Cancel
            </Button>
          </DialogClose>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 font-semibold">
            Save Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
