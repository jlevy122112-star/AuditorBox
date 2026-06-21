import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Configure the professional Geist font engine to ensure seamless subpixel rendering for numbers and text metrics
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

// Full SEO metadata injection framework
export const metadata: Metadata = {
  title: "AuditorBox | Automated Vision Forensic Ledger",
  description: "Eliminate capital leaks from material overcharges, delivery variances, and contract price discrepancies instantly via secure mobile text pipelines.",
  applicationName: "AuditorBox",
  authors: [{ name: "AuditorBox Logistics Engineering" }],
  keywords: ["construction ledger", "invoice auditing", "vision AI", "contract forensics", "supply logistics"],
};

// Explicit viewport restrictions to keep the mobile UI rigid and prevent scale-breaking layout errors on phones
export const viewport: Viewport = {
  themeColor: "#020617", // Matches Slate 950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} scroll-smooth`}>
      <body className="bg-slate-950 text-slate-50 antialiased font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
}
