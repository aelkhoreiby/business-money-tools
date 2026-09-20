import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الربح الحقيقي للمتجر مقابل ROAS | دليل التجارة الإلكترونية",
  description:
    "دليل مبسط لفهم الفرق بين ROAS وربح الطلب الحقيقي، وكيف تدخل تكلفة المنتج والشحن والرسوم والمرتجعات وCAC في القرار.",
  alternates: { canonical: "/guides/ecommerce-profit-vs-roas/" },
};

export default function GuidePage() {
  return (
    <main className="page">
      <nav className="top-nav" aria-label="التنقل الرئيسي">
        <a href="/" className="brand">Business &amp; Money Tools</a>
        <a href="/tools/ecommerce-profit-calculator/" className="nav-tool">افتح الحاسبة</a>
      </nav>

      <header className="hero">
        <div className="eyebrow">Ecommerce Profit Guide</div>
        <h1>ROAS ليس هو الربح: كيف تقيس ربح الطلب الحقيقي؟</h1>
        <p>
          ROAS مهم لقياس كفاءة الإنفاق الإعلاني، لكنه لا يصف اقتصاديات الطلب
          كاملة. الربحية تعتمد أيضًا على التكاليف المتغيرة التي تحدث مع كل طلب.
        </p>
      </header>

      <article className="content-card guide">
        <h2>1. ابدأ من الإيراد الذي تحتفظ به</h2>
        <p>
          ابدأ بسعر البيع، ثم اطرح الخصومات وأثر المرتجعات للوصول إلى الإيراد
          الصافي الذي يمكن أن يغطي بقية تكاليف الطلب.
        </p>

        <h2>2. أضف التكاليف المرتبطة بالطلب</h2>
        <p>
          تكلفة المنتج والشحن ورسوم الدفع أو المنصة تقلل المبلغ المتاح لتغطية
          الإعلان وتحقيق الربح.
        </p>

        <h2>3. بعدها افحص CAC وROAS</h2>
        <p>
          بعد معرفة اقتصاديات الطلب، يصبح من الأسهل فهم الحد الأقصى المقبول
          للـCAC وعتبة ROAS التي عندها يصل الطلب إلى التعادل.
        </p>

        <h2>مثال سريع</h2>
        <p>
          إذا كان سعر البيع 100، وتكلفة المنتج والشحن والرسوم 45، فإن المتبقي
          قبل الإعلان هو 55. هذا الرقم هو المساحة التي يمكن أن يتحرك داخلها
          CAC قبل أن يصل الربح إلى الصفر، مع تعديل الحساب عند وجود خصومات أو
          مرتجعات.
        </p>

        <p className="tool-note">
          هذه الصفحة تعليمية وليست نصيحة محاسبية أو مالية. استخدم بياناتك الفعلية
          لنفس الفترة والقناة عند اتخاذ القرار.
        </p>

        <a className="guide-cta" href="/tools/ecommerce-profit-calculator/">
          احسب ربح طلبك الآن ←
        </a>
      </article>
    </main>
  );
}
