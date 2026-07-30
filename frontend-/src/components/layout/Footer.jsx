import { Link } from "react-router-dom";
import { Leaf, Twitter, Linkedin, Github, Mail } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
];

/**
 * Footer — used on all public/marketing pages (Landing, About, Contact).
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
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
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              AI-powered freshness scoring, shelf-life prediction, and storage guidance —
              built to cut food waste across the supply chain.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                  aria-label="Social link"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AI Powered Food Freshness Monitoring Platform. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">Built for Infosys Springboard.</p>
        </div>
      </div>
    </footer>
  );
}
