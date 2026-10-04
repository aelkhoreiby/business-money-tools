import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteFooter from "./components/SiteFooter";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Profit Rescue AI — The Ecommerce Store Doctor",
  description: "AI-powered ecommerce profit intelligence: find profit leaks, protect CAC, diagnose store economics, and know what to fix next.",
  keywords: ["ecommerce profit", "AI ecommerce", "profit calculator", "CAC", "ROAS", "RTO", "Saudi ecommerce", "UAE ecommerce"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/f409a605524bfa9999c706a1/script.js"
          strategy="beforeInteractive"
        />
        <GoogleAnalytics />
        <Analytics />
        {children}
        <div className="page">
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
