import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { toast } from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please provide a valid email.');
      return;
    }
    setSubmitted(true);
    toast.success('Password reset link sent.');
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-extrabold text-white">AI Food Freshness</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Receive a secure magic recovery link</p>
        </div>

        <GlassCard className="p-8 border-emerald-500/20">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <GlassButton variant="primary" size="lg" className="w-full">
                Send Recovery Link
              </GlassButton>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-300">
                We sent instructions to <span className="font-semibold text-emerald-400">{email}</span>. Check your inbox.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-400 hover:text-emerald-400 underline"
              >
                Try a different email
              </button>
            </div>
          )}
        </GlassCard>

        <p className="text-center text-xs text-slate-400">
          <Link to="/login" className="inline-flex items-center text-emerald-400 font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
