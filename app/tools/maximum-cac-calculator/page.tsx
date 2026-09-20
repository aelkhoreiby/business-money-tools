import type { Metadata } from "next";
import EcommerceProfitCalculator from "../../components/EcommerceProfitCalculator";

export const metadata: Metadata = {
  title: "حاسبة أقصى CAC | Maximum CAC Calculator للتجارة الإلكترونية",
  description:
    "احسب أقصى CAC يمكنك دفعه لكل طلب قبل الوصول إلى نقطة التعادل، مع صافي الربح والهامش وROAS التعادل.",
  alternates: { canonical: "/tools/maximum-cac-calculator/" },
};

export default function MaximumCacPage() {
  return (
    <main className="page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <a href="/" className="brand">Business &amp; Money Tools</a>
        <a href="/tools/ecommerce-profit-calculator/" className="nav-tool">حاسبة الربح</a>
      </nav>

      <header className="hero">
        <div className="eyebrow">Maximum CAC Calculator</div>
        <h1>احسب أقصى CAC يستطيع طلبك تحمله</h1>
        <p>
          أدخل اقتصاديات الطلب لمعرفة الحد الأقصى لتكلفة اكتساب العميل قبل أن
          يختفي هامش الربح وتصل إلى نقطة التعادل.
        </p>
      </header>

      <EcommerceProfitCalculator />

      <section className="content-grid">
        <article className="content-card">
          <span className="section-kicker">CAC</span>
          <h2>ما معنى Maximum CAC؟</h2>
          <p>
            هو أعلى مبلغ يمكن إنفاقه للحصول على الطلب مع بقاء الربح عند نقطة
            التعادل وفقًا للمدخلات الحالية.
          </p>
        </article>
        <article className="content-card">
          <span className="section-kicker">قرار إعلاني</span>
          <h2>قارنه بالـ CAC الفعلي</h2>
          <p>
            مقارنة CAC الفعلي بالحد الأقصى تساعدك على اكتشاف ما إذا كان الاقتصاد
            الحالي للطلب يسمح بالتوسع أو يحتاج إلى تحسين في السعر أو التكلفة.
          </p>
        </article>
      </section>
    </main>
  );
}
