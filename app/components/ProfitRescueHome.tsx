'use client';

import { useState } from "react";
import Link from "next/link";
import EcommerceProfitCalculator from "./EcommerceProfitCalculator";

type PaidPlan = "RESCUE" | "GUARD" | "PRO";

const copy = {
  ar: {
    nav: ["التشخيص", "كيف يعمل", "الباقات", "لوكلاء الذكاء الاصطناعي"],
    badge: "AI PROFIT INTELLIGENCE • GCC FIRST • GLOBAL READY",
    title1: "متجرك يبيع.",
    title2: "لكن هل يحقق ربحًا فعلًا؟",
    sub: "يحلّل Profit Rescue AI اقتصاديات متجرك، يكشف تسريبات الربح، ويرتّب لك أولويات الإصلاح قبل أن تزيد الإنفاق.",
    cta: "ابدأ الفحص المجاني",
    secondary: "اكتشف كيف يعمل",
    trust: "بدون بطاقة • نتائج فورية • AED / SAR / USD",
    live: "معاينة تشخيص الربحية",
    leak: "تسرّب في الربح",
    leakText: "ROAS يبدو جيدًا، لكن تكلفة اكتساب العميل الحالية تستهلك معظم هامش الربح.",
    action: "أفضل خطوة تالية",
    actionText: "اخفض CAC المستهدف أو ارفع السعر قبل زيادة الميزانية.",
    impact: "+ SAR 2,840 / month",
    freeKicker: "فحص الربحية المجاني",
    freeTitle: "اعرف أرقامك قبل أن تزيد الإنفاق الإعلاني",
    freeText: "حاسبة مجانية تحسب ربح الطلب بعد الخصومات والمرتجعات والشحن والرسوم وتكلفة اكتساب العميل.",
    howKicker: "محرك واحد • مداخل متعددة",
    howTitle: "ابدأ من المشكلة التي تؤلمك — وانتهِ إلى القرار الصحيح",
    howCards: [
      ["01", "Profit Truth", "هل يحقق كل طلب ربحًا؟"],
      ["02", "CAC Rescue", "ما الحد الآمن لتكلفة اكتساب العميل؟"],
      ["03", "RTO Rescue", "كم تخسر بسبب المرتجعات؟"],
      ["04", "AI Visibility", "هل يظهر متجرك عندما يبحث العملاء عبر الذكاء الاصطناعي؟"],
      ["05", "Page Rescue", "لماذا لا تتحول صفحة المنتج إلى مبيعات؟"],
      ["06", "Scale Guard", "هل التوسع يزيد الربح أم يضغط الهامش؟"]
    ],
    doctorKicker: "PROFIT RESCUE AI • طبيب المتجر بالذكاء الاصطناعي",
    doctorTitle: "من الأرقام إلى قرار واضح",
    doctorText: "بدل عشرات الأرقام بلا أولوية، تحصل على ثلاث حركات واضحة: FIX • SCALE • STOP.",
    demoLabel: "مثال توضيحي",
    demoTitle: "تقرير إنقاذ نموذجي",
    demoItems: [
      ["STOP", "Hero Bundle", "− SAR 11.40 / order", "الخصم + الشحن + CAC يتجاوزون الحد الآمن."],
      ["FIX", "AOV", "+ SAR 1,180 / mo", "Bundle أبسط يمكن أن يرفع متوسط قيمة السلة."],
      ["SCALE", "Retargeting", "+ SAR 2,840 / mo", "أقوى إشارة لمساهمة الربح في العينة."]
    ],
    pricingKicker: "ادفع مقابل النتيجة",
    pricingTitle: "اختر مستوى المساعدة المناسب لك",
    pricingText: "ابدأ بفحص مجاني، ثم اختر خدمة واحدة واضحة بدل شراء تعقيد لا تحتاجه.",
    freePlan: "ابدأ مجانًا",
    selectPlan: "اختيار الباقة",
    selectedPlan: "الباقة المختارة",
    popular: "أفضل ترقية أولى",
    bestFor: "مناسبة لـ",
    secure: "متابعة إلى الدفع الآمن",
    secureNote: "ستفتح صفحة الدفع الآمنة في نافذة مستقلة، وتظل قسيمة Profit Rescue AI متاحة هنا.",
    noNeed: "لا تحتاج لاختيار الثلاثة. اختر المستوى الذي يناسب وضع متجرك الآن.",
    planBestFor: {
      RESCUE: "من يريد تشخيصًا واضحًا مرة واحدة.",
      GUARD: "من يريد متابعة مستمرة خلال الشهر.",
      PRO: "من يدير أكثر من متجر أو يحتاج تغطية أوسع."
    },
    plans: [
      ["RESCUE", "$29", "Profit Rescue Report", ["أهم 3 تسريبات في الربح", "خطة إجراءات مرتبة بالأولوية", "تقرير PDF جاهز"]],
      ["GUARD", "$49 / mo", "Profit Guard", ["تنبيهات مستمرة", "Scale Guard", "ملخص أسبوعي بالذكاء الاصطناعي"]],
      ["PRO", "$99 / mo", "Guard Pro", ["دعم متعدد المتاجر", "RTO + AI visibility", "تحليلات وأولوية أعلى"]]
    ],
    funnelFallback: "التجربة الكاملة تبدأ من الفحص المجاني، ثم نوصلك مباشرة للباقة المناسبة.",
    agentsKicker: "لوكلاء الذكاء الاصطناعي",
    agentsTitle: "نفس الذكاء — بصيغة قابلة للتنفيذ آليًا",
    agentsText: "الوكلاء يحتاجون endpoint واضحًا، دفعًا بـx402، وJSON قابلًا للقراءة والتنفيذ.",
    agentsCode: "{\n  \"profit_status\": \"at_risk\",\n  \"max_safe_cac\": 34.20,\n  \"next_move\": \"FIX_PRICE\",\n  \"expected_impact\": 2840,\n  \"currency\": \"SAR\"\n}",
    finalKicker: "متجرك. أرقامك. خطوتك التالية.",
    finalTitle: "دع الـAI يجيب عن السؤال الأصعب:",
    finalAccent: "أين يتسرّب الربح؟",
    finalText: "ابدأ بفحص الربحية المجاني، ثم اختر Rescue Report أو Profit Guard أو Guard Pro بناءً على احتياجك.",
    finalCta: "ابدأ الآن — مجانًا",
    footer: "Profit Rescue AI • AI-powered ecommerce profit intelligence"
  },
  en: {
    nav: ["Diagnostic", "How it works", "Plans", "For AI Agents"],
    badge: "AI PROFIT INTELLIGENCE • GCC FIRST • GLOBAL READY",
    title1: "Your store sells.",
    title2: "But does it actually make money?",
    sub: "Profit Rescue AI analyzes your store economics, finds profit leaks, and ranks what deserves attention before you add more spend.",
    cta: "Run free diagnostic",
    secondary: "See how it works",
    trust: "No card • Instant results • AED / SAR / USD",
    live: "PROFIT DIAGNOSTIC PREVIEW",
    leak: "Profit Leak",
    leakText: "ROAS looks healthy, but current CAC is consuming most of the available contribution profit.",
    action: "NEXT BEST MOVE",
    actionText: "Lower your target CAC or raise price before increasing budget.",
    impact: "+ SAR 2,840 / month",
    freeKicker: "FREE PROFIT CHECK",
    freeTitle: "Know your numbers before you increase ad spend",
    freeText: "A free calculator estimates order profit after discounts, returns, shipping, fees, and customer acquisition cost.",
    howKicker: "ONE ENGINE • MANY ENTRY DOORS",
    howTitle: "Start with the pain you feel — end with the decision you need",
    howCards: [
      ["01", "Profit Truth", "Is every order actually profitable?"],
      ["02", "CAC Rescue", "What is your safe acquisition ceiling?"],
      ["03", "RTO Rescue", "How much margin is lost to returns?"],
      ["04", "AI Visibility", "Does AI surface your store to buyers?"],
      ["05", "Page Rescue", "Why is the product page under-converting?"],
      ["06", "Scale Guard", "Will scaling grow profit or compress margin?"]
    ],
    doctorKicker: "PROFIT RESCUE AI • THE AI STORE DOCTOR",
    doctorTitle: "From numbers to a clear decision",
    doctorText: "Instead of dozens of numbers with no priority, get three clear moves: FIX • SCALE • STOP.",
    demoLabel: "ILLUSTRATIVE OUTPUT",
    demoTitle: "Sample rescue report",
    demoItems: [
      ["STOP", "Hero Bundle", "− SAR 11.40 / order", "Discount + shipping + CAC cross the safe line."],
      ["FIX", "AOV", "+ SAR 1,180 / mo", "A simpler bundle can lift basket value."],
      ["SCALE", "Retargeting", "+ SAR 2,840 / mo", "Strongest contribution-profit signal in the sample."]
    ],
    pricingKicker: "PAY FOR THE OUTCOME",
    pricingTitle: "Choose the level of help you need",
    pricingText: "Start free, then buy one clear outcome instead of a stack of features you do not need.",
    freePlan: "Start free",
    selectPlan: "Select plan",
    selectedPlan: "Selected plan",
    popular: "BEST FIRST UPGRADE",
    bestFor: "Best for",
    secure: "Continue to secure checkout",
    secureNote: "Secure checkout opens in a separate tab, while your Profit Rescue AI funnel stays open here.",
    noNeed: "You do not need all three. Pick the level that fits your store today.",
    planBestFor: {
      RESCUE: "A one-time, decision-ready profit diagnosis.",
      GUARD: "Ongoing protection and monthly monitoring.",
      PRO: "Multi-store operators who need broader coverage."
    },
    plans: [
      ["RESCUE", "$29", "Profit Rescue Report", ["Top 3 profit leaks", "Prioritized action plan", "PDF-ready report"]],
      ["GUARD", "$49 / mo", "Profit Guard", ["Ongoing alerts", "Scale Guard", "Weekly AI briefing"]],
      ["PRO", "$99 / mo", "Guard Pro", ["Multi-store support", "RTO + AI visibility", "Priority intelligence"]]
    ],
    funnelFallback: "Start with the free diagnostic, then continue directly into the package that fits your next move.",
    agentsKicker: "FOR AI AGENTS",
    agentsTitle: "Same intelligence. Machine-readable.",
    agentsText: "Agents need a clear endpoint, x402 payment, and executable JSON — not another dashboard.",
    agentsCode: "{\n  \"profit_status\": \"at_risk\",\n  \"max_safe_cac\": 34.20,\n  \"next_move\": \"FIX_PRICE\",\n  \"expected_impact\": 2840,\n  \"currency\": \"SAR\"\n}",
    finalKicker: "YOUR STORE. YOUR NUMBERS. YOUR NEXT MOVE.",
    finalTitle: "Let AI answer the hardest question:",
    finalAccent: "Where is the money leaking?",
    finalText: "Start with the free Profit Check, then choose Rescue Report, Profit Guard, or Guard Pro based on the level of help you actually need.",
    finalCta: "Start free",
    footer: "Profit Rescue AI • AI-powered ecommerce profit intelligence"
  }
} as const;

