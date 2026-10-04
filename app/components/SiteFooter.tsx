'use client';

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  // The Profit Rescue AI homepage owns its own branded funnel footer.
  if (pathname === "/") return null;

  return (
    <footer className="site-footer">
      <a href="/" className="site-footer-brand">
        <span className="site-footer-mark">PR</span>
        <span><strong>Profit Rescue AI</strong><small>AI-powered ecommerce profit intelligence</small></span>
      </a>
      <span className="site-footer-links">
        <a href="/">Home</a> · <a href="/about/">About</a> · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a>
      </span>
    </footer>
  );
}
