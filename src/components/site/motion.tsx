/**
 * Lightweight motion shim — CSS-only "framer-motion-like" API.
 * Supports initial/animate/whileInView with IntersectionObserver.
 * Keeps bundle small and avoids adding framer-motion when tw-animate-css exists.
 */
import { useEffect, useRef, useState, type ComponentType, type HTMLAttributes } from "react";

type Variant = { opacity?: number; y?: number; x?: number; scale?: number };
type Common = {
  initial?: Variant;
  animate?: Variant;
  whileInView?: Variant;
  viewport?: { once?: boolean; margin?: string };
  transition?: { delay?: number; duration?: number };
};

function toTransform(v: Variant | undefined) {
  if (!v) return "";
  const parts: string[] = [];
  if (v.y !== undefined) parts.push(`translateY(${v.y}px)`);
  if (v.x !== undefined) parts.push(`translateX(${v.x}px)`);
  if (v.scale !== undefined) parts.push(`scale(${v.scale})`);
  return parts.join(" ");
}

function makeMotion<T extends keyof HTMLElementTagNameMap>(tag: T) {
  const Comp = ({
    initial,
    animate,
    whileInView,
    viewport,
    transition,
    style,
    ...rest
  }: Common & HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }) => {
    const ref = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(!whileInView);

    useEffect(() => {
      if (!whileInView || !ref.current) return;
      const el = ref.current;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setInView(true);
              if (viewport?.once !== false) obs.disconnect();
            } else if (viewport?.once === false) {
              setInView(false);
            }
          });
        },
        { rootMargin: viewport?.margin ?? "-40px" },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [whileInView, viewport?.margin, viewport?.once]);

    const target = whileInView ? (inView ? whileInView : initial) : animate ?? initial;
    const from = initial;
    const activeState = inView || !whileInView ? target : from;

    const dur = transition?.duration ?? 0.7;
    const delay = transition?.delay ?? 0;

    const composedStyle: React.CSSProperties = {
      transition: `opacity ${dur}s cubic-bezier(0.2,0.7,0.2,1) ${delay}s, transform ${dur}s cubic-bezier(0.2,0.7,0.2,1) ${delay}s`,
      opacity: activeState?.opacity ?? 1,
      transform: toTransform(activeState) || undefined,
      willChange: "opacity, transform",
      ...style,
    };

    const Tag = tag as any;
    return <Tag ref={ref} style={composedStyle} {...rest} />;
  };
  return Comp as unknown as ComponentType<Common & HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }>;
}

export const motion = {
  div: makeMotion("div"),
  section: makeMotion("section"),
  li: makeMotion("li"),
  span: makeMotion("span"),
  h2: makeMotion("h2"),
  p: makeMotion("p"),
};
