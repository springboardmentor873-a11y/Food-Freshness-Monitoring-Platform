import React, { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploader } from '../../components/analysis/ImageUploader';
import { AiScanningModal } from '../../components/analysis/AiScanningModal';
import { AnalysisResultView } from '../../components/analysis/AnalysisResultView';
import { AnalysisResult, FoodCategory } from '../../types';
import { api } from '../../services/api';
import { Sparkles, ScanLine, ArrowLeft, ShieldAlert } from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const { addAnalysis, isDemoMode, addToast } = useApp();

  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [tempScanningData, setTempScanningData] = useState<{
    imageUrl: string;
    foodName: string;
    result?: AnalysisResult;
  } | null>(null);

  const handleStartAnalysis = async (data: {
    imageUrl: string;
    imageBase64?: string;
    foodName: string;
    category: FoodCategory;
    batchId: string;
    temperature: number;
    humidity: number;
    packaging: string;
    storageDays: number;
  }) => {
    setTempScanningData({
      imageUrl: data.imageUrl,
      foodName: data.foodName
    });
    setIsScanning(true);

    try {
      const result = await api.analyzeFoodImage({
        imageBase64: data.imageBase64,
        imageUrl: data.imageUrl,
        foodName: data.foodName,
        category: data.category,
        batchId: data.batchId,
        temperature: data.temperature,
        humidity: data.humidity,
        packaging: data.packaging,
        storageDays: data.storageDays
      });

      // We will set currentResult once scanning animation finishes
      setTempScanningData((prev) => ({
        imageUrl: data.imageUrl,
        foodName: data.foodName,
        ...(prev || {}),
        result
      }));
    } catch (err) {
      console.error('Error analyzing image:', err);
      setIsScanning(false);
      addToast({
        type: 'error',
        title: 'Analysis Error',
        message: 'Could not complete image evaluation. Please retry.'
      });
    }
  };

  const handleScanAnimationComplete = useCallback(() => {
    setIsScanning(false);
    setTempScanningData((currentData) => {
      if (currentData?.result) {
        const finalResult = currentData.result;
        setCurrentResult(finalResult);
        addAnalysis(finalResult);
        addToast({
          type: 'success',
          title: 'Analysis Complete',
          message: `Evaluated ${finalResult.foodName} as ${finalResult.predictedClass} (Score: ${finalResult.freshnessScore}/100).`
        });
      }
      return null;
    });
  }, [addAnalysis, addToast]);

  const handleScanAnother = () => {
    setCurrentResult(null);
    setTempScanningData(null);
  };

  return (
    <div id="analyze-page" className="space-y-6">
      {/* Header */}
      {!currentResult && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ScanLine className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Food Freshness & Spoilage AI Analysis
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload or capture produce photos to evaluate freshness scores, detect spoilage, and predict shelf life.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Spectral Vision</span>
            </span>
          </div>
        </div>
      )}

      {/* Main View: Result or Uploader */}
      {currentResult ? (
        <div className="space-y-4">
          <button
            onClick={handleScanAnother}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Image Scanner</span>
          </button>
          
          <AnalysisResultView
            result={currentResult}
            onScanAnother={handleScanAnother}
          />
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <ImageUploader
            onStartAnalysis={handleStartAnalysis}
            isLoading={isScanning}
          />
        </div>
      )}

      {/* Scanning Modal with 7-step sequence */}
      {isScanning && tempScanningData && (
        <AiScanningModal
          isOpen={isScanning}
          imagePreviewUrl={tempScanningData.imageUrl}
          foodName={tempScanningData.foodName}
          isDemo={isDemoMode}
          onComplete={handleScanAnimationComplete}
        />
      )}
    </div>
  );
};
