"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";
import { InventoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Hourglass, Calendar, AlertTriangle, ArrowUpRight, Flame, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ShelfLifePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error("Failed to load inventory for shelf-life page", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const criticalItems = inventory.filter(item => Math.max(1, Math.round(item.freshnessScore / 10)) <= 3);
  const stableItems = inventory.filter(item => Math.max(1, Math.round(item.freshnessScore / 10)) > 3);

  // Helper to determine color bounds for progress indicators
  const getProgressColor = (days: number) => {
    if (days <= 2) return "bg-destructive";
    if (days <= 5) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Shelf-Life Prediction</h1>
        <p className="text-muted-foreground mt-1">AI-calculated remaining shelf life forecasting timeline and dispatch warnings.</p>
      </div>

      {/* Overview stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-none shadow-sm flex items-center p-6">
          <div className="p-3 bg-destructive/10 text-destructive rounded-xl mr-4">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Urgent Dispatch Required</p>
            <div className="text-2xl font-black text-foreground">{loading ? <Skeleton className="h-7 w-12 mt-1" /> : `${criticalItems.length} Batches`}</div>
          </div>
        </Card>

        <Card className="glass-panel border-none shadow-sm flex items-center p-6">
          <div className="p-3 bg-primary/10 text-primary rounded-xl mr-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stable Batches</p>
            <div className="text-2xl font-black text-foreground">{loading ? <Skeleton className="h-7 w-12 mt-1" /> : `${stableItems.length} Batches`}</div>
          </div>
        </Card>

        <Card className="glass-panel border-none shadow-sm flex items-center p-6">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Batch Shelf Life</p>
            <div className="text-2xl font-black text-foreground">10.2 Days</div>
          </div>
        </Card>
      </div>

      {/* Critical Dispatch Table/Timeline */}
      <Card className="glass-panel border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" /> Critical Shelf-Life Expirations
              </CardTitle>
              <CardDescription>Batches with 3 days or less remaining. Requires immediate shipping or processing.</CardDescription>
            </div>
            <Link href="/dashboard/analyze">
              <Button size="sm" className="rounded-xl text-xs font-semibold">
                Assess Batch <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0 space-y-4">
          {loading ? (
            [1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : criticalItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">All inventory batches have healthy remaining shelf life!</div>
          ) : (
            criticalItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.fruitName} className="w-12 h-12 rounded-lg object-cover border border-border/20" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.fruitName} <span className="text-xs font-normal text-muted-foreground">({item.id})</span></h4>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Expiry: {item.expiryDate}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Freshness: {item.freshnessScore}%</span>
                    <span className="text-destructive">{Math.max(1, Math.round(item.freshnessScore / 10))} days remaining</span>
                  </div>
                  <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getProgressColor(Math.max(1, Math.round(item.freshnessScore / 10)))}`}
                      style={{ width: `${Math.max(1, Math.round(item.freshnessScore / 10)) * 10}%` }}
                    />
                  </div>
                </div>

                <Link href="/dashboard/recommendations">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold w-full md:w-auto">
                    View Storage Plan
                  </Button>
                </Link>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Extended Shelf Life Forecasting Timeline */}
      <Card className="glass-panel border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-primary" /> Active Inventory Timelines
          </CardTitle>
          <CardDescription>Detailed prediction log of all stored batches.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0 space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
          ) : stableItems.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">No active batches.</div>
          ) : (
            stableItems.map((item, index) => (
              <div key={item.id} className="p-3 bg-muted/30 rounded-xl border border-border/30 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.fruitName} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.fruitName} <span className="text-[10px] font-normal text-muted-foreground">({item.id})</span></h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Exits cold storage on: {item.expiryDate}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-muted-foreground">Freshness: {item.freshnessScore}%</span>
                    <span className="text-primary">{Math.max(1, Math.round(item.freshnessScore / 10))} Days Left</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getProgressColor(Math.max(1, Math.round(item.freshnessScore / 10)))}`}
                      style={{ width: `${(Math.max(1, Math.round(item.freshnessScore / 10)) / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold h-fit w-fit">
                  STABLE
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
