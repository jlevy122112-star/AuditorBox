'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function FieldQRPortalPage() {
  const params = useParams();
  const qrRoutingToken = params.qr_routing_token as string;

  // Structural UI and upload states
  const [projectName, setProjectName] = useState<string>('Loading Jobsite Context...');
  const [userId, setUserId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hydrate project mapping values directly via public lookup token bypass on mount
  useEffect(() => {
    async function resolveJobsiteContext() {
      try {
        // Replace with your actual public client configuration read route
        // const res = await fetch(`/api/field/resolve-token?token=${qrRoutingToken}`);
        // const data = await res.json();
        
        // Mocked runtime fallback values for baseline verification
        setProjectName('Downtown Medical Center (Site Tower B)');
        setUserId('usr_premium_01');
        setProjectId('prj_dc_101');
      } catch (err) {
        setErrorMessage('Failed to resolve jobsite validation tokens.');
      }
    }
    if (qrRoutingToken) {
      resolveJobsiteContext();
    }
  }, [qrRoutingToken]);

  const handleCaptureCapturePipeline = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const targetedFile = fileList[0];
    setIsProcessing(true);
    setErrorMessage(null);

    // Transform raw file binary buffers locally to Base64 strings safely
    const fileReader = new FileReader();
    fileReader.readAsDataURL(targetedFile);
    
    fileReader.onload = async () => {
      try {
        const rawResult = fileReader.result as string;
        // Strip out base64 payload data scheme headers (data:image/jpeg;base64,...)
        const base64PayloadString = rawResult.split(',')[1];

        // Execute network dispatch directly into the primary reconciliation route
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            projectId: projectId,
            invoiceName: `Field_QR_Capture_${new Date().toISOString().split('T')[0]}_Unauthenticated.jpeg`,
            invoiceFileBase64: base64PayloadString,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'The matching engine rejected data matrix streams.');
        }

        // Shift view into successful execution state checks
        setIsSuccess(true);
      } catch (err: any) {
        setErrorMessage(err.message || 'Network sync failure. Try capturing asset again.');
      } finally {
        setIsProcessing(false);
      }
    };

    fileReader.onerror = () => {
      setErrorMessage('Local file extraction workflow failure.');
      setIsProcessing(false);
    };
  };

  // 1. Success Screen State Layout Overlay
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 text-white px-6 flex flex-col items-center justify-center text-center space-y-4 antialiased selection:bg-emerald-500/20">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-4xl font-black shadow-lg animate-bounce">
          ✓
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Logged to Office Ledger</h2>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          The invoice or receipt layout has been securely transmitted. AuditorBox is compiling price variances against bid sheet targets now.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          Scan Another Document
        </button>
      </div>
    );
  }

  // 2. Primary Portal Interaction Layout
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12 flex flex-col justify-between font-sans antialiased selection:bg-emerald-500/20">
      
      {/* Top Meta Branding Frame Header info block */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          AuditorBox Field-Node Ingestion Link
        </span>
        <h1 className="text-2xl font-black tracking-tight pt-2 text-white max-w-sm mx-auto leading-tight">
          {projectName}
        </h1>
        <p className="text-slate-400 text-xs max-w-xs mx-auto">
          Instant workspace asset pipeline. Zero user profile logins or passwords required on-site.
        </p>
      </div>

      {/* Center Interactive Core Camera Target Box Area */}
      <div className="my-auto max-w-sm w-full mx-auto">
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs rounded-xl p-3 text-center mb-4 leading-normal animate-pulse">
            ⚠️ {errorMessage}
          </div>
        )}

        <label className={`w-full aspect-square rounded-3xl border-4 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all select-none relative ${
          isProcessing 
            ? 'border-amber-500 bg-amber-500/5 text-amber-400 cursor-wait' 
            : 'border-slate-700 bg-slate-800/40 hover:border-emerald-500 hover:bg-slate-800/80 cursor-pointer active:scale-95'
        }`}>
          {isProcessing ? (
            <div className="space-y-3">
              <div className="text-4xl animate-spin">⏳</div>
              <span className="font-black text-lg tracking-tight block">Uploading Ledger Asset...</span>
              <p className="text-xs text-amber-500/80 font-medium max-w-[220px]">Streaming binary strings safely directly into forensic validation databases.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-6xl filter drop-shadow-md">📸</div>
              <span className="font-black text-xl tracking-tight block text-white pt-2">Snap Packing Slip</span>
              <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-normal">
                Tapping launches smartphone camera capture nodes instantly. Ensure text grid lines are legible.
              </p>
            </div>
          )}
          
          {/* Native hardware-level integration trigger flags */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleCaptureCapturePipeline}
            disabled={isProcessing}
            className="hidden" 
          />
        </label>
      </div>

      {/* Secure footer identity branding metrics blocks */}
      <div className="text-center space-y-1">
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest block">
          SECURE ENCRYPTED NODE CONNECTION
        </span>
        <span className="text-[9px] font-mono text-slate-700 block">
          TOKEN REF: {qrRoutingToken ? qrRoutingToken.substring(0, 18).toUpperCase() : 'UNKNOWN-ROUTING-ID'}...
        </span>
      </div>

    </div>
  );
}
