"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpendingChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  
  // 1. Process Data: Group by Category and Sum Totals
  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};

    data.forEach((item) => {
      // Clean up the price string (remove commas)
      const amount = parseFloat(item.total.toString().replace(/,/g, '')) || 0;
      
      if (categories[item.category]) {
        categories[item.category] += amount;
      } else {
        categories[item.category] = amount;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(categories)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total) // Sort highest to lowest
      .slice(0, 6); // Only show top 6 categories
  }, [data]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  fill="currentColor" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-black dark:fill-white" 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data available yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}