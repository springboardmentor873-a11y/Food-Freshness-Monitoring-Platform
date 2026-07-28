"use client";

import { useState, useEffect } from "react";
import { getAnalytics } from "@/services/api";
import { ChartDataPoint } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed insights into your inventory and freshness trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border-none shadow-sm">
          <CardHeader>
            <CardTitle>Fresh vs Spoiled Trends</CardTitle>
            <CardDescription>Monthly comparison over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFresh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpoiled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="stroke-border/40" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '1rem', 
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                    }}
                    itemStyle={{ color: '#22C55E' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="fresh" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorFresh)" />
                  <Area type="monotone" dataKey="spoiled" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSpoiled)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-none shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Volume</CardTitle>
            <CardDescription>Total items processed per month</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="stroke-border/40" />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '1rem', 
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                    }}
                    itemStyle={{ color: '#22C55E' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                  />
                  <Legend />
                  <Bar dataKey="fresh" name="Fresh Items" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spoiled" name="Spoiled Items" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
