import React from 'react';
import './globals.css'; // Make sure your Tailwind config imports standard @tailwind directives here

export const metadata = {
  title: 'AuditorBox - Construction Billing Forensic AI',
  description: 'Automated semantic invoice reconciliation and progress billing audit engine for contractors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full text-slate-900 font-sans antialiased selection:bg-emerald-100">
        {children}
      </body>
    </html>
  );
}
