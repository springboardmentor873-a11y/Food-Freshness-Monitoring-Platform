"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";
import { InventoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FreshnessAssessmentPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error("Failed to load inventory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Recharts components loaded dynamically to prevent SSR hydration mismatches
  const [RechartsComponents, setRechartsComponents] = useState<any>(null);
  useEffect(() => {
    import("recharts").then((mod) => {
      setRechartsComponents(mod);
    });
  }, []);

  // Calculate aggregates
  const totalCount = inventory.length;
  const avgFreshness = totalCount > 0 
    ? Math.round(inventory.reduce((acc, curr) => acc + curr.freshnessScore, 0) / totalCount)
    : 0;
  
  // Group by category for chart
  const categories = Array.from(new Set(inventory.map(item => item.fruitName)));
  const categoryData = categories.map(cat => {
    const items = inventory.filter(item => item.fruitName === cat);
    const avg = Math.round(items.reduce((acc, curr) => acc + curr.freshnessScore, 0) / items.length);
    return { name: cat, freshness: avg };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fresh":
        return <Badge className="bg-primary/20 text-primary border-transparent rounded-full px-2.5 py-0.5 text-[10px] font-bold">FRESH</Badge>;
      case "Near Spoiled":
        return <Badge className="bg-warning/20 text-warning-foreground border-transparent rounded-full px-2.5 py-0.5 text-[10px] font-bold">NEAR EXPIRED</Badge>;
      default:
        return <Badge className="bg-destructive/20 text-destructive border-transparent rounded-full px-2.5 py-0.5 text-[10px] font-bold">SPOILED</Badge>;
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 75) return "text-primary border-primary/20 bg-primary/5";
    if (score >= 40) return "text-warning border-warning/20 bg-warning/5";
    return "text-destructive border-destructive/20 bg-destructive/5";
  };

  const filteredInventory = selectedStatus === "All"
    ? inventory
    : inventory.filter(item => item.status === selectedStatus);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Freshness Assessment</h1>
        <p className="text-muted-foreground mt-1">Detailed inventory freshness breakdown and batch classification logs.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Freshness Index</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex items-baseline gap-3">
            <div className="text-4xl font-black text-primary">{loading ? <Skeleton className="h-10 w-16" /> : `${avgFreshness}%`}</div>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Healthy Bounds</span>
          </CardContent>
        </Card>
        
        <Card className="glass-panel border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Scanned Batches</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex items-baseline gap-3">
            <div className="text-4xl font-black text-foreground">{loading ? <Skeleton className="h-10 w-16" /> : totalCount}</div>
            <span className="text-xs text-muted-foreground font-semibold">Active monitor count</span>
          </CardContent>
        </Card>

        <Card className="glass-panel border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Storage Health Index</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex items-baseline gap-3">
            <span className="text-4xl font-black text-teal-500">94.2%</span>
            <span className="text-xs text-muted-foreground font-semibold">Excellent preservation level</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Category Breakdown Graph */}
        <div className="lg:col-span-3 glass-panel p-6 border-none shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Freshness by Food Category</h3>
            <p className="text-xs text-muted-foreground">Mean freshness index calculated for active batches.</p>
          </div>

          <div className="h-[280px] w-full">
            {loading || !RechartsComponents ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <RechartsComponents.ResponsiveContainer width="100%" height="100%">
                <RechartsComponents.BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <RechartsComponents.XAxis 
                    dataKey="name" 
                    stroke="currentColor" 
                    className="text-muted-foreground/60" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <RechartsComponents.YAxis 
                    stroke="currentColor" 
                    className="text-muted-foreground/60" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]}
                    dx={-10}
                  />
                  <RechartsComponents.CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="currentColor" 
                    className="stroke-border/40" 
                  />
                  <RechartsComponents.Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '1rem', 
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                    }}
                    itemStyle={{ color: '#22C55E' }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                  />
                  <RechartsComponents.Bar dataKey="freshness" radius={[8, 8, 0, 0]} barSize={32}>
                    {categoryData.map((entry: any, index: number) => {
                      const color = entry.freshness >= 75 ? "#22C55E" : entry.freshness >= 40 ? "#EAB308" : "#EF4444";
                      return <RechartsComponents.Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </RechartsComponents.Bar>
                </RechartsComponents.BarChart>
              </RechartsComponents.ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Batch Freshness List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-panel border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold">Active Batch Breakdown</CardTitle>
                  <CardDescription>Inspected batches with scores.</CardDescription>
                </div>
                {/* Status selector filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg bg-background/50 border border-border/50 px-2.5 py-1 text-xs focus-visible:outline-none cursor-pointer font-semibold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Near Spoiled">Near Expired</option>
                  <option value="Spoiled">Spoiled</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 pt-0">
              {loading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No matching batches found.</div>
              ) : (
                filteredInventory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-3 bg-muted/30 rounded-xl border border-border/30 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.fruitName} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground leading-none">{item.fruitName}</p>
                          <span className="text-[10px] text-muted-foreground/80 font-mono">({item.id})</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Inspected: {new Date(item.dateAdded).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 border rounded-lg text-xs font-black ${getScoreColorClass(item.freshnessScore)}`}>
                        {item.freshnessScore}%
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
