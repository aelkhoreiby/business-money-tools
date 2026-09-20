import Link from "next/link";

export const metadata = {
  title: "عن Business & Money Tools",
  description: "تعرف على Business & Money Tools ومنهجنا في بناء أدوات مالية وتجارية مجانية ومفيدة.",
};

export default function AboutPage() {
  return (
    <main className="page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <Link href="/" className="brand">Business &amp; Money Tools</Link>
        <Link href="/tools/ecommerce-profit-calculator/" className="nav-tool">حاسبة ربح المتجر</Link>
      </nav>

      <article className="content-card guide">
        <span className="section-kicker">عن الموقع</span>
        <h1>أدوات عملية للأعمال والمال</h1>
        <p>
          Business &amp; Money Tools هو موقع يركز على أدوات مجانية تساعد أصحاب الأعمال
          وأصحاب المتاجر والمستخدمين على إجراء حسابات عملية بسرعة ووضوح.
        </p>

        <h2>كيف نبني الأدوات؟</h2>
        <p>
          نبدأ من مشكلة واضحة وحساب مفيد، ثم نبني صفحة مستقلة للأداة مع شرح للنتائج
          والافتراضات المستخدمة في الحساب. هدفنا أن تكون الأداة مفهومة وسريعة الاستخدام،
          وليس مجرد صفحة تحتوي على نصوص عامة.
        </p>

        <h2>أداتنا الحالية</h2>
        <p>
          حاسبة ربح المتجر الإلكتروني تساعدك على تقدير صافي الربح والهامش وأقصى CAC
          وBreak-even ROAS وسعر البيع عند التعادل بناءً على التكاليف التي تدخلها.
        </p>
        <Link href="/tools/ecommerce-profit-calculator/" className="guide-cta">استخدم الحاسبة ←</Link>

        <h2>التوسع</h2>
        <p>
          نضيف أدوات جديدة تدريجيًا عندما يكون لها استخدام واضح، مع الحفاظ على تجربة
          عربية بسيطة وإتاحة بنية قابلة للتوسع إلى أدوات ثنائية اللغة.
        </p>
      </article>
    </main>
  );
}
