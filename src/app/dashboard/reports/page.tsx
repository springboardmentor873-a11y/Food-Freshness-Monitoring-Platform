"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  Trash2, 
  Inbox, 
  Award,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("weekly");
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: string, reportName: string) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`Export Successful: "${reportName}" downloaded as ${format}.`);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground mt-1">Review aggregated food preservation intelligence and export records.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-semibold"
            onClick={() => handleExport("PDF", `${activeTab.toUpperCase()} Report`)}
            disabled={exporting !== null}
          >
            <FileText className="w-3.5 h-3.5 mr-2 text-red-500" />
            {exporting === "PDF" ? "Exporting..." : "Export PDF"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-semibold"
            onClick={() => handleExport("Excel", `${activeTab.toUpperCase()} Report`)}
            disabled={exporting !== null}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-primary" />
            {exporting === "Excel" ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border/40 gap-2 overflow-x-auto pb-px">
        {[
          { id: "weekly", label: "Weekly Summary" },
          { id: "freshness", label: "Freshness Report" },
          { id: "waste", label: "Waste Reduction" },
          { id: "health", label: "Inventory Health" },
          { id: "shelflife", label: "Shelf-Life Analytics" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 uppercase tracking-wider ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "weekly" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-none p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Weekly Inspection Volume</span>
                    <Badge className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-[9px] font-bold">Optimal</Badge>
                  </div>
                  <p className="text-3xl font-black text-foreground mt-3">2,450</p>
                  <p className="text-[10px] text-muted-foreground mt-1">+12% scanned compared to last week</p>
                </Card>

                <Card className="glass-panel border-none p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Average Freshness Index</span>
                    <Badge className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-[9px] font-bold">Stable</Badge>
                  </div>
                  <p className="text-3xl font-black text-primary mt-3">82.4%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Normal ripening velocity observed</p>
                </Card>

                <Card className="glass-panel border-none p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Spoiled Batches</span>
                    <Badge className="bg-destructive/20 text-destructive rounded-full px-2 py-0.5 text-[9px] font-bold">Attention</Badge>
                  </div>
                  <p className="text-3xl font-black text-destructive mt-3">24</p>
                  <p className="text-[10px] text-muted-foreground mt-1">-3% waste compared to last week</p>
                </Card>
              </div>

              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Weekly Preservation Log Summary
                  </CardTitle>
                  <CardDescription>Key observations for week ending today.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <p>1. **Fungal Incursions**: Zero active mold alerts detected across Chamber A (Cold Storage) and Chamber B (Ripening Room). Excellent airflow capacity helped inhibit surface rot propagation.</p>
                  <p>2. **Ripening Velocity**: Banana batches (INV-002) ripened 4% faster than standard due to a minor 1.2°C temperature deviation on Tuesday. Humidity bounds have since stabilized.</p>
                  <p>3. **Dispatched Batches**: Out of 230 batches inspected, 194 were successfully dispatched inside their optimal freshness score threshold, keeping wastage below 2.5%.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "freshness" && (
            <div className="space-y-6">
              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Category-Wise Freshness Performance
                  </CardTitle>
                  <CardDescription>Freshness indices sorted by food categories.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-4">
                  {[
                    { category: "Citrus Fruits (Oranges, Lemons)", index: 91, count: 430, status: "Excellent" },
                    { category: "Pome Fruits (Apples, Pears)", index: 88, count: 680, status: "Excellent" },
                    { category: "Leafy Vegetables (Cabbage)", index: 80, count: 210, status: "Optimal" },
                    { category: "Nightshades (Tomatoes, Peppers)", index: 74, count: 520, status: "Stable" },
                    { category: "Bananas & Tropicals", index: 72, count: 610, status: "Stable" }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-1 bg-muted/20 p-3.5 rounded-xl border border-border/30">
                      <div className="flex justify-between text-xs font-bold items-center">
                        <span className="text-foreground">{cat.category} <span className="text-[10px] text-muted-foreground font-normal">({cat.count} scanned)</span></span>
                        <span className="text-primary">{cat.index}% Index</span>
                      </div>
                      <Progress value={cat.index} className="h-2 rounded-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "waste" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-panel border-none p-5 flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Waste Reduction</h4>
                    <p className="text-3xl font-black text-primary mt-1">14.5%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Average improvement from AI alerts</p>
                  </div>
                </Card>

                <Card className="glass-panel border-none p-5 flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weight Saved from Disposal</h4>
                    <p className="text-3xl font-black text-foreground mt-1">280 kg</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Scanned items routed to early sale</p>
                  </div>
                </Card>
              </div>

              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Pre-emptive Dispatch Actions</CardTitle>
                  <CardDescription>AI alerts that directly saved batches from spoiling.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-3">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/30 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-foreground">Cavendish Bananas (Batch INV-092)</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Flagged at 42% freshness score. Dispatched to local bakery for immediate processing.</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-transparent rounded-full font-bold">120kg saved</Badge>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/30 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-foreground">Royal Gala Apples (Batch INV-104)</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Moved from storage room C to refrigerator chamber A after temperature fluctuation warning.</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-transparent rounded-full font-bold">160kg saved</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" /> Active Storage Risk Summary
                  </CardTitle>
                  <CardDescription>Potential safety issues compiled across active chambers.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-4">
                  <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold text-warning-foreground">Humidity Drift warning in Chamber C</h4>
                      <p className="text-muted-foreground mt-1">Relative humidity level is sitting at 76% RH, falling below the optimal 85-90% RH boundary. Risk profile for Potato/Citrus batches currently stored is rising (faster moisture loss predicted).</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold text-primary">Chambers A & B Stable</h4>
                      <p className="text-muted-foreground mt-1">Preservation conditions are optimal. Fungal propagation index remains at lowest levels. Batch aging is proceeding as forecasted by AI.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "shelflife" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-panel border-none p-5 flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-500">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Shelf Life Extension</h4>
                    <p className="text-3xl font-black text-teal-500 mt-1">+2.4 Days</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Average days added via climate optimization</p>
                  </div>
                </Card>

                <Card className="glass-panel border-none p-5 flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Predictive Dispatch Rate</h4>
                    <p className="text-3xl font-black text-foreground mt-1">94.8%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Accuracy of AI shelf-life decay predictions</p>
                  </div>
                </Card>
              </div>

              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Shelf Life Forecasting by Category
                  </CardTitle>
                  <CardDescription>AI-projected storage windows under optimal refrigerator conditions.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-4">
                  {[
                    { category: "Apples", base: 14, optimal: 30, increase: "114%" },
                    { category: "Bananas (Green)", base: 7, optimal: 12, increase: "71%" },
                    { category: "Strawberries", base: 3, optimal: 7, increase: "133%" },
                    { category: "Watermelon (Whole)", base: 10, optimal: 21, increase: "110%" },
                    { category: "Onions", base: 60, optimal: 90, increase: "50%" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1 bg-muted/20 p-3.5 rounded-xl border border-border/30">
                      <div className="flex justify-between text-xs font-bold items-center">
                        <span className="text-foreground">{item.category}</span>
                        <span className="text-primary">+{item.increase} extension</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>Standard: {item.base} days</span>
                        <span className="font-bold text-foreground">AI Optimized: {item.optimal} days</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
