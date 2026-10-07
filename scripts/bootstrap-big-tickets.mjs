const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
if (!apiKey) {
  console.log("[easyorders-big-ticket-bootstrap] skipped: EASY_ORDERS_API_KEY not configured");
  process.exit(0);
}

const base = "https://api.easy-orders.net/api/v1/external-apps/products";
const headers = {
  "Api-Key": apiKey,
  Accept: "application/json",
  "Content-Type": "application/json",
};

const targets = [
  {
    key: "AUDIT",
    name: "AI Visibility & Revenue Leak Audit",
    slug: "ai-visibility-revenue-leak-audit",
    sku: "BMT-BIG-AUDIT-499",
    price: 499,
    image: "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg",
  },
  {
    key: "INTEL",
    name: "Multi-Source Business Intelligence / Data Extraction",
    slug: "multi-source-business-intelligence-data-extraction",
    sku: "BMT-BIG-INTEL-999",
    price: 999,
    image: "https://business-money-tools.vercel.app/product-images/guard-pro.svg",
  },
  {
    key: "PROSPECTS",
    name: "B2B Prospect Intelligence Pack",
    slug: "b2b-prospect-intelligence-pack",
    sku: "BMT-BIG-PROSPECTS-1499",
    price: 1499,
    image: "https://business-money-tools.vercel.app/product-images/profit-guard.svg",
  },
];

async function readJson(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("EASY_ORDERS_" + response.status + ":" + JSON.stringify(body).slice(0, 600));
  }
  return body;
}

const listed = await readJson(await fetch(base, { headers, cache: "no-store" }));
const items = Array.isArray(listed) ? listed : (listed?.products ?? listed?.data ?? listed?.results ?? []);

for (const target of targets) {
  const existing = items.find((p) => (
    String(p?.slug || "").toLowerCase() === target.slug ||
    String(p?.sku || "").toLowerCase() === target.sku.toLowerCase() ||
    String(p?.name || "").toLowerCase() === target.name.toLowerCase()
  ));

  const payload = {
    name: target.name,
    price: target.price,
    thumb: target.image,
    images: [target.image],
    sale_price: target.price,
    description: target.key === "AUDIT"
      ? "<h2>AI Visibility & Revenue Leak Audit</h2><p>One-time decision intelligence audit covering website findings, AI visibility signals, revenue leak diagnostics, economics, and a prioritized PDF action plan.</p><p>Results are based on the submitted website and buyer-provided economics. No ranking, traffic, or revenue guarantees.</p>"
      : target.key === "INTEL"
        ? "<h2>Multi-Source Business Intelligence / Data Extraction</h2><p>Structured public-source research and data extraction for up to 100 supplied URLs, with normalized evidence and a usable CSV/JSON output.</p>"
        : "<h2>B2B Prospect Intelligence Pack</h2><p>Target-account research and public-source company/contact enrichment for up to 100 supplied company URLs, with source-backed fit signals and a usable CSV/JSON output.</p><p>Public sources only. No guessed or restricted personal data.</p>",
    slug: target.slug,
    sku: target.sku,
    quantity: 999999,
    track_stock: false,
    disable_orders_for_no_stock: false,
    is_quantity_hidden: true,
    is_reviews_enabled: false,
    is_free_shipping: true,
    buy_now_text: "Start secure checkout",
  };

  if (!existing) {
    const created = await readJson(await fetch(base, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    }));
    const product = created?.data ?? created?.product ?? created;
    console.log(JSON.stringify({
      key: target.key,
      action: "created",
      id: product?.id ?? null,
      name: product?.name ?? null,
      slug: product?.slug ?? null,
      price: product?.price ?? null,
      sale_price: product?.sale_price ?? null,
      is_digital: product?.is_digital ?? null,
    }));
    continue;
  }

  const currentPrice = Number(existing.price);
  const currentSale = existing.sale_price == null ? currentPrice : Number(existing.sale_price);
  const needsUpdate =
    String(existing.name || "") !== target.name ||
    String(existing.slug || "") !== target.slug ||
    String(existing.sku || "") !== target.sku ||
    currentPrice !== target.price ||
    currentSale !== target.price ||
    existing.hidden === true;

  if (!needsUpdate) {
    console.log(JSON.stringify({
      key: target.key,
      action: "unchanged",
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      price: existing.price,
      sale_price: existing.sale_price,
      is_digital: existing.is_digital,
    }));
    continue;
  }

  const updated = await readJson(await fetch(base + "/" + encodeURIComponent(existing.id), {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  }));
  const product = updated?.data ?? updated?.product ?? updated;
  console.log(JSON.stringify({
    key: target.key,
    action: "updated",
    id: product?.id ?? existing.id,
    name: product?.name ?? null,
    slug: product?.slug ?? null,
    price: product?.price ?? null,
    sale_price: product?.sale_price ?? null,
    is_digital: product?.is_digital ?? null,
  }));
}

const legacyProducts = [
  {
    id: "cfc7979d-12ac-4084-8a4e-4ce2f5e92f30",
    name: "Profit Rescue Report",
    price: 29,
    slug: "profit-rescue-report",
    thumb: "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg",
  },
  {
    id: "baa1bde5-51d2-4fe7-8380-8971d611179a",
    name: "Profit Guard - 1 Month",
    price: 49,
    slug: "profit-guard-1-month",
    thumb: "https://business-money-tools.vercel.app/product-images/profit-guard.svg",
  },
  {
    id: "a9281fdc-d153-4c32-83e2-e468e1911e85",
    name: "Guard Pro - 1 Month",
    price: 99,
    slug: "guard-pro-1-month",
    thumb: "https://business-money-tools.vercel.app/product-images/guard-pro.svg",
  },
  {
    id: "d4e7db6c-62d1-44d1-8fcf-db5e626cf019",
    name: "Website SEO + AI Visibility Audit",
    price: 59,
    slug: "website-seo-ai-visibility-audit",
    thumb: "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg",
  },
  {
    id: "55bb7f42-54e4-424e-a703-1f537c4629b7",
    name: "B2B Contact Research - Up to 100 Companies",
    price: 249,
    slug: "b2b-contact-research-100-companies",
    thumb: "https://business-money-tools.vercel.app/product-images/guard-pro.svg",
  },
];

for (const legacy of legacyProducts) {
  try {
    const response = await fetch(base + "/" + encodeURIComponent(legacy.id), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        name: legacy.name,
        price: legacy.price,
        slug: legacy.slug,
        thumb: legacy.thumb,
        images: [legacy.thumb],
        hidden: true,
      }),
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      console.log(JSON.stringify({ action: "legacy-hide-failed", id: legacy.id, status: response.status, body }));
    } else {
      console.log(JSON.stringify({ action: "legacy-hidden", id: legacy.id, hidden: body?.hidden ?? body?.data?.hidden ?? null }));
    }
  } catch (error) {
    console.log(JSON.stringify({ action: "legacy-hide-error", id: legacy.id, error: String(error?.message || error) }));
  }
}
