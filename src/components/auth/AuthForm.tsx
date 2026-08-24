"use client";

import { useState } from "react";
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  onLoginSuccess: () => void;
}

export function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
    setSuccess("");
  };

  const validateEmail = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Validation Checks
    if (!trimmedEmail) {
      setError("Please enter your email ID.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const usersStr = localStorage.getItem("users");
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (mode === "login") {
      // 2. Login Flow
      const matchedUser = users.find((u: any) => u.email === trimmedEmail);
      if (!matchedUser) {
        setError("No account found with this email. Please register first.");
        return;
      }
      if (matchedUser.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }

      // Successful Login -> Write current authenticated session only
      localStorage.setItem("user", JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
      onLoginSuccess();
    } else {
      // 3. Register Flow
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }

      const matchedUser = users.find((u: any) => u.email === trimmedEmail);
      if (matchedUser) {
        setError("An account with this email already exists. Please log in.");
        return;
      }

      // Add user to prototype database array
      const newUser = {
        name: name.trim(),
        email: trimmedEmail,
        password: password
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Successfully Registered -> Show alert, reset form, navigate to Login
      setSuccess("Registration successful. Please log in.");
      setMode("login");
      setName("");
      setPassword("");
      setConfirmPassword("");
    }
  };

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
              <h2 className="text-2xl font-bold tracking-tight">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login"
                  ? "Please enter your details to access the dashboard"
                  : "Register to start monitoring food freshness"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary text-sm flex items-start gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="auth-name">Full Name</Label>
                  <Input
                    id="auth-name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-background/50 h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="auth-email">Email Address</Label>
                <Input
                  id="auth-email"
                  type="text"
                  placeholder="Enter your email ID"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-background/50 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl bg-background/50 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="auth-confirm-password">Confirm Password</Label>
                  <Input
                    id="auth-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl bg-background/50 h-11"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 mt-2"
              >
                {mode === "login" ? "Sign In" : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              {mode === "login" ? (
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={handleToggleMode}
                    className="text-primary font-semibold hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={handleToggleMode}
                    className="text-primary font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
