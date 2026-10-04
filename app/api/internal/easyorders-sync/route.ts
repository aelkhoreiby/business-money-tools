import { NextResponse } from "next/server";

const products = [
  {
    id: "2dad3c98-1475-4db4-8c4e-c7e4b1002346",
    image: "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg",
  },
  {
    id: "c6a184ab-0195-48b7-96bb-5d8ce92ccd2d",
    image: "https://business-money-tools.vercel.app/product-images/profit-guard.svg",
  },
  {
    id: "f94db8d0-16df-4443-9c2b-1a19e81350fc",
    image: "https://business-money-tools.vercel.app/product-images/guard-pro.svg",
  },
] as const;

export async function GET(request: Request) {
  const token = request.headers.get("x-sync-token") || "";
  if (!token || token !== process.env.TEMP_EO_SYNC_TOKEN) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const key = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!key) return NextResponse.json({ ok: false, error: "EASY_ORDERS_API_KEY_NOT_CONFIGURED" }, { status: 503 });

  const results = [];
  for (const product of products) {
    const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/products/" + product.id, {
      method: "PATCH",
      headers: {
        "Api-Key": key,
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hidden: true,
        thumb: product.image,
        images: [product.image],
      }),
      cache: "no-store",
    });

    let data: unknown = null;
    try { data = await response.json(); } catch {}
    results.push({ id: product.id, status: response.status, ok: response.ok, data });
  }

  return NextResponse.json({ ok: results.every((x) => x.ok), results }, { status: results.every((x) => x.ok) ? 200 : 502 });
}
