import type { Metadata } from "next";
import EcommerceProfitCalculator from "@/app/components/EcommerceProfitCalculator";

export const metadata: Metadata = {
  title: "حاسبة ربح المتجر الإلكتروني | Ecommerce Profit Calculator",
  description:
    "احسب صافي ربح الطلب، هامش الربح، أقصى CAC، وBreak-even ROAS بعد تكلفة المنتج والشحن والرسوم والخصومات والمرتجعات.",
  alternates: {
    canonical: "/tools/ecommerce-profit-calculator/",
  },
  openGraph: {
    title: "حاسبة ربح المتجر الإلكتروني",
    description:
      "اعرف الربح الحقيقي لكل طلب وأقصى CAC وسعر التعادل قبل زيادة الإنفاق الإعلاني.",
    type: "website",
  },
};

const faq = [
  {
    q: "ما هو CAC في التجارة الإلكترونية؟",
    a: "CAC هنا هو تكلفة الحصول على طلب واحد من الإعلان. ويمكنك استخدامه كقيمة مستقلة لكل طلب لمعرفة تأثير الإعلانات على ربحك.",
  },
  {
    q: "هل ROAS المرتفع يعني أن الطلب مربح؟",
    a: "ليس بالضرورة. ROAS لا يطرح وحده تكلفة المنتج والشحن والرسوم والخصومات والمرتجعات. لذلك قد يكون ROAS جيدًا بينما يكون الربح الفعلي ضعيفًا أو سلبيًا.",
  },
  {
    q: "ما هو Maximum CAC؟",
    a: "هو أعلى تكلفة اكتساب للطلب يمكنك تحملها قبل أن يصل الربح إلى نقطة التعادل، بناءً على الأرقام التي أدخلتها.",
  },
];

export default function EcommerceProfitCalculatorPage() {
  return (
    <main className="page tool-page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <a href="/" className="brand">Business &amp; Money Tools</a>
        <a href="#calculator" className="nav-tool">الحاسبة</a>
      </nav>

      <header className="hero">
        <div className="eyebrow">Ecommerce Profit &amp; Break-even Calculator</div>
        <h1>احسب ربح طلبك الحقيقي قبل أن تزيد الإنفاق الإعلاني</h1>
        <p>
          أدخل سعر البيع والتكلفة والشحن والرسوم والخصم وCAC والمرتجعات،
          وشاهد صافي الربح والهامش وأقصى CAC وBreak-even ROAS وسعر التعادل في ثوانٍ.
        </p>
      </header>

      <div id="calculator">
        <EcommerceProfitCalculator />
      </div>

      <section className="content-grid">
        <article className="content-card">
          <span className="section-kicker">ليه ROAS مش كفاية؟</span>
          <h2>القرار الحقيقي هو ربح الطلب</h2>
          <p>
            ROAS يقيس علاقة الإيراد بالإنفاق الإعلاني، لكنه لا يخبرك وحده بما
            يتبقى بعد تكلفة المنتج والشحن ورسوم الدفع والخصومات والمرتجعات.
            عشان كده الحاسبة تبدأ من اقتصاديات الطلب نفسها.
          </p>
        </article>

        <article className="content-card">
          <span className="section-kicker">استخدمها في قرار سريع</span>
          <h2>كم أقدر أدفع للحصول على طلب؟</h2>
          <p>
            إذا كان Maximum CAC أقل من تكلفة حملتك الحالية، عندك إشارة واضحة
            تحتاج مراجعة سعر البيع أو تكلفة المنتج أو الأداء الإعلاني أو أحد
            بنود التكلفة الأخرى.
          </p>
        </article>
      </section>

      <section className="content-card faq-card">
        <span className="section-kicker">الأسئلة الشائعة</span>
        <h2>أسئلة عن ربح المتجر وCAC وROAS</h2>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>Business &amp; Money Tools Factory</span>
        <a href="/tools/ecommerce-profit-calculator/">Ecommerce Profit Calculator</a>
      </footer>
    </main>
  );
}
