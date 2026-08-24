function Step({ number, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-green-50 font-extrabold text-green-600 border border-green-200/60 text-xs">
        {number}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed pt-1">
        {text}
      </p>
    </div>
  );
}

function HowItWorksCard() {
  return (
    <div id="how-it-works" className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">
        How AI Quality Detection Works
      </h3>

      <div className="space-y-5">
        <Step
          number="1"
          text="Upload or capture a high-resolution image of your food inventory item."
        />

        <Step
          number="2"
          text="Our EfficientNetB0 neural model classifies surface decay and color spectra."
        />

        <Step
          number="3"
          text="Receive an instant freshness rating, confidence score, and shelf-life prediction."
        />
      </div>
    </div>
  );
}

export default HowItWorksCard;