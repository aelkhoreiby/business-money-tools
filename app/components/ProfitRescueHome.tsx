'use client';

import { useState } from "react";
import Link from "next/link";
import EcommerceProfitCalculator from "./EcommerceProfitCalculator";

type PaidPlan = "AUDIT" | "INTEL" | "PROSPECTS";

const copy = {
  en: {
    nav: ["Diagnostic", "What you get", "Big Tickets", "For AI Agents"],
    badge: "PROFIT RESCUE AI • DECISION INTELLIGENCE",
    title1: "Stop selling small fixes.",
    title2: "Sell decision-ready intelligence.",
    sub: "Three high-value offers built around real business problems: AI visibility and revenue leaks, multi-source intelligence, and B2B prospect intelligence.",
    cta: "See the 3 Big Tickets",
    secondary: "Run free diagnostic",
    trust: "One-time delivery • Source-backed • Public-data first",
    freeKicker: "FREE ENTRY POINT",
    freeTitle: "Use the calculator to surface the pain.",
    freeText: "The free Profit Check identifies order-level economics. When the problem is bigger than a calculator, move the buyer into one of the three Big Tickets.",
    whatKicker: "ONE ENGINE • THREE HIGH-VALUE OUTCOMES",
    whatTitle: "Each ticket owns a business problem.",
    whatText: "No feature bundles. No fake recurring plan. Each purchase maps to a concrete research or intelligence deliverable.",
    pricingKicker: "THE BIG TICKETS",
    pricingTitle: "Three offers. Three price points.",
    pricingText: "The site now sells only these three paid offers.",
    select: "Start secure checkout",
    selected: "Selected",
    bestFor: "Best for",
    auditBest: "Operators who need to know why AI visibility, conversion, or revenue is leaking.",
    intelBest: "Teams that need structured multi-source business data for a decision, market map, or workflow.",
    prospectsBest: "Sales teams that need a source-backed target-account and contact intelligence pack.",
    planDescriptions: {
      AUDIT: "AI Visibility & Revenue Leak Audit",
      INTEL: "Multi-Source Business Intelligence / Data Extraction",
      PROSPECTS: "B2B Prospect Intelligence Pack",
    },
    planFeatures: {
      AUDIT: ["Website + AI visibility assessment", "Revenue / conversion leak analysis", "Prioritized executive action plan", "Client-ready evidence PDF"],
      INTEL: ["Multi-source public web research", "Structured extraction + normalization", "Company / competitor intelligence", "CSV/JSON decision dataset + brief"],
      PROSPECTS: ["Target-account research", "Public contact + company enrichment", "Source-backed fit signals", "Outreach-ready CSV/JSON pack"],
    },
    agentsKicker: "FOR AI AGENTS",
    agentsTitle: "Human-readable offer. Machine-readable execution.",
    agentsText: "NOVA already exposes the underlying research and extraction capabilities as structured services. The Big Tickets package those primitives into a higher-value business outcome.",
    finalTitle: "Three Big Tickets. Nothing else.",
    finalText: "Use the free calculator as the entry point. Sell only the $499, $999, or $1,499 outcome.",
    finalCta: "View Big Tickets",
    footer: "Profit Rescue AI • Decision intelligence for operators"
  },
  ar: {
    nav: ["التشخيص", "المخرجات", "الباقات", "لوكلاء الذكاء الاصطناعي"],
    badge: "PROFIT RESCUE AI • ذكاء القرار",
    title1: "نوقف بيع الحلول الصغيرة.",
    title2: "ونبيع ذكاء جاهزًا للقرار.",
    sub: "ثلاث خدمات High-Ticket فقط: كشف مشاكل الظهور بالـAI وتسريب الإيراد، Business Intelligence واستخراج البيانات، وB2B Prospect Intelligence.",
    cta: "شاهد الباقات الثلاث",
    secondary: "ابدأ الفحص المجاني",
    trust: "شراء مرة واحدة • بيانات بمصادر • Public-data first",
    freeKicker: "مدخل مجاني",
    freeTitle: "استخدم الحاسبة لإظهار المشكلة.",
    freeText: "Profit Check تكشف اقتصاديات الطلب. عندما تكون المشكلة أكبر من حاسبة، ننقل العميل إلى واحدة من الباقات الثلاث.",
    whatKicker: "محرك واحد • ثلاث نتائج عالية القيمة",
    whatTitle: "كل باقة تملك مشكلة تجارية واضحة.",
    whatText: "لا تجميع Features. لا اشتراكات وهمية. كل شراء مرتبط بمخرج بحث أو Intelligence محدد.",
    pricingKicker: "الباقات الكبيرة",
    pricingTitle: "3 عروض فقط.",
    pricingText: "الموقع يبيع هذه العروض الثلاثة فقط كمدفوعات عالية القيمة.",
    select: "ابدأ الدفع الآمن",
    selected: "المختارة",
    bestFor: "مناسبة لـ",
    auditBest: "أصحاب المتاجر والفرق الذين يريدون معرفة أين يتسرب الظهور أو التحويل أو الإيراد.",
    intelBest: "الفرق التي تحتاج بيانات Business Intelligence متعددة المصادر لاتخاذ قرار أو بناء خريطة سوق.",
    prospectsBest: "فرق المبيعات التي تحتاج Target Accounts وبيانات تواصل ومؤشرات Fit موثقة بالمصادر.",
    planDescriptions: {
      AUDIT: "AI Visibility & Revenue Leak Audit",
      INTEL: "Multi-Source Business Intelligence / Data Extraction",
      PROSPECTS: "B2B Prospect Intelligence Pack",
    },
    planFeatures: {
      AUDIT: ["تقييم الموقع والظهور داخل أنظمة AI", "تحليل تسريبات الإيراد والتحويل", "خطة إجراءات تنفيذية مرتبة", "PDF جاهز للعرض على العميل"],
      INTEL: ["بحث عام متعدد المصادر", "استخراج وتنميط البيانات", "Company / competitor intelligence", "Dataset + brief بصيغة CSV/JSON"],
      PROSPECTS: ["Target-account research", "إثراء بيانات الشركة ووسائل التواصل العامة", "مؤشرات Fit موثقة بالمصادر", "حزمة CSV/JSON جاهزة للمبيعات"],
    },
    agentsKicker: "للوكلاء الذكيين",
    agentsTitle: "عرض مفهوم للإنسان. وتنفيذ منظم للآلة.",
    agentsText: "NOVA لديها بالفعل قدرات البحث والاستخراج كخدمات Structured. هذه الباقات تجمعها في نتيجة تجارية أعلى قيمة.",
    finalTitle: "ثلاث باقات كبيرة. ولا شيء غيرها.",
    finalText: "استخدم الحاسبة المجانية كمدخل، وبيع فقط نتيجة $499 أو $999 أو $1,499.",
    finalCta: "شاهد الباقات",
    footer: "Profit Rescue AI • Decision intelligence for operators"
  }
} as const;

