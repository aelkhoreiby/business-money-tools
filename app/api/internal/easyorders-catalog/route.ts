import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!key) {
    return NextResponse.json({ ok: false, error: "EASY_ORDERS_API_KEY_NOT_CONFIGURED" }, { status: 503 });
  }

  const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/products", {
    headers: { "Api-Key": key, Accept: "application/json" },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "EASY_ORDERS_API_" + response.status }, { status: 502 });
  }

  const items = Array.isArray(body) ? body : (body?.products ?? body?.data ?? body?.results ?? []);
  const products = items.map((p: any) => ({
    id: p?.id ?? null,
    name: p?.name ?? null,
    slug: p?.slug ?? null,
    sku: p?.sku ?? null,
    price: p?.price ?? null,
    sale_price: p?.sale_price ?? null,
    hidden: p?.hidden ?? null,
    is_digital: p?.is_digital ?? null,
    product_type: p?.product_type ?? null,
    type: p?.type ?? null,
  }));

  return NextResponse.json({ ok: true, count: products.length, products });
}
