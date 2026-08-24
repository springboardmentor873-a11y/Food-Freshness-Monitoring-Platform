"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";
import { InventoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  History, 
  Trash2, 
  Eye, 
  Download, 
  FileSpreadsheet, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchLocalHistory = () => {
      try {
        const sessionUser = localStorage.getItem("user");
        if (sessionUser) {
          const currentUser = JSON.parse(sessionUser);
          const historyStr = localStorage.getItem("analysisHistory");
          if (historyStr) {
            const fullHistory = JSON.parse(historyStr);
            // Filter records belonging to this user
            const userHistory = fullHistory.filter((item: any) => item.userEmail === currentUser.email);
            setHistoryList(userHistory);
          } else {
            setHistoryList([]);
          }
        } else {
          setHistoryList([]);
        }
      } catch (error) {
        console.error("Failed to load local history data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocalHistory();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inspection record from history?")) {
      setHistoryList(prev => prev.filter(item => item.id !== id));
      
      const sessionUser = localStorage.getItem("user");
      if (sessionUser) {
        const currentUser = JSON.parse(sessionUser);
        const historyStr = localStorage.getItem("analysisHistory");
        if (historyStr) {
          const fullHistory = JSON.parse(historyStr);
          // Keep all records except the matching ID belonging to the current user
          const updatedHistory = fullHistory.filter(
            (item: any) => !(item.id === id && item.userEmail === currentUser.email)
          );
          localStorage.setItem("analysisHistory", JSON.stringify(updatedHistory));
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fresh":
        return <Badge className="bg-primary/20 text-primary border-transparent rounded-full px-2 py-0.5 text-[10px] font-bold">FRESH</Badge>;
      case "Near Spoiled":
        return <Badge className="bg-warning/20 text-warning-foreground border-transparent rounded-full px-2 py-0.5 text-[10px] font-bold">NEAR EXPIRED</Badge>;
      default:
        return <Badge className="bg-destructive/20 text-destructive border-transparent rounded-full px-2 py-0.5 text-[10px] font-bold">SPOILED</Badge>;
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 75) return "text-primary font-bold";
    if (score >= 40) return "text-warning font-bold";
    return "text-destructive font-bold";
  };

  const filteredHistory = historyList.filter(item => {
    const matchesSearch = item.fruitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory || item.fruitName === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Detection History</h1>
          <p className="text-muted-foreground mt-1">Log list of all processed food inspections and AI analysis records.</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-primary" />
          Export History Log
        </Button>
      </div>

      {/* History Card with Filter and Table */}
      <Card className="glass-panel border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Inspection Records
              </CardTitle>
              <CardDescription>Browse and review previous scans.</CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border border-border/50 px-3 text-xs focus-visible:outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Categories</option>
                {["Apple", "Banana", "Orange", "Strawberry", "Avocado", "Peach", "Tomato", "Carrot", "Potato", "Cabbage", "Cucumber", "Mango", "Grapes", "Lemon", "Onion", "Broccoli", "Watermelon", "Pear", "Pineapple", "Garlic", "Pepper"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border border-border/50 px-3 text-xs focus-visible:outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Fresh">Fresh</option>
                <option value="Near Spoiled">Near Spoilage</option>
                <option value="Spoiled">Spoiled</option>
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  className="pl-9 h-10 bg-background/50 rounded-xl text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Item Scan</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Batch ID</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Inspected Date & Time</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Freshness Score</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Confidence</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Shelf Life</th>
                  <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i}>
                      <td className="p-4"><Skeleton className="h-10 w-24 rounded-lg" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-14" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-16 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-muted-foreground">No inspection records found.</td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.fruitName} className="w-10 h-10 rounded-lg object-cover border border-border/20" />
                        <span className="font-bold text-foreground">{item.fruitName}</span>
                      </td>
                      <td className="p-4 text-muted-foreground font-semibold">{item.category}</td>
                      <td className="p-4 font-mono font-medium text-muted-foreground">{item.id}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(item.dateAdded).toLocaleDateString()} • {10 + (idx % 3)}:{(idx * 13) % 60} {idx % 2 === 0 ? "AM" : "PM"}
                      </td>
                      <td className="p-4">
                        <span className={getScoreColorClass(item.freshnessScore)}>{item.freshnessScore}%</span>
                      </td>
                      <td className="p-4 font-semibold text-muted-foreground">
                        {Math.min(99, 85 + (item.freshnessScore % 15))}%
                      </td>
                      <td className="p-4">{getStatusBadge(item.status)}</td>
                      <td className="p-4 font-semibold text-foreground">{Math.max(1, Math.round(item.freshnessScore / 10))} Days</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