const plans: Array<{
  key: PaidPlan;
  price: string;
  badge: string;
  bestKey: "auditBest" | "intelBest" | "prospectsBest";
  image: string;
}> = [
  { key: "AUDIT", price: "$499", badge: "REVENUE + AI VISIBILITY", bestKey: "auditBest", image: "/product-images/profit-rescue-report.svg" },
  { key: "INTEL", price: "$999", badge: "MULTI-SOURCE DATA", bestKey: "intelBest", image: "/product-images/guard-pro.svg" },
  { key: "PROSPECTS", price: "$1,499", badge: "B2B SALES INTELLIGENCE", bestKey: "prospectsBest", image: "/product-images/profit-guard.svg" },
];

const checkoutRoutes: Record<PaidPlan, string> = {
  AUDIT: "/api/checkout?plan=AUDIT",
  INTEL: "/api/checkout?plan=INTEL",
  PROSPECTS: "/api/checkout?plan=PROSPECTS",
};

export default function ProfitRescueHome() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("AUDIT");
  const t = copy[lang];
  const ar = lang === "ar";
  const selected = plans.find((plan) => plan.key === selectedPlan) ?? plans[0];

  function choosePlan(plan: PaidPlan) {
    setSelectedPlan(plan);
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "select_offer", { item_id: plan, item_name: t.planDescriptions[plan] });
    }
  }

  function beginCheckout() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        item_id: selected.key,
        item_name: t.planDescriptions[selected.key],
        value: Number.parseFloat(selected.price.replace(/[^0-9.]/g, "")) || 0,
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
          {t.nav.map((item, index) => (
            <a key={item} href={index === 0 ? "#diagnostic" : index === 1 ? "#what-you-get" : index === 2 ? "#pricing" : "#agents"}>
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-navigation"
          aria-label={ar ? "فتح قائمة التنقل" : "Open navigation"}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>

        <div className="nav-actions">
          <a className="nav-cta" href="#pricing">{ar ? "الباقات" : "Big Tickets"}</a>
          <button className="lang-toggle" onClick={() => setLang(ar ? "en" : "ar")}>{ar ? "EN" : "عربي"}</button>
        </div>

        <nav id="mobile-navigation" className={"mobile-nav " + (mobileNavOpen ? "open" : "")}>
          {t.nav.map((item, index) => (
            <a
              key={item}
              href={index === 0 ? "#diagnostic" : index === 1 ? "#what-you-get" : index === 2 ? "#pricing" : "#agents"}
              onClick={() => setMobileNavOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow-pill"><i />{t.badge}</span>
          <div className="hero-brand-nameplate" aria-label="Profit Rescue AI">
            <span className="hero-brand-mark">PR</span>
            <span><strong>Profit Rescue AI</strong><small>DECISION INTELLIGENCE</small></span>
          </div>
          <h1>{t.title1}<br /><span className="gradient-text">{t.title2}</span></h1>
          <p className="hero-sub">{t.sub}</p>

          <div className="hero-actions">
            <a className="primary-btn" href="#pricing">{t.cta}<span>↗</span></a>
            <a className="ghost-btn" href="#diagnostic">{t.secondary}</a>
          </div>

          <div className="trust-line">
            <span>✦ {t.trust}</span>
            <span className="secure-chip">● 3 OFFERS ONLY</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-brand-art">
            <img src="/brand/profit-rescue-ai-brand-hero.png" alt="Profit Rescue AI" />
          </div>
          <div className="scanner-card">
            <div className="scanner-top">
              <div>
                <span className="mini-label">BIG TICKET STACK</span>
                <strong>3 <b>OUTCOMES</b><small> ONLY</small></strong>
              </div>
              <span className="pulse-dot" />
            </div>
            <div className="health-ring">
              <div className="ring-inner"><strong>$499</strong><span>entry ticket</span></div>
            </div>
            <div className="signal-grid">
              <div className="signal danger">
                <span>01</span><strong>$499 AUDIT</strong><em>AI + REVENUE</em>
                <p>Find visibility, conversion, and revenue leaks.</p>
              </div>
              <div className="signal action">
                <span>02 / 03</span><strong>$999 → $1,499</strong>
                <p>Build the intelligence layer for data or B2B growth.</p>
              </div>
            </div>
            <div className="scan-footer">
              <div><span className="bar-label">OFFER CLARITY</span><div className="bar"><i /></div></div>
              <strong>3/3</strong>
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
            <span className="section-kicker">ENTRY → TICKET</span>
            <h3>Free signal. Paid decision.</h3>
            <p>The calculator is a lead-in, not a paid offer. The paid layer is now intentionally limited to three Big Tickets.</p>
            <div className="doctor-demo">
              <div className="demo-header"><span>OFFER LADDER</span><b>3</b></div>
              <h4>$499 / $999 / $1,499</h4>
              {plans.map((plan) => (
                <div className="demo-row" key={plan.key}>
                  <span className="demo-tag">{plan.key === "AUDIT" ? "01" : plan.key === "INTEL" ? "02" : "03"}</span>
                  <div><strong>{t.planDescriptions[plan.key]}</strong><small>{t[plan.bestKey]}</small></div>
                  <b>{plan.price}</b>
                </div>
              ))}
            </div>
            <span className="example-note">Scope is explicit; automation follows the purchased brief.</span>
          </aside>
        </div>
      </section>

      <section id="what-you-get" className="how-section">
        <div className="section-intro centered">
          <span className="section-kicker">{t.whatKicker}</span>
          <h2>{t.whatTitle}</h2>
          <p>{t.whatText}</p>
        </div>
        <div className="door-grid">
          {plans.map((plan) => (
            <article className="door-card" key={plan.key}>
              <span className="door-num">{plan.key === "AUDIT" ? "01" : plan.key === "INTEL" ? "02" : "03"}</span>
              <div><h3>{t.planDescriptions[plan.key]}</h3><p>{t[plan.bestKey]}</p></div>
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
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.key;
            return (
              <article className={"price-card " + (isSelected ? "featured" : "")} key={plan.key} onClick={() => choosePlan(plan.key)}>
                <span className="plan-tag">{plan.badge}</span>
                <strong className="plan-price">{plan.price}</strong>
                <span className="secure-chip" style={{ alignSelf: "flex-start", marginTop: 4 }}>ONE-TIME</span>
                <h3>{t.planDescriptions[plan.key]}</h3>
                <div className="plan-features">
                  {t.planFeatures[plan.key].map((feature) => <span key={feature}>✓ {feature}</span>)}
                </div>
                <p className="plan-best-for"><strong>{t.bestFor}:</strong> {t[plan.bestKey]}</p>
                <button className="outline-btn" type="button" onClick={() => choosePlan(plan.key)}>
                  {isSelected ? t.selected + " · " + t.select : t.select}
                </button>
              </article>
            );
          })}
        </div>

        <div className="selected-plan-shell">
          <div>
            <span className="section-kicker">{t.selected}</span>
            <h3>{t.planDescriptions[selected.key]}</h3>
            <p>{selected.price} • ONE-TIME</p>
          </div>
          <a className="primary-btn" href={checkoutRoutes[selected.key]} onClick={beginCheckout}>
            {t.select}<span>↗</span>
          </a>
        </div>
      </section>

      <section id="agents" className="how-section">
        <div className="section-intro centered">
          <span className="section-kicker">{t.agentsKicker}</span>
          <h2>{t.agentsTitle}</h2>
          <p>{t.agentsText}</p>
        </div>
        <div className="doctor-demo" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="demo-header"><span>NOVA SERVICE PRIMITIVES</span><b>JSON</b></div>
          <div className="demo-row"><span className="demo-tag">WEB</span><div><strong>web-research / company-intelligence</strong><small>Source-backed public web evidence</small></div><b>INTEL</b></div>
          <div className="demo-row"><span className="demo-tag">DATA</span><div><strong>url-to-json / data-transform</strong><small>Structured extraction and normalization</small></div><b>INTEL</b></div>
          <div className="demo-row"><span className="demo-tag">B2B</span><div><strong>contact-batch</strong><small>Public business contact extraction</small></div><b>PROSPECTS</b></div>
        </div>
      </section>

      <section className="final-cta">
        <span className="section-kicker">BIG TICKETS ONLY</span>
        <h2>{t.finalTitle}</h2>
        <p>{t.finalText}</p>
        <a className="primary-btn" href="#pricing">{t.finalCta}<span>↗</span></a>
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
