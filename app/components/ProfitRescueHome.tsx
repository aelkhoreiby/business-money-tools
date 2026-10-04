'use client';

import { useState } from "react";
import Link from "next/link";
import EcommerceProfitCalculator from "./EcommerceProfitCalculator";

const copy = {
  ar: {
    nav: ["التشخيص", "كيف يعمل", "الباقات", "للـAI Agents"],
    badge: "AI PROFIT INTELLIGENCE • GCC FIRST • GLOBAL READY",
    title1: "متجرك بيبيع.",
    title2: "لكن هل بيكسب فعلًا؟",
    sub: "Profit Rescue AI يفحص اقتصاديات متجرك، يكشف أماكن تسريب الربح، ويرتب لك أهم خطوة تستحق التنفيذ أولًا.",
    cta: "ابدأ التشخيص المجاني",
    secondary: "شاهد كيف يعمل",
    trust: "بدون بطاقة • نتائج فورية • AED / SAR / USD",
    live: "LIVE PROFIT DIAGNOSTIC",
    leak: "Profit Leak",
    leakText: "ROAS جيد، لكن CAC الحالي يأكل معظم مساهمة الربح.",
    action: "NEXT BEST MOVE",
    actionText: "خفّض CAC المستهدف أو ارفع السعر قبل زيادة الميزانية.",
    impact: "+ SAR 2,840 / month",
    freeKicker: "FREE PROFIT CHECK",
    freeTitle: "اعرف الحقيقة قبل ما تزود الإعلان",
    freeText: "حاسبتنا المجانية تحسب الربح الحقيقي بعد الخصم والمرتجعات والشحن والرسوم وCAC.",
    howKicker: "ONE ENGINE • MANY ENTRY DOORS",
    howTitle: "أي مشكلة تبدأ منها… نوصل لنفس Store Doctor",
    howCards: [
      ["01", "Profit Truth", "هل كل طلب بيكسب؟"],
      ["02", "CAC Rescue", "أقصى تكلفة اكتساب آمنة؟"],
      ["03", "RTO Rescue", "كام ريال بيضيع في المرتجعات؟"],
      ["04", "AI Visibility", "هل الـAI يذكر متجرك؟"],
      ["05", "Page Rescue", "ليه صفحة المنتج مش بتبيع؟"],
      ["06", "Scale Guard", "هل التوسع هيكسب أم يحرق الهامش؟"]
    ],
    doctorKicker: "THE AI STORE DOCTOR",
    doctorTitle: "من Dashboard إلى قرار",
    doctorText: "بدل 27 رقمًا بدون أولوية، تحصل على ثلاث حركات واضحة: FIX • SCALE • STOP.",
    demoLabel: "DEMO OUTPUT",
    demoTitle: "مثال لتقرير الإنقاذ",
    demoItems: [
      ["STOP", "Hero Bundle", "− SAR 11.40 / order", "خصم + شحن + CAC أعلى من الحد."],
      ["FIX", "AOV", "+ SAR 1,180 / mo", "Bundle بسيط يرفع قيمة السلة."],
      ["SCALE", "Retargeting", "+ SAR 2,840 / mo", "أقوى مساهمة ربحية في العينة."]
    ],
    pricingKicker: "PAY FOR THE OUTCOME",
    pricingTitle: "ابدأ صغيرًا. خلي الربح يثبت نفسه.",
    plans: [
      ["FREE", "$0", "Profit Check", ["True profit / order", "Max CAC", "Break-even ROAS"]],
      ["RESCUE", "$29", "Profit Rescue Report", ["Top 3 profit leaks", "Prioritized action plan", "PDF-ready report"]],
      ["GUARD", "$49 / mo", "Profit Guard", ["Ongoing alerts", "Scale Guard", "Weekly AI briefing"]],
      ["PRO", "$99 / mo", "Guard Pro", ["Multi-store", "RTO + AI visibility", "Priority intelligence"]]
    ],
    agentsKicker: "FOR AI AGENTS",
    agentsTitle: "نفس intelligence… لكن machine-readable",
    agentsText: "Agents لا يحتاجون صفحة. يحتاجون endpoint واضح، دفع x402، وJSON قابل للتنفيذ.",
    agentsCode: "{\n  \"profit_status\": \"at_risk\",\n  \"max_safe_cac\": 34.20,\n  \"next_move\": \"FIX_PRICE\",\n  \"expected_impact\": 2840,\n  \"currency\": \"SAR\"\n}",
    finalKicker: "YOUR STORE. YOUR NUMBERS. YOUR NEXT MOVE.",
    finalTitle: "خلّي الـAI يجيب على السؤال الأصعب:",
    finalAccent: "فين الفلوس اللي بتضيع؟",
    finalText: "ابدأ بالـFree Profit Check، وبعدها قرر هل تحتاج Rescue Report أو Profit Guard.",
    finalCta: "ابدأ الآن — مجانًا",
    footer: "Profit Rescue AI • AI-powered ecommerce profit intelligence"
  },
  en: {
    nav: ["Diagnostic", "How it works", "Plans", "For AI Agents"],
    badge: "AI PROFIT INTELLIGENCE • GCC FIRST • GLOBAL READY",
    title1: "Your store sells.",
    title2: "But does it actually make money?",
    sub: "Profit Rescue AI finds the leaks inside your store economics, ranks the next actions, and tells you what deserves attention first.",
    cta: "Run free diagnostic",
    secondary: "See how it works",
    trust: "No card • Instant results • AED / SAR / USD",
    live: "LIVE PROFIT DIAGNOSTIC",
    leak: "Profit Leak",
    leakText: "ROAS looks healthy, but current CAC is consuming most contribution profit.",
    action: "NEXT BEST MOVE",
    actionText: "Lower your target CAC or raise price before adding spend.",
    impact: "+ SAR 2,840 / month",
    freeKicker: "FREE PROFIT CHECK",
    freeTitle: "Know the truth before you scale ads",
    freeText: "Our free calculator shows real order profit after discounts, returns, shipping, fees and CAC.",
    howKicker: "ONE ENGINE • MANY ENTRY DOORS",
    howTitle: "Start with any pain. End at the same Store Doctor.",
    howCards: [
      ["01", "Profit Truth", "Is every order profitable?"],
      ["02", "CAC Rescue", "What is your safe acquisition ceiling?"],
      ["03", "RTO Rescue", "How much margin is lost to returns?"],
      ["04", "AI Visibility", "Does AI actually mention your store?"],
      ["05", "Page Rescue", "Why is the product page under-converting?"],
      ["06", "Scale Guard", "Will scaling grow profit or burn it?"]
    ],
    doctorKicker: "THE AI STORE DOCTOR",
    doctorTitle: "From dashboard to decision",
    doctorText: "Instead of 27 numbers with no priority, get three clear moves: FIX • SCALE • STOP.",
    demoLabel: "DEMO OUTPUT",
    demoTitle: "Sample rescue report",
    demoItems: [
      ["STOP", "Hero Bundle", "− SAR 11.40 / order", "Discount + shipping + CAC cross the safe line."],
      ["FIX", "AOV", "+ SAR 1,180 / mo", "A simple bundle can lift basket value."],
      ["SCALE", "Retargeting", "+ SAR 2,840 / mo", "Strongest contribution-profit signal in the sample."]
    ],
    pricingKicker: "PAY FOR THE OUTCOME",
    pricingTitle: "Start small. Let profit prove the value.",
    plans: [
      ["FREE", "$0", "Profit Check", ["True profit / order", "Max CAC", "Break-even ROAS"]],
      ["RESCUE", "$29", "Profit Rescue Report", ["Top 3 profit leaks", "Prioritized action plan", "PDF-ready report"]],
      ["GUARD", "$49 / mo", "Profit Guard", ["Ongoing alerts", "Scale Guard", "Weekly AI briefing"]],
      ["PRO", "$99 / mo", "Guard Pro", ["Multi-store", "RTO + AI visibility", "Priority intelligence"]]
    ],
    agentsKicker: "FOR AI AGENTS",
    agentsTitle: "Same intelligence. Machine-readable.",
    agentsText: "Agents do not need a landing page. They need a clear endpoint, x402 payment, and executable JSON.",
    agentsCode: '{" + "
  \"profit_status\": \"at_risk\",\n  \"max_safe_cac\": 34.20,\n  \"next_move\": \"FIX_PRICE\",\n  \"expected_impact\": 2840,\n  \"currency\": \"SAR\"\n}',
    finalKicker: "YOUR STORE. YOUR NUMBERS. YOUR NEXT MOVE.",
    finalTitle: "Let AI answer the hardest question:",
    finalAccent: "Where is the money leaking?",
    finalText: "Start with the free Profit Check, then decide whether you need a Rescue Report or Profit Guard.",
    finalCta: "Start free",
    footer: "Profit Rescue AI • AI-powered ecommerce profit intelligence"
  }
};

