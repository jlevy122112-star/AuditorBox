'use client';

import React, { useState } from 'react';
import DisputeModal from '@/components/DisputeModal';

// Mocked structural matrix reflecting production database lines
const initialReportData = [
  { id: 'rep_01', invoice_name: 'INV-2026-9901_StructuralSteel.pdf', vendor_email: 'sales@midweststeel.com', dispute_email_draft: 'Dear Billing,\n\nOur contract specifies premium structural rebar grid packages at a flat rate of $110/ton. Invoice INV-2026-9901 items show over-indexed billings at $145/ton.\n\nPlease process credit corrections promptly.', status: 'variance_found', saved_amount: 3450.00 },
  { id: 'rep_02', invoice_name: 'CON-8871_ReadyMixConcrete.pdf', vendor_email: 'billing@alliedconcrete.net', dispute_email_draft: 'Attention Accounts Receivable,\n\nWe were overcharged for 4 batches of aggregate mix that arrived outside our delivery window. Requesting standard contract variance adjustments.', status: 'dispute_sent', saved_amount: 1200.00 },
  { id: 'rep_03', invoice_name: 'PLM-3321_CopperPipingValves.pdf', vendor_email: 'distributor@apexplumbing.com', dispute_email_draft: '', status: 'verified', saved_amount: 0.00 }
];

