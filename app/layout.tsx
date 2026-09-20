import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Business & Money Tools",
  description: "Free business and money calculators built for real decisions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <div className="page">
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
