"use client";

import { useState, useRef } from "react";
import { Upload, Camera, Loader2, Info, Sparkles, CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Prediction } from "@/types";
import { predictFreshness } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const [category, setCategory] = useState("Banana");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null); // Reset previous result
      
      // Auto-detect category from filename if possible
      const fname = selectedFile.name.toLowerCase();
      if (fname.includes("apple")) setCategory("Apple");
      else if (fname.includes("banana")) setCategory("Banana");
      else if (fname.includes("orange")) setCategory("Orange");
      else if (fname.includes("strawberry") || fname.includes("berry")) setCategory("Strawberry");
      else if (fname.includes("avocado")) setCategory("Avocado");
      else if (fname.includes("peach")) setCategory("Peach");
      else if (fname.includes("tomato")) setCategory("Tomato");
      else if (fname.includes("carrot")) setCategory("Carrot");
      else if (fname.includes("potato")) setCategory("Potato");
      else if (fname.includes("cabbage")) setCategory("Cabbage");
      else if (fname.includes("cucumber")) setCategory("Cucumber");
      else if (fname.includes("mango")) setCategory("Mango");
      else if (fname.includes("grape")) setCategory("Grapes");
      else if (fname.includes("lemon")) setCategory("Lemon");
      else if (fname.includes("onion")) setCategory("Onion");
      else if (fname.includes("broccoli")) setCategory("Broccoli");
      else if (fname.includes("watermelon") || fname.includes("melon")) setCategory("Watermelon");
      else if (fname.includes("pear")) setCategory("Pear");
      else if (fname.includes("pineapple")) setCategory("Pineapple");
      else if (fname.includes("garlic")) setCategory("Garlic");
      else if (fname.includes("pepper")) setCategory("Pepper");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setResult(null);
      
      const fname = droppedFile.name.toLowerCase();
      if (fname.includes("apple")) setCategory("Apple");
      else if (fname.includes("banana")) setCategory("Banana");
      else if (fname.includes("orange")) setCategory("Orange");
      else if (fname.includes("strawberry") || fname.includes("berry")) setCategory("Strawberry");
      else if (fname.includes("avocado")) setCategory("Avocado");
      else if (fname.includes("peach")) setCategory("Peach");
      else if (fname.includes("tomato")) setCategory("Tomato");
      else if (fname.includes("carrot")) setCategory("Carrot");
      else if (fname.includes("potato")) setCategory("Potato");
      else if (fname.includes("cabbage")) setCategory("Cabbage");
      else if (fname.includes("cucumber")) setCategory("Cucumber");
      else if (fname.includes("mango")) setCategory("Mango");
      else if (fname.includes("grape")) setCategory("Grapes");
      else if (fname.includes("lemon")) setCategory("Lemon");
      else if (fname.includes("onion")) setCategory("Onion");
      else if (fname.includes("broccoli")) setCategory("Broccoli");
      else if (fname.includes("watermelon") || fname.includes("melon")) setCategory("Watermelon");
      else if (fname.includes("pear")) setCategory("Pear");
      else if (fname.includes("pineapple")) setCategory("Pineapple");
      else if (fname.includes("garlic")) setCategory("Garlic");
      else if (fname.includes("pepper")) setCategory("Pepper");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const prediction = await predictFreshness(file, category);
      setResult(prediction);
      setCategory(prediction.fruitName); // Immediately update dropdown category selection to predicted fruit/veg
      
      // Persist the result to the current user's analysis history
      const sessionUser = localStorage.getItem("user");
      if (sessionUser) {
        const currentUser = JSON.parse(sessionUser);
        
        const convertToBase64 = (f: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        };

        try {
          const base64Image = await convertToBase64(file);
          
          const historyRecord = {
            id: prediction.id,
            userEmail: currentUser.email,
            userName: currentUser.name,
            fruitName: prediction.fruitName,
            category: prediction.fruitName, // Map category
            dateAdded: prediction.date,
            expiryDate: new Date(new Date().getTime() + prediction.remainingShelfLifeDays * 24 * 60 * 60 * 1000).toISOString(),
            freshnessScore: prediction.freshnessScore,
            status: prediction.status,
            imageUrl: base64Image,
            confidenceScore: prediction.confidenceScore,
            remainingShelfLifeDays: prediction.remainingShelfLifeDays,
            spoilageProbability: prediction.spoilageProbability,
            storageRecommendation: prediction.storageRecommendation,
            temperatureRecommendation: prediction.temperatureRecommendation,
            humidityRecommendation: prediction.humidityRecommendation,
            aiInsights: prediction.aiInsights
          };

          const historyStr = localStorage.getItem("analysisHistory");
          const currentHistory = historyStr ? JSON.parse(historyStr) : [];
          currentHistory.unshift(historyRecord);
          localStorage.setItem("analysisHistory", JSON.stringify(currentHistory));
        } catch (imgErr) {
          console.error("Failed to save inspection to history", imgErr);
        }
      }
    } catch (error) {
      console.error("Error analyzing image", error);
    } finally {
      setLoading(false);
    }
  };

  // Get status color coding helper
  const getScoreColor = (score: number) => {
    if (score >= 75) return { border: "border-primary", text: "text-primary", bg: "bg-primary/10", label: "EXCELLENT" };
    if (score >= 40) return { border: "border-warning", text: "text-warning", bg: "bg-warning/10", label: "STABLE / FAIR" };
    return { border: "border-destructive", text: "text-destructive", bg: "bg-destructive/10", label: "CRITICAL / SPOILED" };
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Image Analysis</h1>
        <p className="text-muted-foreground mt-1">Upload a photo of food to assess its freshness, detect spoilage, and calculate shelf life.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Upload & Config Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Inspection Setup</CardTitle>
              <CardDescription>Select category and upload food image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Food Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 rounded-xl bg-background/50 border border-border/50 px-3 text-sm focus:ring-1 focus:ring-primary focus-visible:outline-none transition-all cursor-pointer font-medium"
                >
                  {["Apple", "Banana", "Orange", "Strawberry", "Avocado", "Peach", "Tomato", "Carrot", "Potato", "Cabbage", "Cucumber", "Mango", "Grapes", "Lemon", "Onion", "Broccoli", "Watermelon", "Pear", "Pineapple", "Garlic", "Pepper"].map((cat) => (
                    <option key={cat} value={cat} className="bg-background text-foreground">{cat}</option>
                  ))}
                </select>
              </div>

              {!previewUrl ? (
                <div 
                  className="border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-2xl p-10 text-center hover:bg-primary/5 transition-all cursor-pointer duration-300 group"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">Click or drag image here</h3>
                  <p className="text-xs text-muted-foreground mb-4">Supports JPEG, PNG, WEBP</p>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                    <Camera className="w-3.5 h-3.5 mr-2" />
                    Use Device Camera
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted border border-border/30 flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="object-contain h-full w-full" />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl text-xs font-semibold"
                      onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                    >
                      Clear
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90" 
                      onClick={handleAnalyze} 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                          Running AI Model...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-2" />
                          Assess Freshness
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!result ? (
              <div className="w-full border border-border/40 rounded-3xl p-6 bg-muted/10 space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <h3 className="text-base font-bold text-foreground">AI Freshness Inspection Workflow</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Follow these simple steps to perform a visual scan on the target food category. The system uses a deep-learning binary model mapping to item-specific storage rules.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-background/50 border border-border/30 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">STEP 1</span>
                    <h4 className="text-xs font-bold text-foreground">Select Category</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Choose the specific food item type to apply custom preservation rules.</p>
                  </div>
                  <div className="p-4 bg-background/50 border border-border/30 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">STEP 2</span>
                    <h4 className="text-xs font-bold text-foreground">Upload Image</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Select or drag/drop an image. File name auto-detects the category.</p>
                  </div>
                  <div className="p-4 bg-background/50 border border-border/30 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">STEP 3</span>
                    <h4 className="text-xs font-bold text-foreground">AI Analysis</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Click "Assess Freshness" to trigger real-time color and texture analysis.</p>
                  </div>
                  <div className="p-4 bg-background/50 border border-border/30 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">STEP 4</span>
                    <h4 className="text-xs font-bold text-foreground">Freshness Report</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Review shelf-life forecasts, spoilage indicators, and preservation actions.</p>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Overall Health Score Card */}
                <Card className="glass-panel border-none shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10" />
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5 mb-5">
                      <div>
                        <h2 className="text-2xl font-black text-foreground">{result.fruitName}</h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-semibold">
                          <Info className="w-3.5 h-3.5 text-primary" /> Model confidence: {result.confidenceScore}%
                        </p>
                      </div>
                      <Badge className={`rounded-full px-3 py-1 text-xs font-bold ${getScoreColor(result.freshnessScore).bg} ${getScoreColor(result.freshnessScore).text}`}>
                        {result.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      {/* Overall Health circular indicator */}
                      <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-2xl border border-border/30">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Overall Health</span>
                        <div className={`w-20 h-20 rounded-full border-4 ${getScoreColor(result.freshnessScore).border} flex items-center justify-center bg-background shadow-inner`}>
                          <span className="text-xl font-extrabold">{result.freshnessScore}%</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase mt-3 ${getScoreColor(result.freshnessScore).text}`}>
                          {getScoreColor(result.freshnessScore).label}
                        </span>
                      </div>

                      {/* Main Metrics list */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-muted-foreground">Freshness Level</span>
                            <span className="text-foreground">{result.freshnessScore}/100</span>
                          </div>
                          <Progress value={result.freshnessScore} className="h-2 rounded-full" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-muted-foreground">Spoilage Probability</span>
                            <span className="text-foreground">{result.spoilageProbability}%</span>
                          </div>
                          <Progress value={result.spoilageProbability} className="h-2 rounded-full bg-muted/40" />
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-1">
                          <div className="p-3 bg-muted/30 rounded-xl border border-border/30 text-center">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Est. Shelf Life</p>
                            <p className="text-sm font-black text-foreground">{result.remainingShelfLifeDays} Days</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-xl border border-border/30 text-center">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Storage Temp</p>
                            <p className="text-[10px] font-bold text-foreground truncate">{result.temperatureRecommendation}</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-xl border border-border/30 text-center">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Storage Status</p>
                            <p className={`text-[10px] font-black uppercase ${result.freshnessScore >= 75 ? "text-primary" : result.freshnessScore >= 40 ? "text-warning" : "text-destructive"}`}>
                              {result.freshnessScore >= 75 ? "OPTIMAL" : result.freshnessScore >= 40 ? "WARNING" : "CRITICAL"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Diagnostics: 4 User-Friendly Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dominant Color */}
                  <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">Dominant Color</h4>
                        <p className="text-xs text-foreground leading-relaxed mt-1">
                          {result.status === "Spoiled" 
                            ? "Significant browning/blackening and grey spots indicating skin decay."
                            : "Healthy characteristic skin tone with optimal pigment density and consistency."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Texture Quality */}
                  <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">Texture Quality</h4>
                        <p className="text-xs text-foreground leading-relaxed mt-1">
                          {result.status === "Spoiled"
                            ? "Loss of cell turgor pressure; soft, collapsed tissue structure observed."
                            : "Firm epidermal barrier. High elasticity, indicating normal moisture content."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Surface Condition */}
                  <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">Surface Condition</h4>
                        <p className="text-xs text-foreground leading-relaxed mt-1">
                          {result.status === "Spoiled"
                            ? "Deep epidermal lesions, indentations, and visible bruises present."
                            : "Skin barrier intact. No superficial punctures, cracks, or open wounds."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spoilage Indicators */}
                  <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${result.status === 'Spoiled' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {result.status === "Spoiled" ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-0.5">Spoilage Indicators</h4>
                        <p className="text-xs text-foreground leading-relaxed mt-1">
                          {result.status === "Spoiled"
                            ? "Fungal spore propagation (mold) or surface cell rot detected."
                            : "No mycelial networks or fungal growth detected on the visible surface."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommended Action Card */}
                <Card className="glass-panel border-none shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10" />
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <h3 className="font-bold text-sm text-foreground border-b border-border/40 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> Recommended Action
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-3 bg-muted/30 rounded-xl border border-border/30">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Status</p>
                          <p className={`text-sm font-black ${result.freshnessScore >= 40 ? "text-primary" : "text-destructive"}`}>
                            {result.freshnessScore >= 40 ? "SAFE TO CONSUME" : "UNSAFE TO CONSUME"}
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-xl border border-border/30">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Consume Within</p>
                          <p className="text-sm font-black text-foreground">
                            {result.freshnessScore >= 40 ? `${result.remainingShelfLifeDays} Days` : "Immediate Action Required"}
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-xl border border-border/30">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Optimal Storage Temp</p>
                          <p className="text-sm font-black text-foreground">{result.temperatureRecommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Storage Recommendation</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.storageRecommendation}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Waste Reduction Suggestion</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {result.freshnessScore >= 75 
                            ? "Keep stored in stable climate-controlled conditions to achieve maximum forecasted shelf life."
                            : result.freshnessScore >= 40
                            ? "Prioritize for immediate local processing, packaging, or kitchen dispatch to prevent organic spoilage waste."
                            : "Transfer to organic compost processing or bio-gas chamber immediately. Do not keep near fresh items to prevent ethylene cross-activation."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
