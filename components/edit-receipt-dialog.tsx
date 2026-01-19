"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2 } from "lucide-react";

interface EditReceiptDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receipt: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (updatedReceipt: any) => void;
}

export function EditReceiptDialog({ receipt, onUpdate }: EditReceiptDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [merchant, setMerchant] = useState(receipt.merchant);
  const [total, setTotal] = useState(receipt.total);
  const [category, setCategory] = useState(receipt.category);
  // Format date to YYYY-MM-DD for the input field
  const [date, setDate] = useState(
    receipt.date ? new Date(receipt.date).toISOString().split('T')[0] : ""
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/receipts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: receipt.id,
          merchant,
          total,
          category,
          date: new Date(date).toISOString(), // Convert back to ISO for DB
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      onUpdate(updated); // Update the UI instantly
      setOpen(false); // Close the modal
    } catch (error) {
      console.error(error);
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Receipt</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          {/* Merchant Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="merchant" className="text-right">Merchant</Label>
            <Input
              id="merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Amount Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">Amount</Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-2.5 text-zinc-500">₹</span>
              <Input
                id="total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Category Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>

        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} className="bg-black text-white hover:bg-zinc-800">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}