export default function DashboardPage() {
  const [reports, setReports] = useState(initialReportData);
  const [activeFilter, setActiveFilter] = useState<'all' | 'variance_found' | 'dispute_sent'>('all');
  const [selectedReport, setSelectedReport] = useState<typeof initialReportData[0] | null>(null);

  // Growth metric tallies optimized to show gamified value metrics
  const totalRecoveredCash = reports
    .filter(r => r.status === 'dispute_sent')
    .reduce((sum, item) => sum + item.saved_amount, 0);

  const pendingRiskCash = reports
    .filter(r => r.status === 'variance_found')
    .reduce((sum, item) => sum + item.saved_amount, 0);

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-emerald-100">
      
      {/* Primary Context Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-tight text-slate-900">Auditor<span className="text-emerald-500">Box</span></span>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">HQ Control Pane</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border shadow-sm">
          HQ
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {/* Retention Engine: The Visual ROI Gamification Dashboard Scoreboard */}
        <div className="grid sm:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Capital Recovered</span>
            <span className="text-3xl font-black text-slate-900 block tracking-tight">${totalRecoveredCash.toLocaleString()}</span>
            <p className="text-[11px] font-medium text-emerald-600">✓ Hard money clawed back into margins</p>
            <div className="absolute right-3 bottom-2 text-4xl opacity-10 select-none">📈</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Identified Leaks (At Risk)</span>
            <span className="text-3xl font-black text-amber-600 block tracking-tight">${pendingRiskCash.toLocaleString()}</span>
            <p className="text-[11px] font-medium text-slate-500">Action required to secure corrections</p>
            <div className="absolute right-3 bottom-2 text-4xl opacity-10 select-none">⚠️</div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-5 shadow-md space-y-1 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Your Active System ROI</span>
            <span className="text-3xl font-black text-emerald-400 block tracking-tight">
              {totalRecoveredCash > 0 ? `${Math.round((totalRecoveredCash / 149) * 100)}%` : '100% Secure'}
            </span>
            <p className="text-[11px] font-medium text-slate-300">Software spending value yield multi-factor</p>
            <div className="absolute right-3 bottom-2 text-4xl opacity-10 select-none">🛡️</div>
          </div>

        </div>

        {/* Dynamic Navigation/Filtering Sub-Bar Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="bg-slate-200/60 p-1 rounded-xl flex items-center gap-1 border border-slate-200/40">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All Receipts ({reports.length})
            </button>
            <button 
              onClick={() => setActiveFilter('variance_found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'variance_found' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Flagged Overcharges ({reports.filter(r => r.status === 'variance_found').length})
            </button>
            <button 
              onClick={() => setActiveFilter('dispute_sent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'dispute_sent' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Active Disputes Sent
            </button>
          </div>
        </div>

        {/* Core Workspace Interactive Ledger Table Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {filteredReports.length === 0 ? (
            <div className="p-16 text-center max-w-sm mx-auto space-y-2">
              <span className="text-4xl block">📋</span>
              <h5 className="font-bold text-slate-800 text-sm">No ledger logs detected</h5>
              <p className="text-xs text-slate-400">Scan jobsite QR badges or text vendor slips directly into the framework to track margin metrics.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Invoice / Asset Reference Name</th>
                  <th className="px-6 py-3.5">Identified Pricing Leak</th>
                  <th className="px-6 py-3.5">Verification Status</th>
                  <th className="px-6 py-3.5 text-right">Workspace Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 max-w-xs truncate">
                      {report.invoice_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm">
                      {report.saved_amount > 0 ? (
                        <span className={report.status === 'dispute_sent' ? 'text-slate-400 font-mono' : 'text-rose-600 font-mono font-black'}>
                          ${report.saved_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {report.status === 'variance_found' && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Overage Found</span>}
                      {report.status === 'dispute_sent' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Dispute Transmitted</span>}
                      {report.status === 'verified' && <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Verified Match</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.status === 'variance_found' ? (
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
                        >
                          Review & Send Dispute
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] pr-2 font-semibold">Ledger Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* Modal Injection Overlay Gate */}
      {selectedReport && (
        <DisputeModal 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSuccess={() => {
            // Optimistically update local view configurations to keep interaction velocity instantaneous
            setReports(prev => prev.map(item => 
              item.id === selectedReport.id ? { ...item, status: 'dispute_sent' } : item
            ));
            setSelectedReport(null);
          }}
        />
      )}

    </div>
  );
}
  const [uploading, setUploading] = useState<boolean>(false);
  
  // Modal tracking states
  const [activeModalReport, setActiveModalReport] = useState<AuditReport | null>(null);
  const [modalEmailInput, setModalEmailInput] = useState<string>('');
  const [modalBodyInput, setModalBodyInput] = useState<string>('');
  const [isSendingDispute, setIsSendingDispute] = useState<boolean>(false);

  // --- Mock Data Hydration on Mount ---
  useEffect(() => {
    const mockProjects: Project[] = [
      { id: 'prj_101', project_name: 'Downtown Medical Center' },
      { id: 'prj_102', project_name: 'Northwest Tech Park' },
    ];
    
    const mockReports: AuditReport[] = [
      {
        id: 'rep_7712',
        created_at: '2026-06-15',
        invoice_name: 'INV-9982_Copper_Supplies.pdf',
        vendor_email: 'billing@apexpiping.com',
        amount_saved: 1420.50,
        status: 'Flagged',
        discrepancy_json: [
          { item_description: '1/2" Copper Pipe', expected_price: 12.00, charged_price: 15.50, variance_loss: 350.00, reason: 'Unit price exceeds agreed contract baseline.' }
        ],
        dispute_email_draft: `To: billing@apexpiping.com\n\nRegarding: Overcharges flagged on INV-9982_Copper_Supplies.pdf\n\nOur system identified billing variances on our current project baseline rates. Specifically, item "1/2\" Copper Pipe" was invoiced at $15.50 rather than our contract rate of $12.00. Please issue a formal credit memo for the variance amount of $350.00.`
      },
      {
        id: 'rep_7713',
        created_at: '2026-06-18',
        invoice_name: 'INV-4410_PVC_Conduit.png',
        vendor_email: 'sales@alliedelectric.com',
        amount_saved: 320.00,
        status: 'Flagged',
        discrepancy_json: [
          { item_description: 'Schedule 40 PVC', expected_price: 4.50, charged_price: 6.10, variance_loss: 320.00, reason: 'Cumulative quantity delivered exceeds project contract cap.' }
        ],
        dispute_email_draft: `To: sales@alliedelectric.com\n\nRegarding: Quantity overage flagged on INV-4410_PVC_Conduit.png\n\nOur contract auditing software identified an overcharge on item "Schedule 40 PVC". The current invoice quantity exceeds the absolute maximum contract allowance specified on our project baseline bid sheet. Please adjust and re-issue a corrected invoice.`
      },
      {
        id: 'rep_7714',
        created_at: '2026-06-20',
        invoice_name: 'INV-8812_Fittings_Bulk.pdf',
        vendor_email: 'accounts@republicsupply.com',
        amount_saved: 0.00,
        status: 'Clean',
        discrepancy_json: [],
        dispute_email_draft: ''
      }
    ];

    setProjects(mockProjects);
    setSelectedProjectId(mockProjects[0].id);
    setReports(mockReports);

    // Calculate aggregated high-retention total value directly from dataset
    const aggregateSavings = mockReports.reduce((acc, curr) => acc + curr.amount_saved, 0);
    setTotalSaved(aggregateSavings);
  }, []);

  // --- Handlers for File Intake Box ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = async (file: File) => {
    setUploading(true);
    // Mimic standard async networking pipeline to server actions
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setUploading(false);
    alert(`File "${file.name}" received successfully. Run API route pipeline.`);
  };

  // --- Handlers for Action Modals ---
  const openDisputeModal = (report: AuditReport) => {
    setActiveModalReport(report);
    setModalEmailInput(report.vendor_email);
    setModalBodyInput(report.dispute_email_draft);
  };

  const closeDisputeModal = () => {
    setActiveModalReport(null);
    setModalEmailInput('');
    setModalBodyInput('');
  };

  const triggerDisputeEmailTransmission = async () => {
    setIsSendingDispute(true);
    // Mimic endpoint execution inside /api/dispute/route.ts
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSendingDispute(false);
    alert(`Dispute successfully transmitted to ${modalEmailInput}`);
    closeDisputeModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100">
      
      {/* 1. Minimalist Top Navigation Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-slate-900">
            Auditor<span className="text-emerald-500">Box</span>
          </span>
          <span className="text-[10px] font-bold tracking-wider bg-slate-100 border border-slate-200 text-slate-500 uppercase px-2 py-0.5 rounded-md">v1.1</span>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>{proj.project_name}</option>
            ))}
          </select>
          <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm select-none">
            OPS
          </div>
        </div>
      </header>

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* 2. The Action Cockpit: Balanced Split Row layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Card: The File Intake Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">Audit Intake System</h3>
              <p className="text-slate-500 text-xs mt-1">Drop current invoices, receipts, or field slips against baseline targets.</p>
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Target Contract Bid Sheet</label>
              <input 
                type="file" 
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer outline-none"
              />
            </div>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-6 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-white'
              }`}
            >
              <label className="w-full h-full text-center flex flex-col items-center justify-center cursor-pointer">
                <span className="text-3xl mb-2 select-none">📥</span>
                <span className="text-slate-700 font-bold text-sm">
                  {uploading ? 'Parsing Structured Data Layers...' : 'Drag & Drop Invoice Assets'}
                </span>
                <span className="text-slate-400 text-xs mt-1">Supports PDF, PNG, JPG files directly</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Right Card: Premium High-Retention ROI Anchor Widget Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">Financial Performance</h3>
              <p className="text-slate-500 text-xs mt-1">Real-time tracking of capital verified and clawed back from supplier billing anomalies.</p>
            </div>
            
            <div className="mt-8 mb-4 z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Saved To Date</span>
              <span className="text-5xl sm:text-6xl font-black text-emerald-500 tracking-tight block mt-1 drop-shadow-sm animate-fade-in">
                ${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 z-10 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>System Health: Operational</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Connected to OpenAI 4o
              </span>
            </div>

            {/* Giant abstract dollar background asset vector to enhance luxury aesthetic value */}
            <div className="absolute right-[-15px] bottom-[-35px] text-slate-100 font-black text-[11rem] leading-none pointer-events-none select-none z-0 font-mono">
              $
            </div>
          </div>

        </div>

        {/* 3. Full-Width Audit Ledger History Data Table Component container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">Audit Tracking Ledger</h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
              {reports.length} Total Records Loaded
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider select-none">
                  <th className="px-6 py-4">Date Processed</th>
                  <th className="px-6 py-4">Document Context Name</th>
                  <th className="px-6 py-4">Audit Status</th>
                  <th className="px-6 py-4 text-right">Recovered Capital</th>
                  <th className="px-6 py-4 text-center">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-normal">{report.created_at}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold max-w-xs truncate">{report.invoice_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        report.status === 'Flagged' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                        report.status === 'Clean' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${
                          report.status === 'Flagged' ? 'bg-rose-500' : report.status === 'Clean' ? 'bg-slate-400' : 'bg-amber-500'
                        }`}></span>
                        {report.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tabular-nums ${report.amount_saved > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {report.amount_saved > 0 ? `+$${report.amount_saved.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {report.status === 'Flagged' ? (
                        <button 
                          onClick={() => openDisputeModal(report)}
                          className="bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-all border border-slate-800"
                        >
                          Review & Send Dispute Email
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 select-none">No Action Required</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 4. Interactive Flow Dispute Resolution Modal Sheet */}
      {activeModalReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col space-y-4">
            
            {/* Modal Navigation Elements */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-lg text-slate-900 tracking-tight">Review Automated Material Dispute</h4>
                <p className="text-slate-400 text-xs">Verify discrepancy notes before executing secure transmission pipelines.</p>
              </div>
              <button 
                onClick={closeDisputeModal}
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Input fields data row */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Supplier Billing Destination Email</label>
                <input 
                  type="email" 
                  value={modalEmailInput}
                  onChange={(e) => setModalEmailInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-emerald-500"
                  placeholder="billing@vendor.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Automated Dispute Message Body Template</label>
                <textarea 
                  rows={8}
                  value={modalBodyInput}
                  onChange={(e) => setModalBodyInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium font-mono text-slate-700 bg-slate-50 outline-none focus:border-emerald-500 leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Modal Bottom Operational Action row */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
              <button 
                onClick={closeDisputeModal}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={triggerDisputeEmailTransmission}
                disabled={isSendingDispute || !modalEmailInput}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSendingDispute ? 'Transmitting Assets...' : '🚀 Send Email Dispute Now'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
