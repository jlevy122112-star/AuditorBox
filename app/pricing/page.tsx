import React from 'react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      <main className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center">
        <div className="text-center max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            Transparent Tier Matrix
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Stop Bleeding Capital on Material Overcharges
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Deploy automated vision forensics across your active jobsites. Choose the scale that matches your active project queue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:-translate-y-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Growth Suite</h3>
                <p className="text-slate-400 text-sm mt-1">Perfect for regional contractors managing concurrent developments.</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">$199</span>
                <span className="text-slate-500 text-sm font-medium">/ month</span>
              </div>
              <hr className="border-slate-800" />
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Up to 5 Active Project Workspaces
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Cryptographic Twilio SMS Intake Gateways
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Automated PDF & JPEG Invoice Audits
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  ✕ Dedicated Enterprise API Webhooks
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 active:scale-[0.98]">
              Deploy Workspace Tier
            </button>
          </div>

          <div className="relative bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest">
              Most Selected Plan
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Enterprise Core</h3>
                <p className="text-emerald-400/80 text-sm mt-1">Unlimited analytical tracking for high-volume operations.</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">$499</span>
                <span className="text-slate-500 text-sm font-medium">/ month</span>
              </div>
              <hr className="border-slate-800" />
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-center gap-3 text-white font-medium">
                  <span className="text-emerald-400 font-bold">✓</span> Unlimited Active Project Workspaces
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Multi-Tenant Foreman Authorization Nodes
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Automated Real-Time Dispute Email Generation
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">✓</span> Priority SLA Processing Infrastructure
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-emerald-500/20">
              Scale Nationally Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
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