export default function ProfitRescueHome() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const t = copy[lang];
  const ar = lang === "ar";

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

        <div className="nav-actions">
          <a className="nav-cta" href="#diagnostic">{ar ? "فحص مجاني" : "Free scan"}</a>
          <button className="lang-toggle" onClick={() => setLang(ar ? "en" : "ar")}>{ar ? "EN" : "عربي"}</button>
        </div>
      </header>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow-pill"><i />{t.badge}</span>
          <h1>{t.title1}<br /><span className="gradient-text">{t.title2}</span></h1>
          <p className="hero-sub">{t.sub}</p>

          <div className="hero-actions">
            <a className="primary-btn" href="#diagnostic">{t.cta}<span>↗</span></a>
            <a className="ghost-btn" href="#how">{t.secondary}</a>
          </div>

          <div className="trust-line">
            <span>✦ {t.trust}</span>
            <span className="secure-chip">● LIVE</span>
          </div>
        </div>

        <div className="hero-visual">
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
          <EcommerceProfitCalculator />
          <aside className="doctor-card">
            <div className="doctor-orbit" />
            <span className="section-kicker">{t.doctorKicker}</span>
            <h3>{t.doctorTitle}</h3>
            <p>{t.doctorText}</p>
            <div className="doctor-demo">
              <div className="demo-header"><span>{t.demoLabel}</span><b>AI</b></div>
              <h4>{t.demoTitle}</h4>
              {t.demoItems.map(function(item) {
                return (
                  <div className="demo-row" key={item[0] + item[1]}>
                    <span className={"demo-tag " + item[0].toLowerCase()}>{item[0]}</span>
                    <div><strong>{item[1]}</strong><small>{item[3]}</small></div>
                    <b>{item[2]}</b>
                  </div>
                );
              })}
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
          {t.howCards.map(function(card) {
            return (
              <article className="door-card" key={card[0]}>
                <span className="door-num">{card[0]}</span>
                <div><h3>{card[1]}</h3><p>{card[2]}</p></div>
                <span className="door-arrow">↗</span>
              </article>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="section-intro centered">
          <span className="section-kicker">{t.pricingKicker}</span>
          <h2>{t.pricingTitle}</h2>
        </div>
        <div className="pricing-grid">
          {t.plans.map(function(plan) {
            return (
              <article className={"price-card " + (plan[0] === "RESCUE" ? "featured" : "")} key={plan[0]}>
                {plan[0] === "RESCUE" && <span className="popular-ribbon">{ar ? "أفضل ترقية أولى" : "Best first upgrade"}</span>}
                <span className="plan-tag">{plan[0]}</span>
                <strong className="plan-price">{plan[1]}</strong>
                <h3>{plan[2]}</h3>
                <div className="plan-features">{plan[3].map(function(f) { return <span key={f}>✓ {f}</span>; })}</div>
                <a href="#diagnostic" className={plan[0] === "RESCUE" ? "primary-btn compact" : "outline-btn"}>{ar ? "ابدأ" : "Start"}</a>
              </article>
            );
          })}
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
        <span>{t.footer}</span>
        <span>© 2026 Profit Rescue AI</span>
      </footer>
    </main>
  );
}
