"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Lightbulb, 
  Thermometer, 
  Droplets, 
  Info, 
  Ban, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const rules = [
    {
      name: "Apple",
      temp: "0-2°C (32-35°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator Crisper Drawer",
      gasProfile: "High Ethylene Emitter",
      tip: "Keep apples away from vegetables (like carrots/cucumbers) as they release ethylene gas which accelerates spoilage.",
      coStorage: "Do not store with green leafy vegetables."
    },
    {
      name: "Banana",
      temp: "13-15°C (56-60°F)",
      humidity: "85-90% RH",
      placement: "Room Temperature (Hook/Tree)",
      gasProfile: "High Ethylene Emitter",
      tip: "Hang bananas on a stand to prevent bruising. Do not place in plastic bags or refrigerate (causes skin blackening).",
      coStorage: "Keep separate from other ripe fruits unless trying to ripen them."
    },
    {
      name: "Orange / Citrus",
      temp: "4-7°C (39-45°F)",
      humidity: "85-90% RH",
      placement: "Refrigerator (Mesh Bag)",
      gasProfile: "Low Gas Activity",
      tip: "Store oranges in mesh bags to enable airflow. Avoid airtight zip bags which encourage mold growth.",
      coStorage: "Store separately from high ethylene emitters."
    },
    {
      name: "Strawberry / Berries",
      temp: "0-1°C (32-34°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator (Ventilated)",
      gasProfile: "Ethylene Sensitive",
      tip: "Do not wash berries until immediately before consumption. Moisture triggers rapid mold growth.",
      coStorage: "Store in single layer on paper towels for best results."
    },
    {
      name: "Avocado",
      temp: "4-13°C (39-55°F)",
      humidity: "85-90% RH",
      placement: "Room Temp then Fridge",
      gasProfile: "Ethylene Emitter & Sensitive",
      tip: "Let ripen at room temperature. Once skin yields to gentle pressure, transfer to refrigerator to halt decay.",
      coStorage: "Store next to bananas if you want to accelerate ripening."
    },
    {
      name: "Tomato",
      temp: "12-15°C (54-60°F)",
      humidity: "85-90% RH",
      placement: "Room Temp (Stems-down)",
      gasProfile: "Moderate Emitter",
      tip: "Store stems-down away from sunlight. Reheating or refrigerating tomatoes alters flavor enzymes and makes flesh mealy.",
      coStorage: "Can store on countertops in cool pantry zones."
    },
    {
      name: "Carrot",
      temp: "0-1°C (32-34°F)",
      humidity: "95-98% RH",
      placement: "Refrigerator (Sealed Bag)",
      gasProfile: "Ethylene Sensitive",
      tip: "Cut green leafy tops off immediately as they draw moisture from the roots. Wrap carrots in damp paper towels.",
      coStorage: "Keep far away from apples and bananas."
    },
    {
      name: "Potato",
      temp: "7-10°C (45-50°F)",
      humidity: "90-95% RH",
      placement: "Pantry (Dark/Cool Box)",
      gasProfile: "Sensitive to Gas",
      tip: "Keep potatoes in dark, ventilated boxes. Light triggers green patches (solanine toxin). Avoid storing near onions.",
      coStorage: "Keep separate from onions (onions release gas causing potatoes to sprout)."
    },
    {
      name: "Cabbage / Lettuce",
      temp: "0-1°C (32-34°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator Crisper Drawer",
      gasProfile: "Ethylene Sensitive",
      tip: "Keep outer protective leaves on to preserve moisture. Wrap loosely in plastic wrap.",
      coStorage: "Avoid storing adjacent to apples, melons, or pears."
    },
    {
      name: "Cucumber",
      temp: "10-12°C (50-54°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator (Warmest Part)",
      gasProfile: "Highly Ethylene Sensitive",
      tip: "Cucumbers are prone to chilling injuries below 7°C. Store at front of fridge or door shelves, not at the back.",
      coStorage: "Extremely sensitive to bananas and tomatoes."
    },
    {
      name: "Mango",
      temp: "12-13°C (54-55°F)",
      humidity: "85-90% RH",
      placement: "Room Temp then Fridge",
      gasProfile: "Ethylene Emitter & Sensitive",
      tip: "Store at room temperature until fully ripe, then refrigerate. Avoid stacking to prevent bruising.",
      coStorage: "Do not store with high-ethylene emitters like apples or bananas."
    },
    {
      name: "Grapes",
      temp: "0-1°C (32-34°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator (Perforated Bag)",
      gasProfile: "Ethylene Sensitive",
      tip: "Keep refrigerated in a perforated bag. Do not wash berries until ready to eat.",
      coStorage: "Store separately from high ethylene emitters."
    },
    {
      name: "Lemon / Lime",
      temp: "4-10°C (39-50°F)",
      humidity: "85-90% RH",
      placement: "Refrigerator (Sealed Zip Bag)",
      gasProfile: "Low Gas Activity",
      tip: "Store in a sealed zip bag in the refrigerator. Lasts up to 4 weeks compared to countertop.",
      coStorage: "Store separately from high ethylene emitters."
    },
    {
      name: "Onion",
      temp: "7-10°C (45-50°F)",
      humidity: "65-70% RH",
      placement: "Pantry (Dark/Cool Box)",
      gasProfile: "Ethylene Emitter",
      tip: "Store in a cool, dark, well-ventilated pantry space. Keep away from potatoes (causes sprouting).",
      coStorage: "Never store onions and potatoes together."
    },
    {
      name: "Broccoli",
      temp: "0-1°C (32-34°F)",
      humidity: "95-98% RH",
      placement: "Refrigerator (Damp Towel)",
      gasProfile: "Highly Ethylene Sensitive",
      tip: "Wrap loosely in a damp paper towel and store in the crisper drawer of your refrigerator.",
      coStorage: "Avoid storing adjacent to apples or bananas."
    },
    {
      name: "Watermelon",
      temp: "10-15°C (50-59°F)",
      humidity: "85-90% RH",
      placement: "Room Temp then Fridge (once cut)",
      gasProfile: "Ethylene Sensitive",
      tip: "Store whole watermelon at cool room temperature. Once cut, wrap tightly in plastic and refrigerate.",
      coStorage: "Keep whole melons separate from high-ethylene producers."
    },
    {
      name: "Pear",
      temp: "0-1°C (32-34°F)",
      humidity: "90-95% RH",
      placement: "Room Temp then Fridge",
      gasProfile: "High Ethylene Emitter",
      tip: "Store at room temp until ripe (neck yields to gentle pressure), then transfer to the refrigerator.",
      coStorage: "Avoid storing close to leafy green vegetables."
    },
    {
      name: "Pineapple",
      temp: "7-10°C (45-50°F)",
      humidity: "85-90% RH",
      placement: "Room Temp or Refrigerator",
      gasProfile: "Low Gas Activity",
      tip: "Store at room temperature or refrigerate. Wrap cut pineapple in airtight containers.",
      coStorage: "Can be stored near citrus fruits without issues."
    },
    {
      name: "Garlic",
      temp: "15-18°C (60-65°F)",
      humidity: "60-70% RH",
      placement: "Pantry (Dark/Cool Box)",
      gasProfile: "Low Gas Activity",
      tip: "Store in a cool, dry, dark pantry in a mesh bag. Do not refrigerate (causes sprouting).",
      coStorage: "Keep stored near onions, away from damp zones."
    },
    {
      name: "Pepper / Bell Pepper",
      temp: "7-10°C (45-50°F)",
      humidity: "90-95% RH",
      placement: "Refrigerator Crisper Drawer",
      gasProfile: "Ethylene Sensitive",
      tip: "Store dry in a perforated plastic bag inside the refrigerator crisper drawer.",
      coStorage: "Avoid storing adjacent to bananas or tomatoes."
    }
  ];

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.placement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.tip.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "All" || 
                        (filterType === "Refrigerated" && r.placement.includes("Refrigerator")) ||
                        (filterType === "Ambient" && !r.placement.includes("Refrigerator"));
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Preservation Guidelines</h1>
        <p className="text-muted-foreground mt-1">Searchable database of rule-based storage recommendations and ethylene sensitivity profiles.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by food name, placement, or storage tips..."
            className="pl-10 h-11 bg-background/50 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-11 rounded-xl bg-background/50 border border-border/50 px-3 text-sm focus-visible:outline-none cursor-pointer font-semibold shrink-0"
        >
          <option value="All">All Placements</option>
          <option value="Refrigerated">Refrigerated Storage</option>
          <option value="Ambient">Room Temp / Ambient</option>
        </select>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule, idx) => (
          <motion.div
            key={rule.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
          >
            <Card className="glass-panel border-none shadow-sm h-full flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
              <div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">{rule.name}</CardTitle>
                    <Badge variant="secondary" className="rounded-full text-[10px] font-bold px-2.5 py-0.5">
                      {rule.placement}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{rule.gasProfile}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-1">
                  {/* Climate specs */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Thermometer className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-0.5">Temp</p>
                        <p className="font-bold text-foreground">{rule.temp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-0.5">Humidity</p>
                        <p className="font-bold text-foreground">{rule.humidity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Tip */}
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex gap-2.5">
                    <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Preservation Tip</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rule.tip}</p>
                    </div>
                  </div>

                  {/* Co-storage warnings */}
                  <div className="p-3 bg-destructive/5 rounded-xl border border-destructive/20 flex gap-2.5">
                    <Ban className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-0.5">Avoid Storing Adjacent To</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rule.coStorage}</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
