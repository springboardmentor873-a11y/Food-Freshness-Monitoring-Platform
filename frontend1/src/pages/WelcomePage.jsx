import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  ScanLine,
  Activity,
  ShieldCheck,
  Bell,
  FileText,
  User,
  UserCheck,
  Lock,
  ArrowRight,
  EyeOff,
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  KeyRound,
  UserPlus,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import heroFoodImg from "../assets/food_freshness_hero.png";
import { useAuth } from "../context/AuthContext";
import { appToast } from "../components/ui/Toast";

export default function WelcomePage({ initialTab = "signin" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { login, register, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on route if navigated directly
  useEffect(() => {
    if (location.pathname === "/login") {
      setActiveTab("signin");
    } else if (location.pathname === "/register") {
      setActiveTab("signup");
    } else if (location.pathname === "/admin-login") {
      setActiveTab("admin");
    }
  }, [location.pathname]);

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({ username: "", password: "", role: "Consumer" });
  const [signInErrors, setSignInErrors] = useState({});
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    role: "Consumer",
  });
  const [signUpErrors, setSignUpErrors] = useState({});
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Admin Form State
  const [adminForm, setAdminForm] = useState({ adminUsername: "", adminPassword: "" });
  const [adminErrors, setAdminErrors] = useState({});
  const [adminLoading, setAdminLoading] = useState(false);

  // Forgot Password State
  const [resetForm, setResetForm] = useState({ newPassword: "", confirmNewPassword: "" });
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);

  // Handlers for Sign In
  const handleSignInChange = (e) => {
    setSignInForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (signInErrors[e.target.name]) setSignInErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!signInForm.username.trim()) errs.username = "Username is required";
    if (!signInForm.password) errs.password = "Password is required";
    if (Object.keys(errs).length > 0) {
      setSignInErrors(errs);
      return;
    }

    setSignInLoading(true);
    try {
      const loggedInUser = await login(signInForm.username, signInForm.password, signInForm.role);
      setSignInLoading(false);
      appToast.success(`Welcome back, ${loggedInUser.name || signInForm.username}! (${loggedInUser.role})`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSignInLoading(false);
      appToast.error(err.message || "Invalid username or password");
    }
  };

  // Handlers for Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!resetForm.newPassword) {
      errs.newPassword = "New password is required";
    } else if (resetForm.newPassword.length < 6) {
      errs.newPassword = "Must be at least 6 characters";
    }
    if (resetForm.newPassword !== resetForm.confirmNewPassword) {
      errs.confirmNewPassword = "Passwords do not match";
    }
    if (Object.keys(errs).length > 0) {
      setResetErrors(errs);
      return;
    }

    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      appToast.success("Password reset successful! Please sign in.");
      setIsForgotPassword(false);
      setSignInForm((prev) => ({ ...prev, password: resetForm.newPassword }));
      setResetForm({ newPassword: "", confirmNewPassword: "" });
    }, 600);
  };

  // Handlers for Sign Up
  const handleSignUpChange = (e) => {
    setSignUpForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (signUpErrors[e.target.name]) setSignUpErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!signUpForm.fullName.trim()) errs.fullName = "Full Name is required";
    if (!signUpForm.username.trim()) errs.username = "Username is required";
    if (!signUpForm.email.trim()) errs.email = "Email is required";
    if (!signUpForm.mobile.trim()) errs.mobile = "Mobile Number is required";
    if (!signUpForm.password) errs.password = "Password is required";
    if (signUpForm.password !== signUpForm.confirmPassword) errs.confirmPassword = "Passwords do not match";

    if (Object.keys(errs).length > 0) {
      setSignUpErrors(errs);
      return;
    }

    setSignUpLoading(true);
    try {
      await register({
        fullName: signUpForm.fullName,
        username: signUpForm.username,
        email: signUpForm.email,
        password: signUpForm.password,
        mobile: signUpForm.mobile,
        gender: signUpForm.gender,
        role: signUpForm.role,
      });
      setSignUpLoading(false);
      appToast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSignUpLoading(false);
      appToast.error(err.message || "Registration failed. Username or email may already be in use.");
    }
  };

  // Handlers for Admin Login
  const handleAdminChange = (e) => {
    setAdminForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (adminErrors[e.target.name]) setAdminErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!adminForm.adminUsername.trim()) errs.adminUsername = "Admin username required";
    if (!adminForm.adminPassword) errs.adminPassword = "Admin password required";
    if (Object.keys(errs).length > 0) {
      setAdminErrors(errs);
      return;
    }

    setAdminLoading(true);
    try {
      const adminUser = await adminLogin(adminForm.adminUsername, adminForm.adminPassword);
      setAdminLoading(false);
      appToast.success(`Authenticated as Administrator (${adminUser.username})`);
      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setAdminLoading(false);
      appToast.error(err.message || "Admin login failed.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07111F] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* ================================================== */}
      {/* NAVIGATION BAR                                     */}
      {/* ================================================== */}
      <header className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="glass-panel-dark flex items-center justify-between rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-xl border border-cyan-500/15">
          {/* Left Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#07111F]">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                FreshEye AI
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-cyan-400/90 uppercase">
                AI-Powered Freshness Monitoring
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-800/80 bg-[#0B172A]/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => {
                navigate("/");
                setActiveTab("signin");
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                location.pathname === "/" && activeTab === "signin"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Home
            </button>
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              About
            </Link>
            <button
              onClick={() => {
                navigate("/login");
                setActiveTab("signin");
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "signin"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
                setActiveTab("signup");
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Signup
            </button>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-400/90 tracking-wide uppercase">
                System Active
              </span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0B172A] text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-2xl border border-slate-800 bg-[#0B172A] p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate("/");
                    setActiveTab("signin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  Home
                </button>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  About
                </Link>
                <button
                  onClick={() => {
                    setActiveTab("signin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setActiveTab("signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  Signup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================================================== */}
      {/* MAIN HERO SECTION (TWO COLUMNS)                    */}
      {/* ================================================== */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* ============================================== */}
          {/* LEFT COLUMN: FOOD FRESHNESS AI VISUAL          */}
          {/* ============================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-center justify-center relative"
          >
            {/* Visual Container */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              
              {/* Outer Orbit HUD Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-spin-slow" />
              
              {/* Secondary Reverse Orbit HUD Ring */}
              <div className="absolute inset-6 rounded-full border border-cyan-400/10 animate-spin-reverse-slow" />
              
              {/* Glow backdrop */}
              <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-blue-600/15 blur-2xl animate-pulse-glow" />

              {/* Main Food Photo Frame */}
              <div className="relative z-10 w-[82%] h-[82%] rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 bg-[#0B172A] group">
                
                {/* Generated Food Visual Image */}
                <img
                  src={heroFoodImg}
                  alt="Freshness AI Visual"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Laser Overlay Scan Line */}
                <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scan" />

                {/* Scanner Corner Crosshairs */}
                <div className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-md" />
                <div className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-md" />
                <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-md" />
                <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-cyan-400/80 rounded-br-md" />

                {/* Overlay Live Telemetry Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#07111F]/85 px-3 py-1 text-[11px] font-mono font-medium text-cyan-300 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  AI VISION SCANNING :: 99.4%
                </div>

                {/* Freshness Status Indicator */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#07111F]/90 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Overall Status
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      OPTIMAL FRESHNESS
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING FEATURE INDICATORS AROUND FOOD VISUAL */}
              {/* Feature 1: Image Analysis (Top Left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 left-0 z-30 flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-[#101D30]/90 px-3.5 py-2 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur-xl hover:border-cyan-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <ScanLine size={16} />
                </div>
                <span>Image Analysis</span>
              </motion.div>

              {/* Feature 2: Analytics (Top Right) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-6 -right-4 z-30 flex items-center gap-2.5 rounded-2xl border border-blue-500/30 bg-[#101D30]/90 px-3.5 py-2 text-xs font-semibold text-blue-300 shadow-xl backdrop-blur-xl hover:border-blue-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Activity size={16} />
                </div>
                <span>Analytics</span>
              </motion.div>

              {/* Feature 3: Freshness Check (Bottom Left) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 -left-6 z-30 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-[#101D30]/90 px-3.5 py-2 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-xl hover:border-emerald-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={16} />
                </div>
                <span>Freshness Check</span>
              </motion.div>

              {/* Feature 4: Smart Alerts (Right Center) */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-2 -right-4 z-30 flex items-center gap-2.5 rounded-2xl border border-purple-500/30 bg-[#101D30]/90 px-3.5 py-2 text-xs font-semibold text-purple-300 shadow-xl backdrop-blur-xl hover:border-purple-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <Bell size={16} />
                </div>
                <span>Smart Alerts</span>
              </motion.div>

              {/* Feature 5: Reports (Bottom Center) */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -bottom-6 left-1/3 z-30 flex items-center gap-2.5 rounded-2xl border border-teal-500/30 bg-[#101D30]/90 px-3.5 py-2 text-xs font-semibold text-teal-300 shadow-xl backdrop-blur-xl hover:border-teal-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                  <FileText size={16} />
                </div>
                <span>Reports</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ============================================== */}
          {/* RIGHT COLUMN: PREMIUM DARK LOGIN CARD          */}
          {/* ============================================== */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 w-full"
          >
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#101D30] p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
              
              {/* Subtle top card glow line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500" />

              {/* Card Header Branding */}
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-extrabold tracking-widest text-cyan-400 uppercase mb-1">
                  FreshEye AI
                </span>
                
                {/* EXACT REQUIRED TITLE */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  FOOD FRESHNESS
                  <span className="block text-gradient-cyan">MONITORING PLATFORM</span>
                </h1>

                {/* EXACT REQUIRED SUBTITLE */}
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-cyan-400/90">
                  AI-POWERED FRESHNESS & QUALITY MONITORING
                </p>
              </div>

              {/* AUTHENTICATION TABS: Sign In, Sign Up, Admin */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#0B172A] p-1.5 border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setIsForgotPassword(false);
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === "signin"
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-500/40 shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setIsForgotPassword(false);
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-500/40 shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("admin");
                    setIsForgotPassword(false);
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === "admin"
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-500/40 shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* TAB CONTENT ANIMATIONS */}
              <AnimatePresence mode="wait">
                
                {/* TAB 1: SIGN IN FORM */}
                {activeTab === "signin" && !isForgotPassword && (
                  <motion.form
                    key="tab-signin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSignInSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    {/* Username Field */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          name="username"
                          placeholder="Enter your username"
                          value={signInForm.username}
                          onChange={handleSignInChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                      {signInErrors.username && (
                        <p className="mt-1 text-xs font-medium text-rose-400">
                          {signInErrors.username}
                        </p>
                      )}
                    </div>

                    {/* Role Selection Field */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Assigned Role
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <UserCheck size={18} />
                        </span>
                        <select
                          name="role"
                          value={signInForm.role}
                          onChange={handleSignInChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                        >
                          <option value="Consumer">Consumer</option>
                          <option value="Retail Manager">Retail Manager</option>
                          <option value="Warehouse Operator">Warehouse Operator</option>
                          <option value="Food Quality Inspector">Food Quality Inspector</option>
                        </select>
                      </div>
                    </div>


                    {/* Password Field */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Lock size={18} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={signInForm.password}
                          onChange={handleSignInChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-cyan-300"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {signInErrors.password && (
                        <p className="mt-1 text-xs font-medium text-rose-400">
                          {signInErrors.password}
                        </p>
                      )}

                      {/* Forgot Password Link */}
                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    {/* Sign In Primary Button */}
                    <button
                      type="submit"
                      disabled={signInLoading}
                      className="btn-gradient-primary w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all"
                    >
                      {signInLoading ? (
                        <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* FORGOT PASSWORD EXPANSION */}
                {activeTab === "signin" && isForgotPassword && (
                  <motion.form
                    key="tab-forgot"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleResetSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-300 flex items-center gap-2">
                      <KeyRound size={16} className="shrink-0 text-cyan-400" />
                      <span>Enter your new password to reset your credentials.</span>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={resetForm.newPassword}
                        onChange={(e) => setResetForm((f) => ({ ...f, newPassword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 px-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                      {resetErrors.newPassword && (
                        <p className="mt-1 text-xs text-rose-400">{resetErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={resetForm.confirmNewPassword}
                        onChange={(e) => setResetForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 px-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                      {resetErrors.confirmNewPassword && (
                        <p className="mt-1 text-xs text-rose-400">{resetErrors.confirmNewPassword}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="btn-gradient-primary w-full py-3 rounded-xl text-sm font-bold text-white"
                      >
                        {resetLoading ? "Resetting..." : "Confirm Password Reset"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* TAB 2: SIGN UP FORM */}
                {activeTab === "signup" && (
                  <motion.form
                    key="tab-signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSignUpSubmit}
                    noValidate
                    className="space-y-3.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="John Doe"
                          value={signUpForm.fullName}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.fullName && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder="johndoe"
                          value={signUpForm.username}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.username && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.username}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={signUpForm.email}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.email && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="9876543210"
                          value={signUpForm.mobile}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.mobile && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.mobile}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="••••••••"
                          value={signUpForm.password}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.password && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={signUpForm.confirmPassword}
                          onChange={handleSignUpChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        {signUpErrors.confirmPassword && (
                          <p className="mt-1 text-[10px] text-rose-400">{signUpErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                        Assigned User Role
                      </label>
                      <select
                        name="role"
                        value={signUpForm.role}
                        onChange={handleSignUpChange}
                        className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Consumer">Consumer</option>
                        <option value="Retail Manager">Retail Manager</option>
                        <option value="Warehouse Operator">Warehouse Operator</option>
                        <option value="Food Quality Inspector">Food Quality Inspector</option>
                      </select>
                    </div>


                    <button
                      type="submit"
                      disabled={signUpLoading}
                      className="btn-gradient-primary w-full py-3 mt-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2"
                    >
                      {signUpLoading ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* TAB 3: ADMIN FORM */}
                {activeTab === "admin" && (
                  <motion.form
                    key="tab-admin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleAdminSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-300 flex items-center gap-2">
                      <ShieldAlert size={16} className="shrink-0 text-purple-400" />
                      <span>Restricted Portal: Admin Telemetry & System Control</span>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Admin Username
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          name="adminUsername"
                          placeholder="e.g. admin_sys"
                          value={adminForm.adminUsername}
                          onChange={handleAdminChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      {adminErrors.adminUsername && (
                        <p className="mt-1 text-xs text-rose-400">{adminErrors.adminUsername}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Admin Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Lock size={18} />
                        </span>
                        <input
                          type="password"
                          name="adminPassword"
                          placeholder="••••••••"
                          value={adminForm.adminPassword}
                          onChange={handleAdminChange}
                          className="w-full rounded-xl border border-slate-700 bg-[#0B172A] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      {adminErrors.adminPassword && (
                        <p className="mt-1 text-xs text-rose-400">{adminErrors.adminPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="btn-gradient-primary w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2"
                    >
                      {adminLoading ? (
                        <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Admin Login</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ================================================== */}
      {/* BOTTOM FEATURE STRIP (FOUR CARDS)                  */}
      {/* ================================================== */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* CARD 1: AI Powered Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="surface-card-dark rounded-2xl p-5 backdrop-blur-xl border border-cyan-500/15 group transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500/25 group-hover:scale-110 transition-all">
              <Cpu size={22} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              AI Powered Prediction
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Accurate freshness classification using advanced AI models.
            </p>
          </motion.div>

          {/* CARD 2: Freshness Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="surface-card-dark rounded-2xl p-5 backdrop-blur-xl border border-teal-500/15 group transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 group-hover:bg-teal-500/25 group-hover:scale-110 transition-all">
              <Activity size={22} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-white group-hover:text-teal-300 transition-colors">
              Freshness Analysis
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Real-time food quality assessment and condition monitoring.
            </p>
          </motion.div>

          {/* CARD 3: Spoilage Risk Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="surface-card-dark rounded-2xl p-5 backdrop-blur-xl border border-orange-500/15 group transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 group-hover:bg-orange-500/25 group-hover:scale-110 transition-all">
              <AlertTriangle size={22} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-white group-hover:text-orange-300 transition-colors">
              Spoilage Risk Detection
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Early warning for potentially spoiled food to reduce food waste.
            </p>
          </motion.div>

          {/* CARD 4: Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="surface-card-dark rounded-2xl p-5 backdrop-blur-xl border border-purple-500/15 group transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25 group-hover:scale-110 transition-all">
              <Lightbulb size={22} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">
              Smart Recommendations
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              AI-driven recommendations for better decisions and efficiency.
            </p>
          </motion.div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
          FreshEye AI &copy; {new Date().getFullYear()} — AI-Powered Freshness & Quality Monitoring Platform. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
