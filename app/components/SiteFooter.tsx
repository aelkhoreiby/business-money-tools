import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Business &amp; Money Tools</span>
      <span>
        <Link href="/about/">عن الموقع</Link> · <Link href="/privacy/">الخصوصية</Link> · <Link href="/terms/">الشروط</Link>
      </span>
    </footer>
  );
}
