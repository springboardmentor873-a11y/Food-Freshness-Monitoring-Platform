"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    localStorage.setItem("user", JSON.stringify({ name, email }));
    setIsAuthenticated(true);
    window.location.reload(); // Refresh to ensure layouts update
  };

  // Prevent flash of content during client-side check
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Leaf className="w-12 h-12 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background relative px-4 overflow-hidden selection:bg-primary/20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-info/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-2 font-bold text-3xl tracking-tight text-primary justify-center mb-8">
            <Leaf className="w-8 h-8 fill-primary" />
            <span>FreshAI</span>
          </div>

          <Card className="glass-panel border-none shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mt-1">Please enter your details to access the dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-name" className="text-sm font-medium text-foreground">Full Name</label>
                  <Input 
                    id="login-name" 
                    type="text" 
                    placeholder="Enter your name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-background/50 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium text-foreground">Email Address</label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="Enter your email ID" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl bg-background/50 h-11"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 mt-2">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-info/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-0">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
