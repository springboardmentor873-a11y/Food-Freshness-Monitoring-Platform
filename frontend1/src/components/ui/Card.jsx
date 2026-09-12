import { cn } from "../../utils/cn";

const VARIANT_STYLES = {
  default:
    "bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800",
  glass:
    "glass-panel border border-white/40 shadow-md dark:border-white/5",
  gradientBorder:
    "relative bg-white dark:bg-slate-900 border border-transparent [background-clip:padding-box] before:absolute before:-inset-px before:-z-10 before:rounded-[inherit] before:bg-gradient-brand before:content-['']",
  flat: "bg-slate-50 dark:bg-slate-800/60",
};

/**
 * Card — base surface primitive. Compose with Card.Header / Card.Body / Card.Footer
 * for consistent internal spacing across every dashboard panel.
 */
export default function Card({
  children,
  variant = "default",
  hoverable = false,
  padding = "md",
  className,
  ...props
}) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200 ease-premium",
        VARIANT_STYLES[variant],
        paddingStyles[padding],
        hoverable &&
          "hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-dark-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className }) {
  return <div className={cn("text-slate-600 dark:text-slate-300", className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div
      className={cn(
        "mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800",
        className
      )}
    >
      {children}
    </div>
  );
};
