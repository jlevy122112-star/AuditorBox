import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm tracking-tighter">AB</div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">AuditorBox</span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/pricing" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Pricing Matrix</a>
          <a href="/dashboard" className="text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all">Console</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          ⚡ Now In Active Deployment
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Automated Vision Forensics For Construction Logistics
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Eliminate capital leaks from material overcharges, delivery variances, and contract price discrepancies instantly via secure mobile text pipelines.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/pricing" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.98]">
            Initialize Free Core Audit
          </a>
          <a href="/dashboard" className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl transition-all active:scale-[0.98]">
            Review Enterprise Ledger
          </a>
        </div>

        <section className="pt-24 grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold mb-4">📸</div>
            <h3 className="text-lg font-bold text-slate-100 mb-1.5">SMS Receipt Ingestion</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Foremen text standard photos of bills-of-lading straight from the field. No complex apps or downloads required.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold mb-4">🤖</div>
            <h3 className="text-lg font-bold text-slate-100 mb-1.5">Vision-AI Cross Check</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our neural engine extracts line items and instantly cross-references them against your master database contract rates.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold mb-4">🛑</div>
            <h3 className="text-lg font-bold text-slate-100 mb-1.5">Instant Leak Protection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Automatically detects structural variances, compiles instant email disputes, and tracks cash clawbacks dynamically.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
