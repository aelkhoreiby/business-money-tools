import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <span className="brand">Business &amp; Money Tools</span>
        <span className="nav-muted">Arabic-first utility tools</span>
      </nav>

      <section className="hero home-hero">
        <div className="eyebrow">Business &amp; Money Tools Factory</div>
        <h1>أدوات مالية وتجارية تساعدك تاخد قرار أسرع</h1>
        <p>
          نبدأ بأدوات بسيطة ومفيدة للتجارة الإلكترونية، ثم نبني عليها مكتبة
          أدوات متخصصة للأعمال والمال.
        </p>
      </section>

      <section className="tool-index">
        <div className="tool-index-card">
          <span className="tool-status">متاحة الآن</span>
          <h2>حاسبة ربح المتجر الإلكتروني</h2>
          <p>
            احسب صافي الربح والهامش وأقصى CAC وBreak-even ROAS وسعر البيع عند
            التعادل.
          </p>
          <Link href="/tools/ecommerce-profit-calculator/">فتح الحاسبة ←</Link>
        </div>

        <div className="tool-index-card muted-card">
          <span className="tool-status">قريبًا</span>
          <h2>Invoice Generator</h2>
          <p>إنشاء فواتير عربية/إنجليزية بسرعة وبدون تعقيد.</p>
        </div>

        <div className="tool-index-card muted-card">
          <span className="tool-status">لاحقًا</span>
          <h2>Loan Calculator</h2>
          <p>حاسبات مالية أكثر تخصصًا حسب السوق والدولة.</p>
        </div>
      </section>

      <section className="content-card">
        <span className="section-kicker">منهجنا</span>
        <h2>Useful tools first. SEO follows usefulness.</h2>
        <p>
          كل أداة لها وظيفة واضحة وصفحة مستقلة ومحتوى يساعد المستخدم يفهم
          النتيجة. التوسع يأتي من بيانات البحث والاستخدام، وليس من صفحات مولدة
          بلا قيمة.
        </p>
      </section>
    </main>
  );
}
