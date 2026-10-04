import { NextRequest } from "next/server";
import {
  buildProfitReportPdf,
  calculateProfitReport,
  PLAN_INFO,
  verifyFulfillmentToken,
  type PlanKey,
} from "../../lib/fulfillment";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function htmlPage(title: string, body: string) {
  const html = [
    "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>", escapeHtml(title), "</title>",
    "<style>",
    "body{margin:0;background:#080a0d;color:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,sans-serif}",
    ".wrap{max-width:760px;margin:0 auto;padding:44px 18px}",
    ".card{background:#11151b;border:1px solid #252c35;border-radius:20px;padding:28px;box-shadow:0 14px 50px rgba(0,0,0,.28)}",
    "h1{margin:0 0 8px;font-size:32px}p{color:#b7c0ca;line-height:1.6}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}",
    "label{display:block;color:#cbd2da;font-size:14px}",
    "input,select{width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border-radius:10px;border:1px solid #37404b;background:#0a0d11;color:#fff}",
    ".full{grid-column:1/-1}.btn{margin-top:18px;width:100%;padding:14px;border:0;border-radius:12px;background:#fff;color:#07090c;font-weight:700;cursor:pointer}",
    ".note{font-size:13px;margin-top:16px}.pill{display:inline-block;padding:5px 9px;border:1px solid #37404b;border-radius:999px;font-size:12px;color:#cbd2da}",
    "@media(max-width:620px){.grid{grid-template-columns:1fr}}",
    "</style></head><body><main class=\"wrap\"><section class=\"card\">",
    body,
    "</section></main></body></html>",
  ].join("");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function number(value: FormDataEntryValue | null) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");

  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId) throw new Error("TOKEN_ORDER_MISMATCH");

    const plan = payload.plan;
    const body = [
      '<span class="pill">', escapeHtml(PLAN_INFO[plan].name), ' • Paid fulfillment</span>',
      "<h1>Build your Profit Rescue report</h1>",
      "<p>Order <strong>", escapeHtml(orderId), "</strong>. Enter the actual economics of one representative order. Your report is calculated from these figures only.</p>",
      '<form method="POST">',
      '<input type="hidden" name="order" value="', escapeHtml(orderId), '">',
      '<input type="hidden" name="token" value="', escapeHtml(token), '">',
      '<div class="grid">',
      '<label>Currency<select name="currency"><option>USD</option><option>AED</option><option>SAR</option></select></label>',
      '<label>Selling price<input name="sellingPrice" type="number" min="0" step="0.01" required></label>',
      '<label>Product cost<input name="productCost" type="number" min="0" step="0.01" required></label>',
      '<label>Shipping<input name="shipping" type="number" min="0" step="0.01" required></label>',
      '<label>Payment / platform fee<input name="paymentFee" type="number" min="0" step="0.01" required></label>',
      '<label>Discount<input name="discount" type="number" min="0" step="0.01" value="0" required></label>',
      '<label>CAC / ad cost per order<input name="cac" type="number" min="0" step="0.01" required></label>',
      '<label>Returns rate %<input name="returnsRate" type="number" min="0" max="100" step="0.01" value="0" required></label>',
      '<div class="full"><button class="btn" type="submit">Generate my verified report</button></div>',
      "</div></form>",
      '<p class="note">No revenue uplift is invented. The PDF is a deterministic diagnostic of the numbers you submit.</p>',
    ].join("");
    return htmlPage("Profit Rescue Intake", body);
  } catch (error) {
    return htmlPage(
      "Invalid fulfillment link",
      [
        '<span class="pill">Fulfillment link rejected</span>',
        "<h1>Link unavailable</h1><p>",
        escapeHtml(String(error instanceof Error ? error.message : error)),
        "</p>",
      ].join("")
    );
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const orderId = String(form.get("order") || "");
  const token = String(form.get("token") || "");

  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId) throw new Error("TOKEN_ORDER_MISMATCH");

    const currencyValue = String(form.get("currency") || "USD");
    const currency =
      currencyValue === "AED" || currencyValue === "SAR" ? currencyValue : "USD";

    const report = calculateProfitReport(
      {
        currency,
        sellingPrice: number(form.get("sellingPrice")),
        productCost: number(form.get("productCost")),
        shipping: number(form.get("shipping")),
        paymentFee: number(form.get("paymentFee")),
        discount: number(form.get("discount")),
        cac: number(form.get("cac")),
        returnsRate: number(form.get("returnsRate")),
      },
      orderId,
      payload.plan as PlanKey
    );

    const pdf = buildProfitReportPdf(report);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="profit-rescue-' + orderId + '.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return htmlPage(
      "Report generation failed",
      [
        '<span class="pill">Fulfillment error</span>',
        "<h1>Report not generated</h1><p>",
        escapeHtml(String(error instanceof Error ? error.message : error)),
        "</p>",
      ].join("")
    );
  }
}
