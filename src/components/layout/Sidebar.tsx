"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Scan,
  TrendingUp,
  Clock,
  Thermometer,
  Lightbulb,
  History,
  Package,
  FileText,
  Bell,
  User,
  Settings,
  Leaf
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analyze", href: "/dashboard/analyze", icon: Scan },
  { name: "Freshness", href: "/dashboard/freshness", icon: TrendingUp },
  { name: "Shelf-Life", href: "/dashboard/shelf-life", icon: Clock },
  { name: "Storage", href: "/dashboard/storage", icon: Thermometer },
  { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col hidden md:flex border-r border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-xl transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
          <Leaf className="w-6 h-6 fill-primary" />
          <span>FreshAI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Overview
        </p>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
