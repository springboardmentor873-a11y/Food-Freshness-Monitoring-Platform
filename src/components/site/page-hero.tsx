import { motion } from "./motion";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-14">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 -z-10 h-[420px] bg-[radial-gradient(50%_60%_at_50%_20%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">{eyebrow}</div>
          )}
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            {title}
          </h1>
          {description && <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
