import { Sparkles, ShieldCheck, CheckCircle2, Cpu } from "lucide-react";

function AuthHeroBanner({
  title = "Detect Food Freshness with AI",
  subtitle = "Harnessing advanced spectral imaging and deep learning to ensure peak freshness across your entire supply chain.",
}) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-50/80 via-slate-50 to-blue-50/80 px-8 py-12 lg:px-16 text-slate-900 min-h-[420px] lg:min-h-screen border-r border-slate-200/80">
      {/* Background Ambient Glow Effects */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 text-white shadow-lg shadow-green-600/25">
          <ShieldCheck size={24} className="font-extrabold" />
        </div>
        <div>
          <h3 className="font-extrabold tracking-tight text-lg text-slate-900">
            Freshness AI
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            Precision Quality Control
          </p>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 my-auto py-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-6 backdrop-blur-sm shadow-sm">
          <Sparkles size={14} className="text-emerald-600" />
          <span>EfficientNetB0 Neural Inference</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-4 max-w-lg text-sm lg:text-base leading-relaxed text-slate-600 font-normal">
          {subtitle}
        </p>

        {/* AI Scanner Hero Mock Card (Light Spec) */}
        <div className="relative mt-10 rounded-3xl border border-slate-200/80 bg-white/90 p-6 backdrop-blur-md shadow-2xl shadow-slate-200/60 overflow-hidden group">
          {/* Top Badge Overlay */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Cpu size={16} className="text-emerald-600" />
              <span>AI FRESHNESS SCANNER</span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} className="text-emerald-600" />
              AI Scan Complete
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Freshness Index
              </p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-600">
                99%
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                Optimal Window
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AI Confidence
              </p>
              <p className="mt-1 text-3xl font-extrabold text-blue-600">
                98.2%
              </p>
              <p className="text-[11px] font-semibold text-blue-700 mt-0.5">
                High Precision
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sample: Strawberries & Avocados</span>
            <span className="font-mono text-emerald-700 font-bold">Latency: 12ms</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 text-xs text-slate-400 font-medium">
        © 2026 Freshness AI Systems. Enterprise Quality Assurance.
      </div>
    </div>
  );
}

export default AuthHeroBanner;
