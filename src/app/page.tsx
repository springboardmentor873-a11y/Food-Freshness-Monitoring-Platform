"use client";

import Link from "next/link";
import { 
  Leaf, 
  ArrowRight, 
  Activity, 
  Clock, 
  ShieldCheck, 
  BarChart2, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Award, 
  Star, 
  Cpu,
  Layers,
  Database,
  Eye,
  Zap,
  Info,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

// Custom SVG Icons to avoid Lucide version conflicts
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function LandingPage() {
  const features = [
    {
      title: "AI Image Analysis",
      desc: "Upload food images and analyze freshness using AI-powered computer vision.",
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Freshness Prediction",
      desc: "Estimate freshness levels with confidence scores and spoilage detection.",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Shelf-Life Estimation",
      desc: "Predict the remaining shelf life based on food condition and storage information.",
      icon: Clock,
      color: "text-teal-500",
      bg: "bg-teal-500/10"
    },
    {
      title: "Storage Recommendations",
      desc: "Receive intelligent storage and handling recommendations to reduce food waste.",
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload Food Image",
      desc: "Paste, drag, or capture an image of the fruit or vegetable.",
      icon: Upload
    },
    {
      step: "02",
      title: "AI Image Analysis",
      desc: "Our neural network evaluates the surface condition and color parameters.",
      icon: Sparkles
    },
    {
      step: "03",
      title: "Freshness & Shelf-Life Prediction",
      desc: "Get an instant freshness rating and calculated remaining shelf-life index.",
      icon: Clock
    },
    {
      step: "04",
      title: "Storage Recommendations & Reports",
      desc: "View customized climate guidelines and generate PDF/Excel logs.",
      icon: ShieldCheck
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend Framework", icon: Layers, color: "text-blue-400" },
    { name: "Next.js", category: "React Meta-Framework", icon: Cpu, color: "text-foreground" },
    { name: "FastAPI", category: "Python Web API", icon: Zap, color: "text-teal-400" },
    { name: "TensorFlow", category: "Machine Learning", icon: Sparkles, color: "text-orange-500" },
    { name: "OpenCV", category: "Computer Vision", icon: Eye, color: "text-red-500" },
    { name: "PostgreSQL", category: "Database Storage", icon: Database, color: "text-blue-600" },
    { name: "Tailwind CSS", category: "Utility Styling", icon: Layers, color: "text-cyan-400" }
  ];

  const benefits = [
    {
      title: "Accurate AI Predictions",
      desc: "High precision computer vision trained on extensive agricultural datasets.",
      icon: Award
    },
    {
      title: "Reduce Food Waste",
      desc: "Prevent premature spoilage by implementing first-expired first-out workflows.",
      icon: Activity
    },
    {
      title: "Smart Storage Guidance",
      desc: "Avoid chill injuries or accelerated ripening with tailored moisture/temp rules.",
      icon: ShieldCheck
    },
    {
      title: "Real-Time Monitoring",
      desc: "Continual oversight of environmental metrics inside cold storage rooms.",
      icon: Clock
    }
  ];

  const stats = [
    { label: "Images Analyzed", value: "24,580+" },
    { label: "Prediction Accuracy", value: "96.8%" },
    { label: "Food Waste Reduced", value: "32%" },
    { label: "Active Users", value: "1,250+" }
  ];

  const testimonials = [
    {
      quote: "FreshAI has transformed how we manage our fresh produce inventory. We've cut waste in Chamber B by 25% in just a month.",
      author: "Sarah Jenkins",
      role: "Cold Storage Operator, AgriCorp",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "The shelf-life predictions are incredibly reliable. Knowing exactly when a batch of watermelon is going to turn helps us optimize our shipping lanes.",
      author: "David Chen",
      role: "Logistics Manager, GreenGrocer Ltd",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "It's the first time we've seen rule-based climate guidelines paired so seamlessly with real-time visual inspection alerts. An absolute lifesaver.",
      author: "Elena Rostova",
      role: "Quality Assurance Director, BioFoods",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      {/* Navbar */}
      <header className="h-20 border-b border-border/50 flex items-center justify-between px-6 md:px-12 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          <Leaf className="w-8 h-8 fill-primary" />
          <span>FreshAI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
          <Link href="#technology" className="hover:text-primary transition-colors">Technology Stack</Link>
          <Link href="#why-choose" className="hover:text-primary transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/dashboard" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden px-6 md:px-12">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-info/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Enterprise Food Freshness AI
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-none text-foreground">
                AI Food Freshness <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Monitoring Platform</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Detect produce freshness, estimate remaining shelf life, and mitigate supply chain organic waste using state-of-the-art computer vision models.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link href="/dashboard" className="w-full sm:w-auto text-center bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                  Get Started
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto text-center bg-white dark:bg-slate-900 text-foreground border border-border px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-muted transition-all">
                  Login
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/40 aspect-[16/10] bg-muted/20">
              <img 
                src="/hero_illustration.jpg" 
                alt="AI Freshness Monitoring Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 border-t border-border/40 bg-muted/10 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-tight text-foreground">Key Features</h2>
              <p className="text-sm text-muted-foreground mt-2">High-end deep learning visual tools tailored to preserve food inventory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="glass-panel p-6 border-none shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 rounded-2xl group flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bg} ${f.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 border-t border-border/40 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-tight text-foreground">How It Works</h2>
              <p className="text-sm text-muted-foreground mt-2">Four simple steps to complete agricultural visual inventory audits.</p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="text-center space-y-4 relative"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary relative group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground font-mono text-[10px] font-black flex items-center justify-center">
                          {s.step}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section id="technology" className="py-20 border-t border-border/40 bg-muted/10 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-tight text-foreground">Powered By Modern AI Technologies</h2>
              <p className="text-sm text-muted-foreground mt-2">Robust core tech stack driving high-precision computer vision analysis.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {technologies.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="glass-panel p-4 border-none text-center rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <Icon className={`w-6 h-6 ${t.color}`} />
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{t.category}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section id="why-choose" className="py-20 border-t border-border/40 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-tight text-foreground">Why Choose FreshAI</h2>
              <p className="text-sm text-muted-foreground mt-2">Optimizing food chains with precision predictions and waste mitigation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel p-6 border-none shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 rounded-2xl"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">{b.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-primary text-primary-foreground px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/80 via-primary to-emerald-950 opacity-40 pointer-events-none" />
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="text-center space-y-1"
              >
                <p className="text-4xl md:text-5xl font-black tracking-tight">{s.value}</p>
                <p className="text-xs text-primary-foreground/80 font-semibold uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials (Demo) */}
        <section className="py-20 border-t border-border/40 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black tracking-tight text-foreground">What Industry Experts Say</h2>
              <p className="text-sm text-muted-foreground mt-2">Feedback from logistics and cold storage operators using our platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="glass-panel p-6 border-none shadow-sm flex flex-col justify-between rounded-2xl hover:shadow-md transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 border-t border-border/30 mt-6">
                    <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover border border-border/20" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.author}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border/40 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
              <Leaf className="w-6 h-6 fill-primary" />
              <span>FreshAI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detect produce freshness, estimate remaining shelf life, and mitigate supply chain organic waste using state-of-the-art computer vision models.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
              <Link href="#technology" className="hover:text-primary transition-colors">Technology Stack</Link>
              <Link href="#why-choose" className="hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Contact & Socials</h4>
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <GithubIcon className="w-4 h-4" /> GitHub Repository
              </span>
              <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <LinkedinIcon className="w-4 h-4" /> LinkedIn Profile
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Infosys Springboard</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Developed as a capstone project for the Infosys Springboard Virtual Internship program 2026.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© 2026 FreshAI — Developed for Infosys Springboard Virtual Internship</p>
          <p>Designed with Glassmorphic Tailwind Core</p>
        </div>
      </footer>
    </div>
  );
}
