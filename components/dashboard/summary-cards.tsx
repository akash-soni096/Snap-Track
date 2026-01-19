"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, FileText, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receipts: any[];
}

export function SummaryCards({ receipts }: SummaryCardsProps) {
  
  // 1. Calculate Total Spent
  const totalSpent = receipts.reduce((sum, item) => {
    const cleanPrice = parseFloat(item.total.toString().replace(/,/g, '')) || 0;
    return sum + cleanPrice;
  }, 0);

  // 2. Count Total Receipts
  const totalCount = receipts.length;

  // 3. Calculate Average Spend
  const averageSpend = totalCount > 0 ? Math.round(totalSpent / totalCount) : 0;

  return (
    // FIX IS HERE: 'grid-cols-1' stacks them on mobile, 'md:grid-cols-3' spreads them on desktop
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      
      {/* CARD 1: TOTAL SPENT */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total expenses recorded</p>
        </CardContent>
      </Card>

      {/* CARD 2: TRANSACTIONS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">Receipts scanned</p>
        </CardContent>
      </Card>

      {/* CARD 3: AVERAGE SPEND */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{averageSpend.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
      
    </div>
  );
}