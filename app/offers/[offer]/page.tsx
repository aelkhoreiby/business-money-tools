import { notFound } from "next/navigation";

type OfferKey = "audit" | "intel" | "prospects";

const offers: Record<OfferKey, {
  price: string;
  eyebrow: string;
  title: string;
  lead: string;
  fit: string;
  outcomes: string[];
  process: string[];
  cta: string;
  checkout: string;
}> = {
  audit: {
    price: "$499",
    eyebrow: "AI VISIBILITY + REVENUE LEAKS",
    title: "Find the leaks before you spend more on growth.",
    lead: "A decision-ready audit of your website, AI visibility signals, conversion friction, and supplied business economics — delivered as a client-ready PDF.",
    fit: "For operators who need a clear answer on what is hurting visibility, conversion, or economics.",
    outcomes: [
      "AI visibility / AEO / GEO findings",
      "Website and conversion friction findings",
      "Revenue-leak diagnostics from supplied economics",
      "Prioritized actions with evidence and rationale",
      "Executive PDF deliverable",
    ],
    process: [
      "Secure checkout",
      "Paid order is verified",
      "Secure intake collects your website + economics",
      "Audit generation runs against the submitted evidence",
      "PDF deliverable is prepared for customer access",
    ],
    cta: "Start the $499 Audit",
    checkout: "/api/checkout?plan=AUDIT",
  },
  intel: {
    price: "$999",
    eyebrow: "MULTI-SOURCE BUSINESS INTELLIGENCE",
    title: "Turn scattered public information into a usable decision dataset.",
    lead: "Structured multi-source research and data extraction for business decisions, market maps, competitor work, and internal workflows — with source-backed evidence and usable machine-readable output.",
    fit: "For teams that need research executed, normalized, and packaged instead of handed a vague summary.",
    outcomes: [
      "Public web research across submitted sources",
      "URL → structured data extraction",
      "Company / competitor intelligence",
      "Normalized CSV / JSON output",
      "Executive summary / decision brief",
    ],
    process: [
      "Secure checkout",
      "Paid order is verified",
      "Secure intake captures the URLs and research brief",
      "NOVA research + extraction capabilities execute",
      "Structured dataset and executive deliverable are prepared",
    ],
    cta: "Start the $999 Intelligence Pack",
    checkout: "/api/checkout?plan=INTEL",
  },
  prospects: {
    price: "$1,499",
    eyebrow: "B2B PROSPECT INTELLIGENCE",
    title: "Give sales a target-account list they can actually work.",
    lead: "A source-backed prospect intelligence pack built from your ICP, geography, and industry criteria, using public company and contact research capabilities.",
    fit: "For sales teams that need target-account intelligence and public contact enrichment without relying on guessed or restricted personal data.",
    outcomes: [
      "ICP + geography + industry targeting",
      "Target-account research",
      "Public company/contact enrichment",
      "Source-backed fit signals",
      "Usable CSV / JSON prospect pack",
    ],
    process: [
      "Secure checkout",
      "Paid order is verified",
      "Secure intake captures ICP and target criteria",
      "NOVA research and public contact enrichment execute",
      "Source-backed prospect output is prepared for customer access",
    ],
    cta: "Start the $1,499 Prospect Pack",
    checkout: "/api/checkout?plan=PROSPECTS",
  },
};

export function generateStaticParams() {
  return [{ offer: "audit" }, { offer: "intel" }, { offer: "prospects" }];
}

export const dynamicParams = false;

export default async function OfferFunnelPage({ params }: { params: Promise<{ offer: string }> }) {
  const { offer } = await params;
  const data = offers[offer as OfferKey];
  if (!data) notFound();

  return (
    <main className="offer-page">
      <div className="offer-page-glow" />
      <header className="offer-nav">
        <a className="offer-brand" href="/">
          <span className="offer-brand-mark">PR</span>
          <span><strong>Profit Rescue AI</strong><small>Decision Intelligence</small></span>
        </a>
        <a className="offer-nav-link" href="/#pricing">All Big Tickets</a>
      </header>

      <section className="offer-hero">
        <div className="offer-hero-copy">
          <span className="offer-eyebrow">{data.eyebrow}</span>
          <div className="offer-price">{data.price}<span> one-time</span></div>
          <h1>{data.title}</h1>
          <p className="offer-lead">{data.lead}</p>
          <p className="offer-fit"><strong>Best for:</strong> {data.fit}</p>
          <div className="offer-cta-row">
            <a className="offer-primary" href={data.checkout}>{data.cta}<span>↗</span></a>
            <a className="offer-secondary" href="#details">See what is included</a>
          </div>
          <p className="offer-note">No ranking, traffic, or revenue guarantees. Findings and recommendations are based on supplied inputs and available public evidence.</p>
        </div>

        <div className="offer-signal-card">
          <div className="signal-card-top"><span>DELIVERABLE</span><b>{data.price}</b></div>
          <div className="signal-card-ring"><span>BUY</span><strong>{data.price}</strong><small>then secure intake</small></div>
          <div className="signal-card-footer">
            <span>PAID ORDER</span><span>→</span><span>VERIFIED</span><span>→</span><span>EXECUTED</span>
          </div>
        </div>
      </section>

      <section id="details" className="offer-section">
        <div className="offer-section-head">
          <span>WHAT YOU RECEIVE</span>
          <h2>Built around an outcome, not a feature list.</h2>
        </div>
        <div className="offer-grid">
          {data.outcomes.map((item, index) => (
            <article className="offer-item" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-section offer-process">
        <div className="offer-section-head">
          <span>HOW DELIVERY WORKS</span>
          <h2>Payment triggers execution.</h2>
        </div>
        <div className="offer-process-list">
          {data.process.map((step, index) => (
            <div className="offer-process-step" key={step}>
              <span>{index + 1}</span>
              <div><strong>{step}</strong>{index === 1 && <small>Only paid orders are eligible for fulfillment.</small>}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="offer-final">
        <span className="offer-eyebrow">READY TO START</span>
        <h2>{data.title}</h2>
        <p>{data.price} one-time. Secure checkout first, then the verified fulfillment intake.</p>
        <a className="offer-primary" href={data.checkout}>{data.cta}<span>↗</span></a>
      </section>

      <footer className="offer-footer">
        <span>Profit Rescue AI • Three Big Tickets only</span>
        <span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></span>
      </footer>
    </main>
  );
}
