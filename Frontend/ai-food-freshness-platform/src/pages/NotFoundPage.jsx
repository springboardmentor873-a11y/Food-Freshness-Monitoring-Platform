import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 text-center space-y-4 border-rose-500/30">
        <AlertCircle className="w-16 h-16 text-rose-400 mx-auto" />
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested AI platform route does not exist or has been relocated.
        </p>
        <Link to="/dashboard" className="inline-block pt-2">
          <GlassButton variant="primary" size="md" icon={Home}>
            Return to Dashboard
          </GlassButton>
        </Link>
      </GlassCard>
    </div>
  );
};
