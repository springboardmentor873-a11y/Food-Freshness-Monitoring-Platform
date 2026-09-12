import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const SPINNER_SIZES = { sm: 16, md: 24, lg: 36 };

/**
 * Spinner — inline loading indicator for buttons, small panels, empty async states.
 */
export function Spinner({ size = "md", className }) {
  return (
    <Loader2
      size={SPINNER_SIZES[size]}
      className={cn("animate-spin text-emerald-500", className)}
      aria-hidden="true"
    />
  );
}

/**
 * FullPageLoader — used while a whole route/page is resolving initial data.
 */
export function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

/**
 * Skeleton — base shimmer block. Compose into SkeletonCard / SkeletonTable / SkeletonText.
 */
export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800",
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }) {
  return (
    <Skeleton
      className={cn("shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <SkeletonAvatar size={36} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800", className)}>
      <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-2/3" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-3 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
