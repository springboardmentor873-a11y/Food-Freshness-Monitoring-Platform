"use client";

import { useEffect, useState } from "react";
import { getDashboardData, getAnalytics, getInventory } from "@/services/api";
import { DashboardStats, ChartDataPoint, InventoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Apple, 
  AlertTriangle, 
  Trash2, 
  CheckCircle2, 
  Timer, 
  BarChart3, 
  Thermometer, 
  Droplets,
  ArrowUpRight,
  ShieldAlert,
  Inbox
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Operator");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUserName(u.name.split(" ")[0] || "Operator");
    }

    const fetchData = async () => {
      try {
        const [statsData, analyticsData, inventoryData] = await Promise.all([
          getDashboardData(),
          getAnalytics(),
          getInventory()
        ]);
        setStats(statsData);
        setChartData(analyticsData);
        // Get items that are near spoiled or spoiled for alerts
        const alerts = inventoryData
          .filter(item => item.status === "Near Spoiled" || item.status === "Spoiled")
          .slice(0, 3);
        setRecentAlerts(alerts);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Responsive area chart components from Recharts
  // Importing dynamically to prevent SSR hydration errors
  const [RechartsComponents, setRechartsComponents] = useState<any>(null);
  useEffect(() => {
    import("recharts").then((mod) => {
      setRechartsComponents(mod);
    });
  }, []);

  const statCards = [
    { title: "Total Tracked Items", value: stats?.totalFruits, icon: Inbox, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Active inventory items", trend: "+12 this week", trendColor: "text-blue-500" },
    { title: "Average Freshness", value: stats ? `${stats.averageFreshnessScore}%` : null, icon: BarChart3, color: "text-primary", bg: "bg-primary/10", desc: "Mean freshness index", trend: "↑1.2% this week", trendColor: "text-primary" },
    { title: "Critical Alerts", value: stats?.nearSpoiled, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", desc: "Items near expiration", trend: "↓3 alerts", trendColor: "text-warning" },
    { title: "Spoiled / Waste", value: stats?.spoiledFruits, icon: Trash2, color: "text-destructive", bg: "bg-destructive/10", desc: "Marked for composting", trend: "↓15% waste", trendColor: "text-destructive" },
    { title: "Est. Shelf Life", value: stats ? `${stats.avgShelfLifeRemaining} Days` : null, icon: Timer, color: "text-teal-500", bg: "bg-teal-500/10", desc: "Average remaining time", trend: "+0.8 days avg", trendColor: "text-teal-500" },
    { title: "Chamber Health", value: "98.4%", icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Environmental status", trend: "↑0.2% stable", trendColor: "text-purple-500" },
  ];

  const chambers = [
    { name: "Chamber A: Cold Storage", temp: "1.8°C", humidity: "92% RH", status: "Optimal", color: "bg-primary/20 text-primary" },
    { name: "Chamber B: Ripening Room", temp: "14.2°C", humidity: "88% RH", status: "Optimal", color: "bg-primary/20 text-primary" },
    { name: "Chamber C: Ambient Zone", temp: "19.5°C", humidity: "76% RH", status: "Warning", color: "bg-warning/20 text-warning-foreground" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner / Greeting & Welcome Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">AI Food Freshness Monitoring Platform</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Here is your freshness monitoring overview for today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/analyze">
              <Button className="rounded-xl shadow-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                New Inspection
              </Button>
            </Link>
          </div>
        </div>

        {/* Today's Summary Panel */}
        <div className="glass-panel border-none shadow-sm p-6 grid grid-cols-2 md:grid-cols-5 gap-6 bg-primary/5 rounded-2xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Images Analyzed Today</p>
            <p className="text-2xl font-black text-foreground">24</p>
            <p className="text-[10px] text-primary font-bold">↑ 8% from yesterday</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fresh Items</p>
            <p className="text-2xl font-black text-primary">18</p>
            <p className="text-[10px] text-muted-foreground font-semibold">Ready for dispatch</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Near Spoilage</p>
            <p className="text-2xl font-black text-warning">4</p>
            <p className="text-[10px] text-warning font-semibold">Priority sorting</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spoiled Items</p>
            <p className="text-2xl font-black text-destructive">2</p>
            <p className="text-[10px] text-destructive font-semibold">To composting</p>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Freshness Score</p>
            <p className="text-2xl font-black text-foreground">82%</p>
            <p className="text-[10px] text-primary font-bold">↑ 1.2% this week</p>
          </div>
        </div>
      </div>

      {/* Environmental Warning Panel */}
      <div className="p-4 rounded-2xl border border-warning/20 bg-warning/5 text-warning-foreground flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-warning/10 text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Environmental Deviation Warning</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Chamber C (Ambient Zone) relative humidity is currently at 76% RH, falling below the optimal 85-90% threshold for Bananas.</p>
          </div>
        </div>
        <Link href="/dashboard/storage">
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-warning hover:bg-warning/10 shrink-0">
            Adjust Settings <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass-card border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-3 w-[150px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="glass-card border-none shadow-sm hover:shadow-lg hover:scale-[1.01] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold tracking-tight flex items-baseline justify-between">
                      {stat.value !== null && stat.value !== undefined ? stat.value : <Skeleton className="h-8 w-16" />}
                      {stat.trend && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted/80 ${stat.trendColor}`}>
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{stat.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Charts & Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Freshness Area Graph */}
        <div className="lg:col-span-2 glass-panel p-6 border-none shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Freshness & Spoilage Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly summary of processed items.</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Fresh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Spoiled</span>
              </div>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            {loading || !RechartsComponents ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <RechartsComponents.ResponsiveContainer width="100%" height="100%">
                <RechartsComponents.AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardColorFresh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="dashboardColorSpoiled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
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
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: 'var(--foreground)' }}
                  />
                  <RechartsComponents.Area 
                    type="monotone" 
                    dataKey="fresh" 
                    name="Fresh"
                    stroke="#22C55E" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#dashboardColorFresh)" 
                  />
                  <RechartsComponents.Area 
                    type="monotone" 
                    dataKey="spoiled" 
                    name="Spoiled"
                    stroke="#EF4444" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#dashboardColorSpoiled)" 
                  />
                </RechartsComponents.AreaChart>
              </RechartsComponents.ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chambers Panel */}
        <div className="glass-panel p-6 border-none shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Storage Zone status</h3>
            <p className="text-xs text-muted-foreground mb-6">Simulated climate monitor.</p>
            
            <div className="space-y-4">
              {chambers.map((chamber, i) => (
                <div key={i} className="p-3 bg-muted/40 rounded-xl border border-border/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">{chamber.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> {chamber.temp}</span>
                      <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> {chamber.humidity}</span>
                    </div>
                  </div>
                  <Badge className={`rounded-full px-2 py-0.5 text-[10px] ${chamber.color}`}>
                    {chamber.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <Link href="/dashboard/storage" className="mt-4 block">
            <Button variant="outline" className="w-full rounded-xl text-xs font-semibold">
              View Climatic Zones
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Row - Alerts & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action Items Panel */}
        <Card className="glass-panel border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Expiration Alerts</CardTitle>
            <CardDescription>Items identified by AI requiring immediate dispatch/sorting.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-3">
            {loading ? (
              [1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
            ) : recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No alerts active.</p>
            ) : (
              recentAlerts.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.fruitName} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none mb-1">{item.fruitName}</p>
                      <p className="text-[10px] text-muted-foreground">Freshness: {item.freshnessScore}% • Expiry: {item.expiryDate}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-transparent px-2.5 py-0.5 rounded-full text-[10px] bg-warning/20 text-warning-foreground`}>
                    {item.status}
                  </Badge>
                </div>
              ))
            )}
            <Link href="/dashboard/inventory" className="block pt-2">
              <Button variant="ghost" className="w-full text-xs font-semibold text-primary hover:bg-primary/5 rounded-xl">
                Open Inventory Manager <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Quick Tips */}
        <Card className="glass-panel border-none shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Waste Reduction Suggestion</CardTitle>
            <CardDescription>Preservation tasks compiled by AI.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                <p>Transfer the **Cavendish Bananas** (Batch INV-002) out of Chamber C immediately to avoid rapid ripening triggered by the humidity drop.</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                <p>Pack the **Granny Smith Apples** (Batch INV-001) into airtight storage crates to limit ethylene gas distribution inside the main cold room.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Link href="/dashboard/recommendations" className="flex-1">
                <Button className="w-full rounded-xl text-xs font-semibold" variant="outline">
                  Browse AI Guidelines
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
