import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Scan, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface AiScanningModalProps {
  isOpen: boolean;
  imagePreviewUrl: string;
  foodName: string;
  isDemo?: boolean;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, name: 'Image Preprocessing', desc: 'Rescaling, contrast normalization, and color matrix calibration' },
  { id: 2, name: 'Visual Feature Extraction', desc: 'Analyzing surface gloss, pigment variance, and cellular texture' },
  { id: 3, name: 'Freshness Classification', desc: 'Running vision model inference against food freshness index' },
  { id: 4, name: 'Spoilage Analysis', desc: 'Detecting fungal hyphae, soft tissue lesions, and bruising' },
  { id: 5, name: 'Quality Scoring', desc: 'Synthesizing visual (40%), storage (25%), and age (15%) weights' },
  { id: 6, name: 'Shelf-Life Estimation', desc: 'Calculating thermodynamic decay curve and remaining days' },
  { id: 7, name: 'Recommendation Generation', desc: 'Generating climate optimization & consumption advisory' }
];

export const AiScanningModal: React.FC<AiScanningModalProps> = ({
  isOpen,
  imagePreviewUrl,
  foodName,
  isDemo,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      completedRef.current = false;
      return;
    }

    completedRef.current = false;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / STEPS.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(() => {
              onCompleteRef.current();
            }, 350);
          }
          return prev;
        }
      });
    }, 280);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      id="ai-scanning-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Scanning Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700/60 mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isDemo ? 'Demo Mode Analysis' : 'Gemini Multimodal Neural Pipeline'}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Analyzing {foodName || 'Food Sample'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Computer vision algorithms are evaluating biological markers, cell structure, and spoilage indicators.
        </p>

        {/* Live Image Scanning Container */}
        <div className="relative mt-6 w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-inner group">
          <img
            src={imagePreviewUrl}
            alt="Scanning target"
            className="w-full h-full object-cover"
          />
          {/* Animated Green Scanning Laser Bar */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce" />
          
          {/* Futuristic Overlay Grid & Target Reticle */}
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-brightness-110 flex items-center justify-center pointer-events-none">
            <Scan className="w-16 h-16 text-emerald-400/80 animate-pulse" />
          </div>

          <div className="absolute bottom-2 inset-x-2 bg-slate-900/80 backdrop-blur-md rounded-lg py-1 px-2 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>RES: 1024x1024</span>
            <span>SPEC: RGB-VIS</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-6">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Active Step Details */}
        <div className="mt-5 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{STEPS[currentStepIndex].name}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Processing...</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {STEPS[currentStepIndex].desc}
            </p>
          </div>
        </div>

        {/* Safety & Scientific Disclaimer */}
        <div className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Freshness estimate for quality guidance. Not a substitute for lab inspection.</span>
        </div>
      </div>
    </div>
  );
};
