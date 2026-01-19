"use client";

import { useEffect, useState } from "react";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SpendingChart } from "@/components/spending-chart";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/receipts");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        {/* Hide 'Scan' button on mobile (since we have bottom nav) */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/scan">
            <Button className="h-9">
              <Plus className="mr-2 h-4 w-4" /> Scan Receipt
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. SUMMARY CARDS */}
      <SummaryCards receipts={data} />

      {/* 2. MAIN DASHBOARD CONTENT (Chart + List) */}
      {/* We use a Grid to put Chart (Left) and List (Right) side-by-side on desktop */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* LEFT: CHART (Takes up 4 columns) */}
        <div className="col-span-4">
          <SpendingChart data={data} />
        </div>

        {/* RIGHT: RECENT ACTIVITY (Takes up 3 columns) */}
        <div className="col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full">
            <div className="p-6 flex flex-row items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
              <Link href="/expenses" className="text-sm font-medium text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-8">
                {data.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.merchant}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.date), "MMMM d, yyyy")} • {item.category}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ₹{item.total}
                    </div>
                  </div>
                ))}

                {data.length === 0 && (
                  <div className="text-center py-4 text-zinc-500 text-sm">
                    No receipts scanned yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
}