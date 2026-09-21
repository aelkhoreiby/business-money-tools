import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteFooter from "./components/SiteFooter";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Business & Money Tools",
  description: "Free business and money calculators built for real decisions.",
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
