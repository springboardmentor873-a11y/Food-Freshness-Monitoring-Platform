import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional classNames and resolves Tailwind class conflicts
 * (e.g. cn("px-2", condition && "px-4") -> "px-4", not "px-2 px-4")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
