import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  Upload,
  ImageIcon,
  Sparkles,
  Download,
  RefreshCw,
  Info,
  CheckCircle2,
  Clock,
  Thermometer,
  Droplets,
  Boxes,
  Loader2,
  ScanLine,
} from "lucide-react";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "AI Analysis — FreshTrack" },
      {
        name: "description",
        content:
          "Upload a food image and get a full AI diagnostic report: freshness score, shelf life, spoilage probability, and storage recommendations.",
      },
      { property: "og:title", content: "FreshTrack AI Analysis" },
      {
        property: "og:description",
        content:
          "Upload a food image and receive an enterprise-grade freshness diagnostic in seconds.",
      },
    ],
  }),
  component: AnalyzePage,
});

type Result = {
  food: string;
  status: "Fresh" | "Rotten" | "At risk";
  confidence: number;
  freshness: number;
  shelfLife: number;
  spoilage: number;
  storage: { temp: string; humidity: string; packaging: string };
  notes: string[];
};

function AnalyzePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((f: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    setState("idle");
    setResult(null);
  }, []);

  const analyze = async () => {
    if (!inputRef.current?.files?.[0]) return;

    setState("loading");

    try {
      const formData = new FormData();
      formData.append("file", inputRef.current.files[0]);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const freshness =
        data.status === "Fresh"
          ? Math.round(data.confidence)
          : Math.round(100 - data.confidence);

      setResult({
        food: data.fruit,
        status: data.status,
        confidence: data.confidence,
        freshness: freshness,
        shelfLife: data.status === "Fresh" ? 10 : 0,
        spoilage: Number((100 - freshness).toFixed(1)),
        storage: {
          temp: "N/A",
          humidity: "N/A",
          packaging: "N/A",
        },
        notes: ["Prediction generated using AI model."],
      });

      setState("done");
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
      setState("idle");
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setState("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="relative py-16 lg:py-20">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 -z-10 h-[420px] bg-[radial-gradient(50%_60%_at_50%_20%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
      />
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">
            AI Analysis
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Diagnose food quality{" "}
            <span className="text-gradient-brand">in seconds.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Upload any food photograph. FreshTrack returns type, freshness
            score, spoilage probability, shelf life, and precise storage
            recommendations — with a downloadable diagnostic report.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Uploader */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-primary-dark" />
                Image input
              </div>
              {preview && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset
                </button>
              )}
            </div>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className={`mt-4 relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
                drag
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  {state === "loading" && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm">
                      <div
                        aria-hidden
                        className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_2px_var(--primary)]"
                        style={{
                          animation: "float-slow 1.6s ease-in-out infinite",
                        }}
                      />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-medium shadow-elegant">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          Analyzing image…
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium">
                    Drop a food photo, or{" "}
                    <span className="text-primary-dark underline underline-offset-4">
                      browse
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    PNG, JPG up to 20MB. Any lighting, any angle.
                  </p>
                </div>
              )}
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                disabled={!preview || state === "loading"}
                onClick={analyze}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {state === "loading" ? "Analyzing…" : "Analyze image"}
              </button>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Info className="h-3.5 w-3.5" /> Best results with a well-lit,
                centered subject.
              </div>
            </div>
          </div>

          {/* Report */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-elegant">
            {state !== "done" || !result ? (
              <EmptyReport />
            ) : (
              <Report result={result} />
            )}
          </div>
        </div>

        {state === "done" && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-dark">
              <Download className="h-4 w-4" /> Download PDF report
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-foreground/30"
            >
              <RefreshCw className="h-4 w-4" /> Analyze another image
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyReport() {
  return (
    <div className="flex h-full flex-col">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        Diagnostic report
      </div>
      <div className="mt-4 grid flex-1 place-items-center rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
            <ScanLine className="h-6 w-6" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">
            Awaiting analysis
          </p>
          <p className="mt-1 max-w-xs text-sm text-ink-muted">
            Upload an image and click{" "}
            <span className="font-medium text-foreground">Analyze</span> to
            generate a full report.
          </p>
        </div>
      </div>
    </div>
  );
}

function Report({ result }: { result: Result }) {
  const scoreColor =
    result.freshness >= 80
      ? "text-success"
      : result.freshness >= 60
        ? "text-warning"
        : "text-destructive";
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Diagnostic report
          </div>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="font-display text-2xl font-semibold">
              {result.food}
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> {result.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-ink-muted">
            Confidence
          </div>
          <div className="font-display text-xl font-semibold">
            {result.confidence}%
          </div>
        </div>
      </div>

      {/* Freshness gauge */}
      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Freshness score</div>
          <div className={`font-display text-3xl font-semibold ${scoreColor}`}>
            {result.freshness}
            <span className="text-sm text-ink-muted">/100</span>
          </div>
        </div>
        <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary to-accent"
            style={{ width: `${result.freshness}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-widest text-ink-muted">
          <span>Rotten</span>
          <span>Aging</span>
          <span>Fresh</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          icon={Clock}
          label="Shelf life"
          value={`${result.shelfLife} days`}
        />
        <Stat
          icon={Boxes}
          label="Spoilage prob."
          value={`${result.spoilage}%`}
        />
        <Stat
          icon={Thermometer}
          label="Storage temp"
          value={result.storage.temp}
        />
        <Stat
          icon={Droplets}
          label="Humidity"
          value={result.storage.humidity}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Storage recommendation
        </div>
        <p className="mt-2 text-sm">
          Store at <span className="font-medium">{result.storage.temp}</span>{" "}
          with <span className="font-medium">{result.storage.humidity}</span>{" "}
          relative humidity in a{" "}
          <span className="font-medium">
            {result.storage.packaging.toLowerCase()}
          </span>
          . Rotate every 48 hours.
        </p>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Observations
        </div>
        <ul className="mt-2 space-y-2 text-sm">
          {result.notes.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary" />{" "}
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
