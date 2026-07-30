import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../shared/ThemeToggle";
import ProfileDropdown from "../shared/ProfileDropdown";
import NotificationCenter from "../shared/NotificationCenter";
import RoleSwitcher from "../shared/RoleSwitcher";
import { cn } from "../../utils/cn";

/**
 * Navbar — sticky topbar for the authenticated app shell.
 * Becomes a translucent glass surface once the page scrolls, matching
 * the Vercel/Linear "scroll-glass" pattern from the design system.
 */
export default function Navbar({ onOpenMobileSidebar }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 transition-all duration-200 sm:px-6",
        scrolled
          ? "glass-panel border-slate-200/70 shadow-sm dark:border-slate-800/70"
          : "border-transparent bg-white dark:bg-[#0B1120]"
      )}
    >
      <button
        onClick={onOpenMobileSidebar}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search everywhere trigger */}
      <button
        onClick={() => navigate("/app/inventory")}
        className="flex h-10 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-400 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600 sm:max-w-sm"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search food items, batches, reports…</span>
        <span className="sm:hidden">Search…</span>
        <kbd className="ml-auto hidden rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-900 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <RoleSwitcher />

        <ThemeToggle />

        <NotificationCenter />

        <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        <ProfileDropdown />
      </div>
    </header>
  );
}

