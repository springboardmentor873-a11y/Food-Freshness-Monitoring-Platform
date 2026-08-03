import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { AILoader } from '../components/common/Loader';
import { RadialGauge } from '../components/common/RadialGauge';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  FileImage,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ImageAnalysisPage = () => {
  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState({
    detectedFood: 'Organic Cavendish Bananas',
    category: 'Fruits',
    confidence: 98.4,
    freshnessScore: 92,
    spoilageProbability: 1.6,
    visualIndicators: {
      colorScore: 94,
      textureScore: 90,
      moldRisk: '0.2%',
      bruisingRisk: '2.1%',
      physicalDamage: 'Minimal stem creasing',
    },
    estimatedShelfLifeDays: 5,
    qualityGrade: 'FRESH',
    recommendation: 'Optimal condition for retail distribution. Recommended storage temp 13-14°C.',
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      runSimulatedScan();
    }
  };

  const runSimulatedScan = () => {
    setIsScanning(true);
    toast.loading('AI Computer Vision model analyzing sample...', { id: 'scan-toast' });
    setTimeout(() => {
      setIsScanning(false);
      toast.success('AI Freshness Scan Complete!', { id: 'scan-toast' });
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Camera className="w-7 h-7 text-emerald-400" /> AI Image Analysis & Computer Vision
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload food photos for instant deep-learning freshness inspection, surface mold detection, and texture scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Drag and Drop Zone */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-8 border-dashed border-2 border-emerald-500/40 relative overflow-hidden text-center">
            {isScanning && (
              <div className="absolute inset-x-0 h-1.5 laser-scan-line animate-scan top-0 z-30 pointer-events-none" />
            )}

            <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/10 group max-h-72">
              <img src={selectedImage} alt="Sample Upload" className="w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
                  <AILoader text="Multimodal Neural Scan in Progress..." />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
                <FileImage className="w-4 h-4 text-cyan-400" />
                <span>PNG, JPEG, WEBP supported (Max 25MB)</span>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <label className="cursor-pointer">
                  <span className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 inline-flex items-center space-x-2 hover:from-emerald-400 hover:to-emerald-500 transition-all">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <GlassButton variant="outline" size="md" icon={RefreshCw} onClick={runSimulatedScan}>
                  Rescan Sample
                </GlassButton>
              </div>
            </div>
          </GlassCard>

          {/* Supported AI Vision Modules */}
          <GlassCard className="p-6">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Active Vision Models & Layers
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Color Drift Analysis</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Surface Texture Degradation</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Micro-mold Detection</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bruising & Indentation</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Output Prediction Card */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-8 border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  AI Model Output
                </span>
                <h3 className="text-xl font-extrabold text-white">{result.detectedFood}</h3>
              </div>
              <Badge status={result.qualityGrade} />
            </div>

            {/* Radial Gauge & Confidence */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              <RadialGauge value={result.freshnessScore} size={160} strokeWidth={12} label="Freshness Index" />

              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Prediction Confidence</span>
                  <span className="text-2xl font-extrabold text-cyan-400">{result.confidence}%</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Spoilage Probability</span>
                  <span className="text-xl font-bold text-rose-400">{result.spoilageProbability}%</span>
                </div>
              </div>
            </div>

            {/* Visual Indicators Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Color Score</span>
                <span className="text-white font-bold text-sm">{result.visualIndicators.colorScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Texture Index</span>
                <span className="text-white font-bold text-sm">{result.visualIndicators.textureScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Mold Risk</span>
                <span className="text-emerald-400 font-bold text-sm">{result.visualIndicators.moldRisk}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Bruising Risk</span>
                <span className="text-cyan-400 font-bold text-sm">{result.visualIndicators.bruisingRisk}</span>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
