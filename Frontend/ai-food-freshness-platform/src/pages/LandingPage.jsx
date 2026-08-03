import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Camera,
  Hourglass,
  Thermometer,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3,
  Users,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Accordion } from '../components/common/Accordion';
import { RadialGauge } from '../components/common/RadialGauge';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  const stats = [
    { label: 'Foods Monitored', value: '4.8M+', icon: BarChart3, color: 'text-emerald-400' },
    { label: 'Freshness Accuracy', value: '99.4%', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Food Waste Reduced', value: '38%', icon: TrendingUp, color: 'text-lime-400' },
    { label: 'Active Enterprise Users', value: '12.5K', icon: Users, color: 'text-purple-400' },
  ];

  const features = [
    {
      title: 'AI Image Analysis',
      desc: 'Multimodal computer vision detects micro-mold, bruising, skin degradation, and texture anomalies instantly.',
      icon: Camera,
      badge: 'Real-time Computer Vision',
    },
    {
      title: 'Shelf Life Prediction',
      desc: 'Machine learning algorithms calculate precise remaining fresh days based on degradation curves and storage variables.',
      icon: Hourglass,
      badge: 'Predictive ML Engine',
    },
    {
      title: 'Storage Monitoring Telemetry',
      desc: 'Stream IoT sensors for temperature, humidity, airflow, and light exposure directly to automated rule engines.',
      icon: Thermometer,
      badge: 'IoT Cold Chain Sync',
    },
    {
      title: 'Spoilage Anomaly Prevention',
      desc: 'Automated warnings notify warehouse managers before degradation spreads across adjacent storage racks.',
      icon: ShieldCheck,
      badge: 'Automated Quarantine',
    },
  ];

  const faqItems = [
    {
      question: 'How does the AI detect food freshness from simple photos?',
      answer: 'Our proprietary CNN and Vision Transformer models analyze pixel-level spectral hues, surface moisture distribution, skin compression patterns, and micro-spotting against a dataset of over 2 million verified agricultural samples.',
    },
    {
      question: 'Can this integrate with standard IoT cold chain sensors?',
      answer: 'Yes! The platform exposes a RESTful FastAPI gateway and MQTT telemetry endpoints to sync live temperature, humidity, and airflow data directly into our real-time prediction model.',
    },
    {
      question: 'Which roles are supported in the enterprise platform?',
      answer: 'We provide custom interfaces for Consumers, Retail Managers, Warehouse Operators, Quality Inspectors, and System Administrators with role-based access control (RBAC).',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 overflow-hidden">
      {/* Top Floating Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#07111f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
            AI Food Freshness
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <GlassButton variant="outline" size="sm">Log In</GlassButton>
          </Link>
          <Link to="/signup">
            <GlassButton variant="primary" size="sm" icon={Zap}>Start Free Trial</GlassButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Enterprise Freshness AI 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Monitor Food Freshness using{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Empower your supply chain, retail hubs, and cold storage warehouses with instant computer-vision freshness scoring, IoT telemetry, and predictive shelf-life modeling.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/dashboard">
                <GlassButton variant="primary" size="lg" icon={ArrowRight}>
                  Start Monitoring
                </GlassButton>
              </Link>
              <Link to="/analysis">
                <GlassButton variant="outline" size="lg" icon={Camera}>
                  Explore AI Scanner
                </GlassButton>
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-400 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>FastAPI Backend Ready</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5 Role Dashboard Profiles</span>
              </div>
            </div>
          </div>

          {/* Right Floating Interactive AI Graphic Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <GlassCard className="!p-8 border-emerald-500/30 bg-white/[0.06] shadow-2xl relative overflow-hidden">
                {/* Laser Scan Bar Animation */}
                <div className="absolute inset-x-0 h-1 laser-scan-line animate-scan top-0 z-20 pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Live AI Scanner Simulation
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    BATCH-2026-089
                  </span>
                </div>

                {/* Simulated Scanned Fruit Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"
                    alt="Organic Bananas"
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Bounding Box Indicator */}
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-xl flex items-start justify-end p-2">
                    <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      Confidence 98.4%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Freshness Score</span>
                    <span className="text-2xl font-extrabold text-emerald-400">92%</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Est. Shelf Life</span>
                    <span className="text-2xl font-extrabold text-cyan-400">5 Days</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="text-center p-6 hover:border-white/20">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Enterprise Feature Suite
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Integrated artificial intelligence and telemetry tools designed for food safety compliance and waste reduction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} className="p-8 hover:border-emerald-500/40">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400">Everything you need to know about setting up the platform.</p>
        </div>
        <Accordion items={faqItems} />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
