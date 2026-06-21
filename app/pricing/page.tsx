'use client';

import React, { useState } from 'react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState<string | null>(null);

  const triggerCheckout = async (tierName: string) => {
    setLoading(tierName);
    try {
      // Mock Stripe Session Payload Handlers
      alert(`Stripe Routing Engine: Initializing secure onboarding token stream for [${tierName}] - Billing Mode: [${billingPeriod.toUpperCase()}]`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 px-6 py-20 flex flex-col items-center justify-center font-sans antialiased text-white selection:bg-emerald-500/30">
      
      {/* Retention Header Hooks */}
      <div className="text-center max-w-xl mx-auto space-y-4 mb-8">
        <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          Guaranteed 10x ROI Financial Shield
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
          Choose Your Leak Protection
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          Catch thousands in supplier billing errors on your next delivery run. Scale or pause anytime.
        </p>
      </div>

      {/* High-Retention Billing Toggle Switch (Drives Annual Conversion Rates) */}
      <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center mb-12 shadow-inner">
        <button 
          onClick={() => setBillingPeriod('monthly')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Pay Monthly
        </button>
        <button 
          onClick={() => setBillingPeriod('annual')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Pay Annually <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-tight text-emerald-100">Save 20%</span>
        </button>
      </div>

      {/* Visual Anchoring Architecture Layout Grid */}
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* Tier 1: The Basic Decoy Structure (Frames the Premium Value) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 opacity-85 hover:opacity-100 transition-opacity">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg text-slate-300">Project Auditor</h4>
              <p className="text-slate-500 text-xs mt-1">Perfect for single project subcontractors starting out.</p>
            </div>
            <div className="flex items-baseline gap-1 py-2">
              <span className="text-4xl font-black tracking-tight text-white">
                {billingPeriod === 'annual' ? '$79' : '$99'}
              </span>
              <span className="text-slate-500 text-xs font-semibold">/ month</span>
            </div>
            <ul className="space-y-3 text-xs font-medium text-slate-400 border-t border-slate-800/60 pt-4">
              <li className="flex items-center gap-2"><span className="text-slate-600">✓</span> Max 1 Active Project Pipeline</li>
              <li className="flex items-center gap-2"><span className="text-slate-600">✓</span> 48-Hour Standard OCR Batch Processing</li>
              <li className="flex items-center gap-2 text-slate-600 line-through">⚠️ No Twilio SMS Field Ingestion</li>
              <li className="flex items-center gap-2 text-slate-600 line-through">⚠️ No Automated Dispute Email Logs</li>
            </ul>
          </div>
          <button 
            onClick={() => triggerCheckout('Basic')}
            disabled={loading !== null}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'Basic' ? 'Syncing...' : 'Deploy Single Seat'}
          </button>
        </div>

        {/* Tier 2: The High-Margin Profit Engine (Target Conversion Card) */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-emerald-500/5 backdrop-blur-sm">
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse">
            Most Popular ROI Choice
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-black text-xl text-white tracking-tight">Enterprise Multi-Job Suite</h4>
              <p className="text-slate-400 text-xs mt-1">Unlimited pipelines with instant edge site capture hooks.</p>
            </div>
            <div className="flex items-baseline gap-1 py-2">
              <span className="text-5xl font-black tracking-tight text-white">
                {billingPeriod === 'annual' ? '$119' : '$149'}
              </span>
              <span className="text-slate-400 text-xs font-bold">/ month</span>
            </div>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2 text-white"><span className="text-emerald-400 font-black">✓</span> <strong>Unlimited</strong> Active Managed Projects</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-black">✓</span> Real-Time AI Semantic Variance Cross-Matching</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-black">✓</span> Zero-Auth Jobsite QR Sticker Form Node Portals</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-black">✓</span> Instant Twilio SMS Picture-Text Processing Intake</li>
              <li className="flex items-center gap-2 Pin"><span className="text-emerald-400 font-black">✓</span> 1-Click Automated Vendor Dispute Workspaces</li>
            </ul>
          </div>
          <button 
            onClick={() => triggerCheckout('Premium')}
            disabled={loading !== null}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'Premium' ? 'Processing Core Account...' : 'Protect My Profits Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
