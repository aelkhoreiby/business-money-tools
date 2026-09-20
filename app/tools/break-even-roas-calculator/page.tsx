import type { Metadata } from "next";
import EcommerceProfitCalculator from "../../components/EcommerceProfitCalculator";

export const metadata: Metadata = {
  title: "حاسبة Break-even ROAS | ROAS التعادل للتجارة الإلكترونية",
  description:
    "احسب ROAS التعادل وأقصى CAC وربح الطلب بعد تكلفة المنتج والشحن والرسوم والخصومات والمرتجعات.",
  alternates: { canonical: "/tools/break-even-roas-calculator/" },
};

const faq = [
  {
    q: "ما هو Break-even ROAS؟",
    a: "هو مستوى العائد على الإنفاق الإعلاني الذي عنده تصل الحملة إلى نقطة التعادل وفقًا لتكاليف الطلب التي أدخلتها.",
  },
  {
    q: "لماذا لا يكفي ROAS وحده؟",
    a: "لأن ROAS يقارن الإيراد بالإنفاق الإعلاني، بينما ربح الطلب يتأثر أيضًا بالمنتج والشحن والرسوم والخصومات والمرتجعات.",
  },
];

export default function BreakEvenRoasPage() {
  return (
    <main className="page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <a href="/" className="brand">Business &amp; Money Tools</a>
        <a href="/tools/ecommerce-profit-calculator/" className="nav-tool">حاسبة الربح</a>
      </nav>

      <header className="hero">
        <div className="eyebrow">Break-even ROAS Calculator</div>
        <h1>حاسبة ROAS التعادل لمتجرك الإلكتروني</h1>
        <p>
          اعرف أقل ROAS تحتاجه لتغطية تكاليف الطلب، ثم قارنه بأقصى CAC وربحك
          الحقيقي بدل الاعتماد على رقم ROAS وحده.
        </p>
      </header>

      <EcommerceProfitCalculator />

      <section className="content-card">
        <span className="section-kicker">الفكرة ببساطة</span>
        <h2>ROAS جيد لا يعني دائمًا طلبًا مربحًا</h2>
        <p>
          إذا تجاهلت تكلفة المنتج أو الشحن أو الرسوم أو المرتجعات، يمكن أن يبدو
          الأداء الإعلاني أفضل من الربحية الفعلية. استخدم الحاسبة كاملةً لتفهم
          نقطة التعادل من اقتصاديات الطلب نفسها.
        </p>
      </section>

      <section className="content-card faq-card">
        <span className="section-kicker">الأسئلة الشائعة</span>
        {faq.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
