import { NextResponse } from "next/server";

const API_URL = "https://api.easy-orders.net/api/v1/external-apps/products";

function extractProducts(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  for (const key of ["data", "products", "results", "items"]) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function safeProduct(p: any) {
  return {
    id: p?.id ?? null,
    name: p?.name ?? null,
    slug: p?.slug ?? null,
    sku: p?.sku ?? null,
    price: p?.price ?? null,
    sale_price: p?.sale_price ?? null,
    store_id: p?.store_id ?? null,
    currency: p?.currency ?? null,
    store_currency: p?.store_currency ?? null,
  };
}

export async function GET() {
  const apiKey = process.env.EASY_ORDERS_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "missing_easyorders_api_key" }, { status: 500 });

  const response = await fetch(API_URL, {
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    cache: "no-store",
  });

  const raw = await response.text();
  let payload: any = null;
  try { payload = JSON.parse(raw); } catch {}

  const products = extractProducts(payload);
  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    topLevelKeys: payload && typeof payload === "object" && !Array.isArray(payload) ? Object.keys(payload) : [],
    count: products.length,
    products: products.slice(0, 20).map(safeProduct),
  }, { status: response.ok ? 200 : response.status });
}
