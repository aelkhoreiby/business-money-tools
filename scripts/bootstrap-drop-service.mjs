const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
const base = "https://api.easy-orders.net/api/v1/external-apps/products";
const slug = "b2b-contact-research-100-companies";

if (!apiKey) {
  console.log("[easyorders-bootstrap] skipped: EASY_ORDERS_API_KEY not configured");
  process.exit(0);
}

const headers = { "Api-Key": apiKey, Accept: "application/json", "Content-Type": "application/json" };
const list = await fetch(base, { headers, cache: "no-store" });
const listBody = await list.json().catch(() => null);
if (!list.ok) throw new Error(`LIST_FAILED:${list.status}`);
const items = Array.isArray(listBody) ? listBody : (listBody?.products ?? listBody?.data ?? []);
const existing = Array.isArray(items) ? items.find((p) => String(p?.slug || "") === slug) : null;
if (existing) {
  console.log(JSON.stringify({ bootstrap: "existing", id: existing?.id, slug: existing?.slug, name: existing?.name }));
  process.exit(0);
}

const payload = {
  name: "B2B Contact Research - Up to 100 Companies",
  price: 249,
  sale_price: 249,
  description: "<h2>B2B Contact Research - Up to 100 Companies</h2><p>Get a clean, decision-ready company/contact dataset built from public sources.</p><ul><li>Up to 100 company websites per order</li><li>Company name, website, public email, public phone, public address, and public social links when available</li><li>Deduplication and source URL for traceability</li><li>No guessed or fabricated contact details</li><li>Delivery as CSV/XLSX/JSON, depending on the request</li><li>Typical turnaround: up to 48 hours after intake is complete</li></ul><p><strong>Important:</strong> Public-source research only. We do not provide private or restricted personal data.</p>",
  slug,
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
const created = await fetch(base, { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store" });
const createdBody = await created.json().catch(() => null);
if (!created.ok) { console.log(JSON.stringify({ bootstrap: "create_failed", status: created.status, body: createdBody })); process.exit(0); }
const p = createdBody?.data ?? createdBody;
console.log(JSON.stringify({ bootstrap: "created", id: p?.id, slug: p?.slug, name: p?.name, price: p?.price, sale_price: p?.sale_price }));
