import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  Box,
  Bell,
  BarChart3,
  FileText,
  Lock,
  Cpu,
  Menu,
  X,
  Activity,
  Zap,
  Check,
  Shield,
  FileSpreadsheet,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-800">
      {/* ========================================================================= */}
      {/* 1. NAVIGATION HEADER                                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                AI Food Freshness
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-600 block">
                Monitoring System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-green-600 transition cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("technology")}
              className="hover:text-green-600 transition cursor-pointer"
            >
              AI Tech
            </button>
            <button
              onClick={() => scrollToSection("workflow")}
              className="hover:text-green-600 transition cursor-pointer"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection("analytics")}
              className="hover:text-green-600 transition cursor-pointer"
            >
              Analytics & Security
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-green-600/20 hover:bg-green-700 hover:shadow-lg transition cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-green-600/20 hover:bg-green-700 hover:shadow-lg transition"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-6 py-6 space-y-4 shadow-xl">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left font-bold text-slate-700 py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("technology")}
              className="block w-full text-left font-bold text-slate-700 py-2"
            >
              AI Tech
            </button>
            <button
              onClick={() => scrollToSection("workflow")}
              className="block w-full text-left font-bold text-slate-700 py-2"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection("analytics")}
              className="block w-full text-left font-bold text-slate-700 py-2"
            >
              Analytics & Security
            </button>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-xs font-extrabold text-white shadow-md"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center rounded-2xl bg-green-600 py-3 text-xs font-extrabold text-white shadow-md"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-slate-50 via-green-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-extrabold text-green-800 border border-green-200">
                <Sparkles size={14} className="text-green-600" />
                <span>Computer Vision & AI Freshness Classification</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                AI-Powered Food Freshness Monitoring & Spoilage Prevention
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Our EfficientNetB0-based AI model analyzes food images to classify freshness, generate confidence-based predictions, and support food inventory monitoring.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {user ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-green-600/25 hover:bg-green-700 hover:scale-[1.02] transition cursor-pointer"
                  >
                    <span>Launch Operations Dashboard</span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-green-600/25 hover:bg-green-700 hover:scale-[1.02] transition"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight size={18} />
                    </Link>

                    <Link
                      to="/login"
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
                    >
                      <span>Sign In to Account</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={() => navigate(user ? "/food-detection" : "/login")}
                  className="flex items-center gap-2 rounded-2xl bg-blue-50 px-6 py-4 text-sm font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                >
                  <ScanLine size={18} />
                  <span>Try Live AI Inspection</span>
                </button>
              </div>

              {/* Value Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700 justify-center lg:justify-start">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span>EfficientNetB0 Neural Model</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700 justify-center lg:justify-start">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span>Fresh / Spoiled Classification</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700 justify-center lg:justify-start">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span>Inventory & Expiry Alerts</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-green-400 to-blue-500 opacity-20 blur-xl"></div>

                <div className="relative rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 space-y-6">
                  {/* Top Header inside preview */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-200">
                        <Activity size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">AI Produce Inspection</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">EfficientNetB0 Neural Model</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700 border border-green-200">
                      CLASSIFICATION READY
                    </span>
                  </div>

                  {/* Sample Card Graphic */}
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80"
                      alt="Fresh Red Apples Sample"
                      className="h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      <ScanLine size={12} className="text-green-400" />
                      <span>Classified: Fresh Apples</span>
                    </div>
                  </div>

                  {/* Metric Sub-cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classification</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">Fresh / Spoiled Output</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confidence Metric</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">Model Probability Score</p>
                    </div>
                  </div>

                  {/* Recommendation Pill */}
                  <div className="rounded-2xl bg-green-50 p-3.5 border border-green-200 text-xs text-green-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    <span>AI prediction complete. Item logged to freshness records.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CAPABILITY METRICS BAR (4-COLUMN LAYOUT)                               */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-green-400">EfficientNetB0</p>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Freshness Model</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">Fresh / Spoiled</p>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Classification Output</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-purple-400">Confidence Score</p>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Prediction Metric</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">Real-Time</p>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE FEATURES GRID (#features)                                         */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 bg-white scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-200">
              Core Platform Features
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Complete Food Quality & Inventory Monitoring System
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Designed to support food freshness classification, stock tracking, and inventory reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-green-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">EfficientNetB0 Deep Learning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computer vision neural model that evaluates food images to classify produce into fresh or spoiled categories with confidence metrics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Box size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Food Inventory Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log, search, filter, and track perishables by category, purchase date, storage location, and expiry status.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-amber-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Expiry & Spoilage Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                System notifications and reminders for near-expiry and spoiled items to support proactive food stock management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">PDF & CSV Report Exports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate formatted PDF report documents and CSV data logs for food inventory records and prediction history.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Freshness Analytics & Trends</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View category distribution charts, prediction history logs, and system metrics on the interactive operations dashboard.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 hover:border-red-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Authentication & Security (RBAC)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                JWT user authentication, OAuth 2.0 Google login, 2FA Authenticator setup, and Role-Based Access Control (Consumer vs Admin).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AI TECH & NEURAL INFERENCE SECTION (#technology)                      */}
      {/* ========================================================================= */}
      <section id="technology" className="py-20 lg:py-28 bg-slate-900 text-white scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
              AI Model Architecture
            </span>
            <h2 className="text-3xl font-black sm:text-4xl text-white">
              EfficientNetB0 Neural Classification Pipeline
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Powered by Keras EfficientNetB0 architecture analyzing food images to determine freshness status.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            {/* Tech Card 1 */}
            <div className="rounded-3xl bg-slate-800/90 p-8 border border-slate-700 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">EfficientNetB0 Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deep learning Keras model utilizing depthwise separable convolutions for image feature extraction and freshness classification.
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-400 shrink-0" />
                  <span>224x224 RGB Image Input Normalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-400 shrink-0" />
                  <span>Transfer Learning Model Weights</span>
                </li>
              </ul>
            </div>

            {/* Tech Card 2 */}
            <div className="rounded-3xl bg-slate-800/90 p-8 border border-slate-700 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Class Probability Scores</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates probability distribution across fresh and spoiled categories (`fresh_fruits`, `spoiled_fruits`, `fresh_bread`, etc.).
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-400 shrink-0" />
                  <span>Softmax Normalization Layer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-400 shrink-0" />
                  <span>Fresh vs Spoiled Output Mapping</span>
                </li>
              </ul>
            </div>

            {/* Tech Card 3 */}
            <div className="rounded-3xl bg-slate-800/90 p-8 border border-slate-700 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Confidence Metric Output</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates a model confidence score percentage for each uploaded food image prediction.
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Percentage Confidence Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Logged to Prediction History</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (WORKFLOW) (#workflow)                                    */}
      {/* ========================================================================= */}
      <section id="workflow" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              How Food Freshness Detection Works
            </h2>
            <p className="text-sm text-slate-500">From food image upload to prediction output and inventory logging.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1 */}
            <div className="relative rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 font-black text-xl border border-green-200">
                1
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Upload Food Image</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select or upload a food produce photo via file uploader (JPG, PNG, WEBP).
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-black text-xl border border-blue-200">
                2
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">AI Model Inference</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                EfficientNetB0 deep learning model evaluates image features and calculates class confidence scores.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-black text-xl border border-purple-200">
                3
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">View Results & Save</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review Fresh / Spoiled classification, confidence score, log to prediction history, and save to inventory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ANALYTICS & SECURITY SECTION (#analytics)                             */}
      {/* ========================================================================= */}
      <section id="analytics" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200">
              Governance & Security
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Operations Analytics & System Security
            </h2>
            <p className="text-sm text-slate-500">Dashboard metrics, formatted report exports, and role-based access control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Analytics Card 1 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Dashboard Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor category distribution pie charts, daily prediction history logs, inventory totals, and system status probes.
              </p>
            </div>

            {/* Analytics Card 2 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforces Consumer and Admin role permissions, JWT token authentication, Google Sign-In, and 2FA Authenticator setup.
              </p>
            </div>

            {/* Analytics Card 3 */}
            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                <FileSpreadsheet size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">PDF & CSV Report Exporter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate downloadable PDF report cards and CSV logs for inventory items and prediction history records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CALL-TO-ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight">
            Start Monitoring Food Freshness with AI
          </h2>
          <p className="text-sm sm:text-base text-green-100 max-w-2xl mx-auto leading-relaxed">
            Classify food freshness, manage food inventory, and track freshness history.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-green-800 shadow-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <span>Access Dashboard Now</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-green-800 shadow-xl hover:bg-slate-100 transition"
                >
                  <span>Create Free Account</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 py-12 text-slate-400 border-t border-slate-800 text-xs">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white font-bold">
                <ShieldCheck size={20} />
              </div>
              <span className="text-sm font-extrabold text-white">
                AI Food Freshness Monitoring System
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-6 font-semibold">
              <Link to="/login" className="hover:text-white transition">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-white transition cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("technology")}
                className="hover:text-white transition cursor-pointer"
              >
                AI Tech
              </button>
              <button
                onClick={() => scrollToSection("workflow")}
                className="hover:text-white transition cursor-pointer"
              >
                Workflow
              </button>
              <button
                onClick={() => scrollToSection("analytics")}
                className="hover:text-white transition cursor-pointer"
              >
                Analytics & Security
              </button>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4 border-t border-slate-800/80">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
              FastAPI Python Backend
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
              React 19 & Vite
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
              EfficientNetB0 Neural Model
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
              PostgreSQL & SQLite DB
            </span>
          </div>

          <div className="text-center md:text-left pt-2 text-slate-500">
            © {new Date().getFullYear()} AI Food Freshness Monitoring System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
