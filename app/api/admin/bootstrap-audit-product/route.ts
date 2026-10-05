import { NextResponse } from "next/server";

const API_URL = "https://api.easy-orders.net/api/v1/external-apps/products";

export async function GET() {
  const apiKey = process.env.EASY_ORDERS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "EASY_ORDERS_API_KEY_MISSING" }, { status: 500 });
  }

  const product = {
    name: "Website SEO + AI Visibility Audit",
    price: 59,
    sale_price: 59,
    description:
      "<p><strong>Website SEO + AI Visibility Audit</strong></p><p>Automated audit covering technical SEO, on-page signals, performance, accessibility, security, AEO and GEO/AI visibility signals. Delivered as a Profit Rescue AI PDF after payment.</p><p>This service provides diagnostic findings and recommendations only and does not guarantee rankings, traffic, conversions or revenue outcomes.</p>",
    slug: "website-seo-ai-visibility-audit",
    sku: "NOVA-AUDIT-SEO-AI-59",
    thumb: "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg",
    images: ["https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg"],
    quantity: 999999,
    track_stock: false,
    disable_orders_for_no_stock: false,
    buy_now_text: "Get My Audit",
    is_reviews_enabled: false,
    is_quantity_hidden: true,
    is_header_hidden: false,
    is_free_shipping: true,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = null;
  try { body = JSON.parse(text); } catch {}

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    product: {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      directUrl: "https://profit-rescue-ai.myeasyorders.com/products/website-seo-ai-visibility-audit",
    },
    easyOrders: body,
  }, { status: response.ok ? 200 : 502 });
}
