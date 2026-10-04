import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Business &amp; Money Tools</span>
      <span>
        <Link href="/about/">About</Link> · <Link href="/privacy/">Privacy</Link> · <Link href="/terms/">Terms</Link>
      </span>
    </footer>
  );
}
