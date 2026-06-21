import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Optimizing the core font cluster for high-density tabular data layouts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuditorBox | Automated Vision Forensic Ledger",
  description: "Stop capital leaks on material overcharges and delivery variances in real time.",
};

// Guaranteeing that mobile viewports lock scaling to prevent layout breaking on phones
export const viewport: Viewport = {
  themeColor: "#0f172a", // Slate 900
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} scroll-smooth`}>
      <body className="bg-slate-950 text-slate-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
