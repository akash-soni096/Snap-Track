"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Plus, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function VerifyReceiptPage() {
  const router = useRouter();
  const params = useParams();
  
  // --- STATE MANAGEMENT (UPDATED FOR MANUAL ENTRY) ---
  const [merchant, setMerchant] = useState(""); 
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [total, setTotal] = useState(""); 
  const [category, setCategory] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [imageSrc, setImageSrc] = useState("https://placehold.co/400x600?text=Manual+Entry"); 
  
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. LOAD DATA FROM LOCAL STORAGE (AI RESULT) ---
  useEffect(() => {
    const savedData = localStorage.getItem("scannedReceipt");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Populate state with Gemini's response
        if (parsed.merchant) setMerchant(parsed.merchant);
        if (parsed.date) setDate(new Date(parsed.date));
        if (parsed.total) setTotal(parsed.total.replace(/[^0-9.]/g, '')); // Clean currency symbols
        if (parsed.category) setCategory(parsed.category);
        
        if (parsed.items && Array.isArray(parsed.items)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setItems(parsed.items.map((item: any, index: number) => ({
             id: index.toString(),
             name: item.name,
             price: item.price ? item.price.toString().replace(/[^0-9.]/g, '') : "0"
          })));
        }

        if (parsed.imageUrl) setImageSrc(parsed.imageUrl);

      } catch (e) {
        console.error("Failed to parse receipt data", e);
      }
    }
  }, []);

  // --- HELPER FUNCTIONS ---
  const updateItem = (id: string, field: "name" | "price", value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: "", price: "0" }]);
  };

  // --- SAVE TO MONGODB ---
  const handleSave = async () => {
    if (!date) {
        alert("Please select a date");
        return;
    }
    
    setIsSaving(true);

    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: merchant || "Unknown Merchant", // Fallback if still empty
          date,
          total: total || "0", 
          confidence: merchant ? 0.98 : 0, // Lower confidence for manual
          category: category || "Uncategorized", 
          items: items.map(item => ({
            name: item.name,
            price: item.price
          }))
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      localStorage.removeItem("scannedReceipt"); // Cleanup

      router.push("/dashboard");
      router.refresh(); 
      
    } catch (error) {
      console.error(error);
      alert("Failed to save receipt. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white dark:bg-black overflow-hidden">
      
      {/* SECTION 1: IMAGE VIEWER */}
      <div className="relative h-[40vh] lg:h-full lg:flex-1 bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
        
        <div className="absolute top-4 left-4 z-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">
            ID: {params.id}
        </div>

        <TransformWrapper initialScale={1} minScale={0.5} maxScale={4} centerOnInit>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-1 flex flex-col">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomIn()}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomOut()}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => resetTransform()}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <div className="w-full h-full flex items-center justify-center p-8">
                        <img 
                            src={imageSrc} 
                            alt="Receipt" 
                            className="max-w-full max-h-full shadow-2xl rounded-sm object-contain"
                        />
                    </div>
                </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>


      {/* SECTION 2: EDIT FORM */}
      <div className="flex-1 lg:max-w-xl h-full flex flex-col bg-white dark:bg-black">
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Merchant</Label>
                        <Input 
                            value={merchant} 
                            onChange={(e) => setMerchant(e.target.value)}
                            placeholder="Enter merchant name..."
                            className="text-xl font-bold border-transparent px-0 h-auto rounded-none focus-visible:ring-0 border-b border-zinc-200 focus-visible:border-black dark:border-zinc-800 dark:focus-visible:border-white transition-colors placeholder:text-zinc-300"
                        />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 gap-1 pr-3">
                            <Sparkles className="w-3 h-3" />
                            {imageSrc.includes("Manual") ? "Manual Entry" : "AI Extracted"}
                        </Badge>
                        <span className="text-[10px] text-zinc-400">Gemini Flash 1.5</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal border-zinc-200 dark:border-zinc-800",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-1">
                         <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</Label>
                         <Input 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-900 border-transparent"
                            placeholder="e.g. Food, Travel"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Extracted Items</Label>
                    <span className="text-xs text-zinc-400">{items.length} items found</span>
                </div>
                
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="group flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <Input 
                                value={item.name}
                                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:bg-white transition-all"
                                placeholder="Item name"
                            />
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                                <Input 
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                                    className="w-24 pl-6 text-right bg-zinc-50 dark:bg-zinc-900 border-transparent focus:bg-white transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => deleteItem(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed text-zinc-500 hover:text-zinc-900 hover:border-zinc-400"
                    onClick={addItem}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Item manually
                </Button>
            </div>
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur space-y-4">
            <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg">Total Amount</span>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium">₹</span>
                    <Input 
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        placeholder="0.00"
                        className="w-32 text-right text-xl font-bold bg-white dark:bg-black border-zinc-200 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button 
                    variant="outline" 
                    className="h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950"
                    onClick={() => router.back()}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                </Button>
                
                <Button 
                    className="h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Confirm & Save
                        </>
                    )}
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}   