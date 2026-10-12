import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteFooter from "./components/SiteFooter";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://business-money-tools.vercel.app"),
  title: "Free Ecommerce Profit Calculator | Profit Rescue AI",
  description: "Calculate net profit per order, profit margin, maximum CAC, break-even ROAS, and break-even price with the free ecommerce profit calculator.",
  keywords: [
    "ecommerce profit calculator",
    "profit margin calculator",
    "break-even ROAS calculator",
    "maximum CAC calculator",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free Ecommerce Profit Calculator | Profit Rescue AI",
    description: "Find your real profit per order, maximum CAC, and break-even ROAS before increasing ad spend.",
    url: "https://business-money-tools.vercel.app/",
    siteName: "Profit Rescue AI",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
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
