import React, { useState } from 'react';
import { 
  Sparkles, 
  ScanLine, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  X,
  Leaf
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Multi-Spectrum Food Freshness Vision',
      badge: 'Step 1 of 3',
      description: 'Upload produce photos to detect chlorophyll degradation, fungal mycelium, surface turgidity loss, and early cellular decay before it becomes visible to the naked eye.',
      icon: <ScanLine className="w-8 h-8 text-emerald-500" />,
      highlight: 'Instant 0–100 Freshness Score + Spoilage Probability'
    },
    {
      title: '4-Pillar Weighted Scientific Model',
      badge: 'Step 2 of 3',
      description: 'Our proprietary scoring combines 40% Visual Condition, 25% Storage Temperature/Humidity compliance, 20% Arrhenius Shelf-Life decay curve, and 15% Post-Harvest Product Age.',
      icon: <Layers className="w-8 h-8 text-teal-500" />,
      highlight: 'Transparent breakdown with defect severity tags'
    },
    {
      title: 'Role-Tailored Intelligence Consoles',
      badge: 'Step 3 of 3',
      description: 'Switch freely between 5 enterprise personas: Consumer (kitchen pantry & recipes), Retail Manager (FIFO rotation), Warehouse Operator (cold chain sensors), and Inspector (HACCP audits).',
      icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
      highlight: 'Full supply chain visibility & zero-waste recommendations'
    }
  ];

  const currentStep = steps[step];

  return (
    <div 
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div 
        id="onboarding-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              {currentStep.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 w-fit">
            {currentStep.icon}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {currentStep.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            ✨ {currentStep.highlight}
          </div>
        </div>

        {/* Navigation & Progress Dots */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? 'w-6 bg-emerald-600'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
