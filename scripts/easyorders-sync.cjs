const products = [
  ["2dad3c98-1475-4db4-8c4e-c7e4b1002346", "Profit Rescue Report", 29, "profit-rescue-report", "https://business-money-tools.vercel.app/product-images/profit-rescue-report.svg"],
  ["c6a184ab-0195-48b7-96bb-5d8ce92ccd2d", "Profit Guard - 1 Month", 49, "profit-guard-1-month", "https://business-money-tools.vercel.app/product-images/profit-guard.svg"],
  ["f94db8d0-16df-4443-9c2b-1a19e81350fc", "Guard Pro - 1 Month", 99, "guard-pro-1-month", "https://business-money-tools.vercel.app/product-images/guard-pro.svg"],
];

const key = String(process.env.EASY_ORDERS_API_KEY || "").trim();
const oneTime = String(process.env.TEMP_EO_SYNC_TOKEN || "").trim();

if (process.env.VERCEL_ENV !== "production" || !key || !oneTime) {
  console.log("[easyorders-sync] skipped");
  process.exit(0);
}

(async () => {
  let failed = false;
  for (const [id, name, price, slug, image] of products) {
    const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/products/" + id, {
      method: "PATCH",
      headers: {
        "Api-Key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        slug,
        hidden: true,
        is_header_hidden: true,
        thumb: image,
        images: [image],
      }),
      cache: "no-store",
    });

    let body = "";
    try { body = await response.text(); } catch {}
    console.log("[easyorders-sync]", id, response.status, response.ok ? "OK" : "FAIL", body.slice(0, 500));
    if (!response.ok) failed = true;
  }

  if (failed) process.exit(1);
  console.log("[easyorders-sync] completed");
})().catch((error) => {
  console.error("[easyorders-sync] fatal", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
