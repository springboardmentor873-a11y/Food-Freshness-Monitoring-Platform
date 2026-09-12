import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import ThemeToggle from "../components/shared/ThemeToggle";
import Button from "../components/ui/Button";
import Footer from "../components/layout/Footer";
import { cn } from "../utils/cn";

const PUBLIC_NAV = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * PublicLayout — shell for Landing, About, Contact, Login, Register.
 * Lightweight top nav (no sidebar/search/notifications) + shared Footer.
 */
export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0B1120]">
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-200",
          scrolled
            ? "glass-panel border-slate-200/70 dark:border-slate-800/70"
            : "border-transparent bg-white dark:bg-[#0B1120]"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <Leaf size={18} />
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              FreshAI
              <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Food Freshness Monitoring
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {PUBLIC_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="md" onClick={() => navigate("/login")}>
              Log In
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>

          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#0B1120] md:hidden">
            <div className="flex flex-col gap-1">
              {PUBLIC_NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <ThemeToggle />
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => navigate("/register")}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
