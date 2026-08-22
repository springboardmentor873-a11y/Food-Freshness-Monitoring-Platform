import React from 'react';
import { AnalysisResult } from '../../types';
import { CircularScore } from '../ui/CircularScore';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Clock, 
  Package, 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  FileDown, 
  PlusCircle, 
  ScanLine, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onScanAnother?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onScanAnother
}) => {
  const { addInventoryItem, addToast, setCurrentPage, setSelectedInventoryId } = useApp();

  const handleConfetti = () => {
    if (result.freshnessScore >= 80) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  React.useEffect(() => {
    handleConfetti();
  }, [result.id]);

  const handleSaveToInventory = () => {
    addInventoryItem({
      name: result.foodName,
      category: result.category,
      quantity: 10,
      unit: 'kg',
      batchId: result.batchId || `BATCH-${Date.now().toString().slice(-6)}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      storageDate: new Date().toISOString().split('T')[0],
      expiryDate: result.estimatedExpiryDate,
      storageLocation: 'Primary Cold Staging',
      temperature: result.environmentalContext?.temperature || 8.0,
      humidity: result.environmentalContext?.humidity || 80,
      packaging: result.environmentalContext?.packaging || 'Standard Vented Pack',
      freshnessScore: result.freshnessScore,
      freshnessCategory: result.predictedClass,
      remainingDays: result.remainingShelfLifeDays,
      imageUrl: result.imageUrl,
      notes: `Generated from AI Freshness Scan (${result.predictedClass}, Score: ${result.freshnessScore}/100).`,
      lastInspected: new Date().toISOString().split('T')[0],
      status: result.remainingShelfLifeDays > 3 ? 'In Stock' : result.remainingShelfLifeDays > 0 ? 'Expiring Soon' : 'Critical'
    });
  };

  const handleDownloadReport = () => {
    // Generate simple text report download
    const reportContent = `FRESHSENSE AI - FOOD FRESHNESS & QUALITY REPORT
--------------------------------------------------------
Food Variety: ${result.foodName}
Category: ${result.category}
Analysis ID: ${result.id}
Date & Time: ${new Date(result.timestamp).toLocaleString()}
Batch ID: ${result.batchId || 'N/A'}

ASSESSMENT SUMMARY
--------------------------------------------------------
Freshness Class: ${result.predictedClass}
Freshness Score: ${result.freshnessScore}/100
Confidence: ${(result.confidence * 100).toFixed(1)}%
Risk Level: ${result.riskLevel}
Estimated Remaining Shelf-Life: ${result.remainingShelfLifeDays} Days
Estimated Expiry Date: ${result.estimatedExpiryDate}

SCORE BREAKDOWN (CONCEPTUAL WEIGHTED MODEL)
--------------------------------------------------------
- Visual Condition (40% weight): ${result.breakdown.visualCondition} / 40
- Storage Conditions (25% weight): ${result.breakdown.storageCondition} / 25
- Shelf-Life Prediction (20% weight): ${result.breakdown.shelfLifePrediction} / 20
- Product Age (15% weight): ${result.breakdown.productAge} / 15

SPOILAGE INDICATORS
--------------------------------------------------------
${result.spoilageIndicators.map(i => `• ${i.name}: ${i.status} (${i.description})`).join('\n')}

STORAGE RECOMMENDATIONS
--------------------------------------------------------
${result.recommendations.map(r => `• [${r.priority}] ${r.title}: ${r.reason} (Expected Impact: ${r.expectedImpact})`).join('\n')}

DISCLAIMER
--------------------------------------------------------
AI-generated freshness estimate. Use as an assessment aid, not a substitute for official laboratory testing.
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FreshSense-Report-${result.foodName.replace(/\s+/g, '-')}-${result.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: `Audit file for ${result.foodName} exported successfully.`
    });
  };

  return (
    <div id="analysis-result-view" className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {result.foodName}
              </h2>
              {result.isDemo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Demo Analysis
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scanned on {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Category: {result.category}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="save-to-inventory-btn"
            onClick={handleSaveToInventory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Save to Inventory</span>
          </button>

          <button
            id="export-report-btn"
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          {onScanAnother && (
            <button
              onClick={onScanAnother}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left (Score Card & Image) | Right (Spoilage, Shelf-Life, Recommendations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Circular Score & Breakdown Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-center">
              AI Freshness Score Assessment
            </h3>
            
            <CircularScore
              score={result.freshnessScore}
              category={result.predictedClass}
              confidence={result.confidence}
              breakdown={result.breakdown}
              size="lg"
              showBreakdown={true}
            />
          </div>

          {/* Scanned Image Preview & Batch Details */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
              <img
                src={result.imageUrl}
                alt={result.foodName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-semibold flex items-center gap-1">
                <span>{result.batchId || 'BATCH-PRODUCE'}</span>
              </div>

              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
                Quality Index: {result.qualityScore}%
              </div>
            </div>

            {/* Environmental Snapshot */}
            {result.environmentalContext && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-0.5">
                    <Thermometer className="w-3 h-3 text-rose-500" />
                    <span>Temp</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {result.environmentalContext.temperature}°C
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-0.5">
                    <Droplets className="w-3 h-3 text-cyan-500" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {result.environmentalContext.humidity}%
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-0.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Stored</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {result.environmentalContext.storageDays}d
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Spoilage Analysis, Shelf Life, Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shelf Life Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/20 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Estimated Remaining Shelf Life
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                result.riskLevel === 'Low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : result.riskLevel === 'Moderate'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                Risk: {result.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                  {result.remainingShelfLifeDays}
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Days Remaining</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Projected Expiry Window:</span>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {new Date(result.estimatedExpiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Spoilage Indicators Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                <span>Visual Spoilage Indicators</span>
              </h3>
              <span className="text-[11px] text-slate-400">Multi-spectrum visual defect matrix</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {result.spoilageIndicators.map((indicator, index) => {
                let badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                if (indicator.severity === 'medium') {
                  badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                } else if (indicator.severity === 'high') {
                  badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                }

                return (
                  <div key={index} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {indicator.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                          {indicator.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {indicator.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 sm:text-right shrink-0">
                      Confidence: {(indicator.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>AI Quality & Storage Recommendations</span>
              </h3>
              <span className="text-[11px] text-slate-400">Targeted preservation actions</span>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                      {rec.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Impact: {rec.expectedImpact}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Action: {rec.actionText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