const planDetails: Record<PaidPlan, {
  badge: string;
  image: string;
}> = {
  RESCUE: { badge: "ONE-TIME", image: "/product-images/profit-rescue-report.svg" },
  GUARD: { badge: "MONTHLY", image: "/product-images/profit-guard.svg" },
  PRO: { badge: "MONTHLY", image: "/product-images/guard-pro.svg" },
};

const checkoutRoutes: Record<PaidPlan, string> = {
  RESCUE: "/api/checkout?plan=RESCUE",
  GUARD: "/api/checkout?plan=GUARD",
  PRO: "/api/checkout?plan=PRO",
};

export default function ProfitRescueHome() {
  const [lang, setLang] = useState<"ar" | "en">("en");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("RESCUE");
  const t = copy[lang];
  const ar = lang === "ar";
  const selected = t.plans.find((plan) => plan[0] === selectedPlan) ?? t.plans[0];

  function choosePlan(plan: PaidPlan) {
    setSelectedPlan(plan);
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "select_offer", {
        item_id: plan,
        item_name: plan,
      });
    }
  }

  function beginCheckout() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        item_id: selectedPlan,
        item_name: selected[2],
        value: Number.parseFloat(selected[1].replace(/[^0-9.]/g, "")) || 0,
      });
    }
  }

  return (
    <main className={"nova-site " + (ar ? "is-ar" : "is-en")} dir={ar ? "rtl" : "ltr"}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />

      <header className="nova-nav">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">PR</span>
          <span><strong>Profit Rescue</strong><em>AI</em></span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <a href="#diagnostic">{t.nav[0]}</a>
          <a href="#how">{t.nav[1]}</a>
          <a href="#pricing">{t.nav[2]}</a>
          <a href="#agents">{t.nav[3]}</a>
        </nav>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-navigation"
          aria-label={ar ? "فتح قائمة التنقل" : "Open navigation"}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-actions">
          <a className="nav-cta" href="#diagnostic">{ar ? "الفحص المجاني" : "Free scan"}</a>
          <button className="lang-toggle" onClick={() => setLang(ar ? "en" : "ar")}>
            {ar ? "EN" : "عربي"}
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={"mobile-nav " + (mobileNavOpen ? "open" : "")}
          aria-label={ar ? "التنقل" : "Mobile navigation"}
        >
          <a href="#diagnostic" onClick={() => setMobileNavOpen(false)}>{t.nav[0]}</a>
          <a href="#how" onClick={() => setMobileNavOpen(false)}>{t.nav[1]}</a>
          <a href="#pricing" onClick={() => setMobileNavOpen(false)}>{t.nav[2]}</a>
          <a href="#agents" onClick={() => setMobileNavOpen(false)}>{t.nav[3]}</a>
        </nav>
      </header>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow-pill"><i />{t.badge}</span>
          <div className="hero-brand-nameplate" aria-label="Profit Rescue AI">
            <span className="hero-brand-mark">PR</span>
            <span><strong>Profit Rescue AI</strong><small>PROFIT INTELLIGENCE FOR ECOMMERCE</small></span>
          </div>
          <h1>{t.title1}<br /><span className="gradient-text">{t.title2}</span></h1>
          <p className="hero-sub">{t.sub}</p>

          <div className="hero-actions">
            <a className="primary-btn" href="#diagnostic">{t.cta}<span>↗</span></a>
            <a className="ghost-btn" href="#how">{t.secondary}</a>
          </div>

          <div className="trust-line">
            <span>✦ {t.trust}</span>
            <span className="secure-chip">● ENGINE PREVIEW</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-brand-art">
            <img src="/brand/profit-rescue-ai-brand-hero.png" alt="Profit Rescue AI brand mark" />
          </div>
          <div className="scanner-card">
            <div className="scanner-top">
              <div>
                <span className="mini-label">{t.live}</span>
                <strong>Store Health <b>68</b><small>/100</small></strong>
              </div>
              <span className="pulse-dot" />
            </div>

            <div className="health-ring">
              <div className="ring-inner"><strong>68</strong><span>Profit health</span></div>
            </div>

            <div className="signal-grid">
              <div className="signal danger">
                <span>01</span><strong>{t.leak}</strong><em>− 7.4%</em>
                <p>{t.leakText}</p>
              </div>
              <div className="signal action">
                <span>{t.action}</span><strong>{t.impact}</strong>
                <p>{t.actionText}</p>
              </div>
            </div>

            <div className="scan-footer">
              <div><span className="bar-label">CONFIDENCE</span><div className="bar"><i /></div></div>
              <strong>91%</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="diagnostic" className="diagnostic-shell">
        <div className="section-intro">
          <span className="section-kicker">{t.freeKicker}</span>
          <h2>{t.freeTitle}</h2>
          <p>{t.freeText}</p>
        </div>

        <div className="diagnostic-grid">
          <EcommerceProfitCalculator ar={ar} />
          <aside className="doctor-card">
            <div className="doctor-orbit" />
            <span className="section-kicker">{t.doctorKicker}</span>
            <h3>{t.doctorTitle}</h3>
            <p>{t.doctorText}</p>
            <div className="doctor-demo">
              <div className="demo-header"><span>{t.demoLabel}</span><b>AI</b></div>
              <h4>{t.demoTitle}</h4>
              {t.demoItems.map((item) => (
                <div className="demo-row" key={item[0] + item[1]}>
                  <span className={"demo-tag " + item[0].toLowerCase()}>{item[0]}</span>
                  <div><strong>{item[1]}</strong><small>{item[3]}</small></div>
                  <b>{item[2]}</b>
                </div>
              ))}
            </div>
            <span className="example-note">{ar ? "مثال توضيحي — الحساب الحقيقي يبدأ من أرقامك." : "Illustrative example — your numbers replace the sample."}</span>
          </aside>
        </div>
      </section>

      <section id="how" className="how-section">
        <div className="section-intro centered">
          <span className="section-kicker">{t.howKicker}</span>
          <h2>{t.howTitle}</h2>
        </div>
        <div className="door-grid">
          {t.howCards.map((card) => (
            <article className="door-card" key={card[0]}>
              <span className="door-num">{card[0]}</span>
              <div><h3>{card[1]}</h3><p>{card[2]}</p></div>
              <span className="door-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="section-intro centered">
          <span className="section-kicker">{t.pricingKicker}</span>
          <h2>{t.pricingTitle}</h2>
          <p>{t.pricingText}</p>
        </div>

        <div className="pricing-grid funnel-pricing-grid">
          <article className="price-card free-price-card">
            <span className="plan-tag">FREE</span>
            <strong className="plan-price">$0</strong>
            <h3>Profit Check</h3>
            <div className="plan-features">
              <span>✓ True profit / order</span>
              <span>✓ Maximum CAC</span>
              <span>✓ Break-even ROAS</span>
            </div>
            <a className="outline-btn" href="#diagnostic">{t.freePlan}</a>
          </article>

          {t.plans.map((plan) => {
            const planKey = plan[0] as PaidPlan;
            const isSelected = selectedPlan === planKey;
            return (
              <article
                className={"price-card " + (planKey === "RESCUE" ? "featured" : "") + (isSelected ? " is-selected" : "")}
                key={planKey}
              >
                {planKey === "RESCUE" && <span className="popular-ribbon">{t.popular}</span>}
                <span className="plan-tag">{planKey}</span>
                <strong className="plan-price">{plan[1]}</strong>
                <h3>{plan[2]}</h3>
                <div className="plan-features">{plan[3].map((f) => <span key={f}>✓ {f}</span>)}</div>
                <button type="button" className={isSelected ? "primary-btn compact plan-choice" : "outline-btn plan-choice"} onClick={() => choosePlan(planKey)}>
                  {isSelected ? (ar ? "الباقة المختارة" : "Selected") : t.selectPlan}
                </button>
              </article>
            );
          })}
        </div>

        <div className="offer-funnel" aria-live="polite">
          <div className="offer-visual">
            <div className="offer-image-wrap">
              <img src={planDetails[selectedPlan].image} alt="" />
            </div>
          </div>
          <div className="offer-copy">
            <span className="section-kicker">{t.selectedPlan}</span>
            <div className="offer-head">
              <div>
                <span className="plan-tag">{selectedPlan}</span>
                <strong>{selected[1]}</strong>
              </div>
              <span className="offer-badge">{planDetails[selectedPlan].badge}</span>
            </div>
            <h3>{selected[2]}</h3>
            <p><strong>{t.bestFor}:</strong> {t.planBestFor[selectedPlan]}</p>
            <div className="offer-features">
              {selected[3].map((f) => <span key={f}>✓ {f}</span>)}
            </div>
            <div className="offer-actions">
              <a href={checkoutRoutes[selectedPlan]} className="primary-btn" target="_blank" rel="noopener noreferrer" onClick={beginCheckout}>
                {t.secure}<span>↗</span>
              </a>
              <span>{t.secureNote}</span>
            </div>
            <p className="offer-note">{t.noNeed}</p>
          </div>
        </div>
      </section>

      <section id="b2b-data" className="pricing-section">
        <div className="section-intro centered">
          <span className="section-kicker">B2B DATA OPERATIONS</span>
          <h2>Need a usable B2B contact dataset?</h2>
          <p>One fixed-scope service: give us up to 100 company websites, and receive a cleaned, source-traceable contact dataset.</p>
        </div>
        <div className="offer-funnel" aria-label="B2B contact research offer">
          <div className="offer-visual">
            <div className="offer-image-wrap">
              <div className="offer-badge">UP TO 100 COMPANIES</div>
              <div style={{fontSize:"clamp(38px,6vw,64px)",fontWeight:900,letterSpacing:"-.05em",lineHeight:1}}>$249</div>
              <div style={{marginTop:"8px",fontSize:"12px",fontWeight:800,letterSpacing:".08em",color:"#a5b4c7"}}>USD · ONE-TIME</div>
              <p style={{marginTop:"18px",color:"#94a3b8",lineHeight:1.7}}>Public-source research, deduplication, and traceable source URLs.</p>
            </div>
          </div>
          <div className="offer-copy">
            <span className="section-kicker">FIXED-SCOPE SERVICE</span>
            <h3>100-Company B2B Contact Research</h3>
            <p>Send up to 100 company websites. We return a clean dataset with public business contacts when available.</p>
            <div className="offer-features">
              <span>✓ Company name + website</span>
              <span>✓ Public email, phone, address, social or LinkedIn when available</span>
              <span>✓ Deduplication + source URL for traceability</span>
              <span>✓ CSV / JSON delivery</span>
              <span>✓ No guessed or fabricated contact details</span>
              <span>✓ Automated processing starts immediately after a complete brief</span>
            </div>
            <div className="offer-actions">
              <a className="primary-btn" href="/api/checkout?plan=LEADS" id="b2b-home-cta">Start B2B Research — $249 <span>↗</span></a>
              <span>Pay once. Then submit your target list and research brief.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="agents-section">
        <div className="agents-copy">
          <span className="section-kicker">{t.agentsKicker}</span>
          <h2>{t.agentsTitle}</h2>
          <p>{t.agentsText}</p>
          <div className="agent-chips"><span>x402</span><span>USDC</span><span>JSON</span><span>API</span></div>
        </div>
        <pre className="json-card"><code>{t.agentsCode}</code></pre>
      </section>

      <section className="final-cta">
        <span className="section-kicker">{t.finalKicker}</span>
        <h2>{t.finalTitle}<br /><span>{t.finalAccent}</span></h2>
        <p>{t.finalText}</p>
        <a className="primary-btn" href="#diagnostic">{t.finalCta}<span>↗</span></a>
      </section>

      <footer className="nova-footer">
        <a href="/" className="footer-brand-lockup" aria-label="Profit Rescue AI home">
          <span className="footer-brand-mark">PR</span>
          <span><strong>Profit Rescue AI</strong><small>{t.footer}</small></span>
        </a>
        <div className="footer-meta">
          <a href="/">Home</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <span>© 2026 Profit Rescue AI</span>
        </div>
      </footer>
    </main>
  );
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
