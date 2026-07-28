"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopNavbar() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Note: in a real app, use next-themes. For now, a simple toggle.
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 w-full border-b border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className="relative hidden sm:flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search inventory, analytics..." 
            className="w-64 md:w-80 pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background rounded-full transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
        </Button>
        
        <div className="h-6 w-px bg-border/50 mx-1"></div>
        
        <div className="flex items-center gap-3 pl-1 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none mb-1">{displayName}</p>
            <p className="text-xs text-muted-foreground leading-none">{displayEmail}</p>
          </div>
          <Avatar className="w-9 h-9 border-2 border-background shadow-sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
