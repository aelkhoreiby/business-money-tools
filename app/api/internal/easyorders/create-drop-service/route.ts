import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EASY_ORDERS_API = "https://api.easy-orders.net/api/v1/external-apps/products";
const SLUG = "b2b-contact-research-100-companies";

function authorized(req: Request) {
  const expected = String(process.env.EO_DROP_SERVICE_BOOTSTRAP || "").trim();
  return Boolean(expected && req.headers.get("x-bootstrap-secret") === expected);
}

async function eo(path = "") {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");
  const response = await fetch(EASY_ORDERS_API + path, {
    method: "GET",
    headers: { "Api-Key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error("EASY_ORDERS_REQUEST_FAILED:" + response.status);
  return payload?.data ?? payload;
}

async function create() {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");

  const product = {
    name: "B2B Contact Research - Up to 100 Companies",
    price: 249,
    sale_price: 249,
    description: [
      "<h2>B2B Contact Research - Up to 100 Companies</h2>",
      "<p>Get a clean, decision-ready company/contact dataset built from public sources.</p>",
      "<ul>",
      "<li>Up to 100 company websites per order</li>",
      "<li>Company name, website, public email, public phone, public address, and public social links when available</li>",
      "<li>Deduplication and source URL for traceability</li>",
      "<li>No guessed or fabricated contact details</li>",
      "<li>Delivery as CSV/XLSX/JSON, depending on the request</li>",
      "<li>Typical turnaround: up to 48 hours after intake is complete</li>",
      "</ul>",
      "<p><strong>Important:</strong> Public-source research only. We do not provide private or restricted personal data.</p>",
    ].join(""),
    slug: SLUG,
    sku: "PR-AI-B2B-100-249",
    quantity: 999999,
    track_stock: false,
    disable_orders_for_no_stock: false,
    buy_now_text: "Get my B2B lead dataset",
    is_reviews_enabled: false,
    is_quantity_hidden: true,
    is_header_hidden: false,
    is_free_shipping: true,
  };

  const response = await fetch(EASY_ORDERS_API, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(product),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error("EASY_ORDERS_CREATE_PRODUCT_FAILED:" + response.status + ":" + JSON.stringify(payload));
  return payload?.data ?? payload;
}

function slim(p: any) {
  return {
    id: p?.id,
    name: p?.name,
    slug: p?.slug,
    price: p?.price,
    sale_price: p?.sale_price,
    status: p?.status,
    store_id: p?.store_id,
  };
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    const all = await eo();
    const items = Array.isArray(all) ? all : (all?.products ?? all?.data ?? []);
    const existing = Array.isArray(items) ? items.find((p: any) => String(p?.slug || "") === SLUG) : null;
    if (existing) return NextResponse.json({ ok: true, created: false, product: slim(existing) });

    const created = await create();
    return NextResponse.json({ ok: true, created: true, product: slim(created) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error instanceof Error ? error.message : error) }, { status: 502 });
  }
}
