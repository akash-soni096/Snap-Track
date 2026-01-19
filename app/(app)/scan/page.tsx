"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, Loader2, ArrowLeft, Keyboard, Info } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();

      localStorage.setItem("scannedReceipt", JSON.stringify({
        ...data,
        imageUrl: URL.createObjectURL(file)
      }));

      router.push("/receipt/new");

    } catch (error) {
      console.error(error);
      alert("Failed to scan. Please try manual entry.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualEntry = () => {
    localStorage.removeItem("scannedReceipt");
    router.push("/receipt/manual");
  };

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="ml-4 text-lg font-semibold">Add Receipt</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        
        {isScanning ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in">
             <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20"></div>
                <div className="relative rounded-full bg-zinc-900 p-8 border border-zinc-800">
                    <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                </div>
            </div>
             <h2 className="text-xl font-medium">Processing with Gemini AI...</h2>
             <p className="text-zinc-500 text-sm">Deciphering text & handwriting</p>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6">
            
            {/* UPLOAD CARD */}
            <Card 
              className="flex flex-col items-center justify-center gap-4 border-dashed border-zinc-700 bg-zinc-900/50 p-10 transition-colors hover:bg-zinc-900 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="rounded-full bg-zinc-800 p-4">
                <Upload className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-white">Upload Receipt</h3>
                <p className="text-sm text-zinc-500">Auto-scan with AI</p>
              </div>
            </Card>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-4">
                <Button 
                    size="lg" 
                    className="h-14 text-lg bg-white text-black hover:bg-zinc-200"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="mr-2 h-5 w-5" />
                    Scan
                </Button>

                <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 text-lg bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                    onClick={handleManualEntry}
                >
                    <Keyboard className="mr-2 h-5 w-5" />
                    Manual
                </Button>
            </div>

            {/* --- NEW NOTE SECTION --- */}
            <Alert className="bg-zinc-900/50 border-zinc-800 text-zinc-400">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-xs ml-2">
                <strong>Tip:</strong> AI works best on printed text. For handwritten bills or complex layouts, please use the <strong>Manual</strong> button.
              </AlertDescription>
            </Alert>

            <Input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
}