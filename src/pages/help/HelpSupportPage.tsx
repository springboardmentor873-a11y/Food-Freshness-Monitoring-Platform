import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does FreshSense AI calculate the 0-100 Freshness Score?',
      a: 'FreshSense AI applies a multi-parameter weighted scoring model: 40% Visual Condition (color degradation, turgidity, mold detection), 25% Storage Conditions (temperature, humidity, airflow adherence), 20% Shelf-Life Prediction (Arrhenius decay dynamics), and 15% Product Age Index.'
    },
    {
      q: 'What camera angle and lighting is best for produce scanning?',
      a: 'Place the produce under diffuse white light without strong shadows. Capture the whole item, highlighting surface blemishes, stem condition, or bruising for highest model confidence.'
    },
    {
      q: 'Can FreshSense AI run offline without an internet connection?',
      a: 'Yes. In offline or demo mode, FreshSense AI employs deterministic local machine learning heuristic algorithms to generate instant spoilage predictions.'
    },
    {
      q: 'How do Retail Managers utilize the FIFO rotation recommendations?',
      a: 'The system flags produce batches whose calculated shelf-life window is less than 48 hours and automatically proposes front-of-shelf positioning or promotional discounts.'
    }
  ];

  return (
    <div id="help-support-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <HelpCircle className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Documentation & Support Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Guides, user manuals, and technical FAQs on food freshness monitoring.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
