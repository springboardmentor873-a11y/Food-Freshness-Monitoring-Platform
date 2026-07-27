import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-elegant">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11Z" />
          <path d="M12 21V9" opacity=".55" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">FreshTrack</span>
    </Link>
  );
}
