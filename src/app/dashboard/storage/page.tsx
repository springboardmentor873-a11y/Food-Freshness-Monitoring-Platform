"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  RefreshCw, 
  Wrench, 
  Sliders, 
  AlertTriangle,
  CheckCircle2,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function StorageMonitoringPage() {
  const [calibrating, setCalibrating] = useState<string | null>(null);
  const [purging, setPurging] = useState<string | null>(null);

  // Clearly labeled simulated chamber data
  const [chambers, setChambers] = useState([
    {
      id: "CH-A",
      name: "Chamber A: Cold Room",
      type: "Refrigerated (Apples, Carrots, Stone Fruit)",
      currentTemp: 1.8,
      targetTemp: 1.0,
      currentHumidity: 92,
      targetHumidity: 92,
      ethyleneLevel: 0.08, // ppm
      status: "Optimal",
      airFlow: 94,
    },
    {
      id: "CH-B",
      name: "Chamber B: Ripening Room",
      type: "Moderate Temp (Bananas, Avocados)",
      currentTemp: 14.2,
      targetTemp: 14.0,
      currentHumidity: 88,
      targetHumidity: 88,
      ethyleneLevel: 2.10, // ppm (higher for ripening)
      status: "Optimal",
      airFlow: 88,
    },
    {
      id: "CH-C",
      name: "Chamber C: Ambient Zone",
      type: "Cool Dry (Tomatoes, Citrus, Potatoes)",
      currentTemp: 19.5,
      targetTemp: 18.0,
      currentHumidity: 76, // out of bounds
      targetHumidity: 85,
      ethyleneLevel: 0.45, // ppm
      status: "Humidity Warning",
      airFlow: 72,
    }
  ]);

  const handleCalibrate = (chamberId: string) => {
    setCalibrating(chamberId);
    setTimeout(() => {
      setCalibrating(null);
      alert(`Calibration complete for ${chamberId}. Sensor metrics synchronized.`);
    }, 2000);
  };

  const handlePurgeEthylene = (chamberId: string) => {
    setPurging(chamberId);
    setTimeout(() => {
      setPurging(null);
      setChambers(prev => prev.map(ch => {
        if (ch.id === chamberId) {
          return { ...ch, ethyleneLevel: 0.02 };
        }
        return ch;
      }));
      alert(`Ethylene gas purge complete for ${chamberId}. Levels reduced to 0.02 ppm.`);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Storage Monitoring</h1>
          <p className="text-muted-foreground mt-1">Real-time status of preservation chambers *(Simulated environmental metrics)*.</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-transparent px-3 py-1 text-xs font-bold rounded-full">
          Simulation Mode Active
        </Badge>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-2xl border border-warning/30 bg-warning/5 text-warning-foreground flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <p className="text-xs text-muted-foreground">
          **Warning Alert:** Chamber C relative humidity is currently at 76% RH, falling below the optimal 85-90% threshold. Ethylene scrubbing cycles may need adjustments.
        </p>
      </div>

      {/* Chambers Display Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {chambers.map((ch, index) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="glass-panel border-none shadow-sm overflow-hidden h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-bold">{ch.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{ch.type}</CardDescription>
                    </div>
                    <Badge variant="outline" className={`rounded-full text-[10px] font-bold ${ch.status === 'Optimal' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning-foreground border-warning/20'}`}>
                      {ch.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Climate stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/40 rounded-xl border border-border/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground leading-none font-bold uppercase tracking-wider mb-1">Temperature</p>
                        <p className="text-lg font-black text-foreground">{ch.currentTemp}°C</p>
                        <p className="text-[9px] text-muted-foreground">Target: {ch.targetTemp}°C</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/40 rounded-xl border border-border/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground leading-none font-bold uppercase tracking-wider mb-1">Humidity</p>
                        <p className="text-lg font-black text-foreground">{ch.currentHumidity}% RH</p>
                        <p className="text-[9px] text-muted-foreground">Target: {ch.targetHumidity}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Ethylene details */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> Ethylene Level</span>
                      <span className="text-foreground">{ch.ethyleneLevel} ppm</span>
                    </div>
                    <Progress value={Math.min(100, (ch.ethyleneLevel / 3.0) * 100)} className="h-2 rounded-full" />
                    <p className="text-[9px] text-muted-foreground">Safety limit: 2.50 ppm max.</p>
                  </div>

                  {/* Airflow */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Airflow Speed</span>
                      <span className="text-foreground">{ch.airFlow}% capacity</span>
                    </div>
                    <Progress value={ch.airFlow} className="h-2 rounded-full" />
                  </div>
                </CardContent>
              </div>

              {/* simulated actions */}
              <div className="p-4 border-t border-border/30 flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl text-[11px] font-bold"
                  onClick={() => handleCalibrate(ch.id)}
                  disabled={calibrating !== null}
                >
                  {calibrating === ch.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3 h-3 mr-1" />
                      Calibrate
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl text-[11px] font-bold"
                  onClick={() => handlePurgeEthylene(ch.id)}
                  disabled={purging !== null}
                >
                  {purging === ch.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Purging...
                    </>
                  ) : (
                    <>
                      <Wind className="w-3 h-3 mr-1" />
                      Purge Ethylene
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
