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
    "input,select,textarea{width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border-radius:10px;border:1px solid #37404b;background:#0a0d11;color:#fff}",
    "textarea{min-height:150px;resize:vertical;font:inherit;line-height:1.5}",
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

async function addOrderNote(orderId: string, note: string, type: "public" | "private" = "private") {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");
  const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/order-notes", {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ order_id: orderId, type, note }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("EASY_ORDERS_NOTE_FAILED:" + response.status);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");

  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId) throw new Error("TOKEN_ORDER_MISMATCH");

    const plan = payload.plan;
    if (plan === "LEADS") {
      const body = [
        '<span class="pill">B2B Contact Research · Paid fulfillment</span>',
        "<h1>Submit your B2B research brief</h1>",
        "<p>Order <strong>", escapeHtml(orderId), "</strong>. Submit up to 100 public company URLs and the fields you need. We will use public sources only.</p>",
        '<form method="POST">',
        '<input type="hidden" name="order" value="', escapeHtml(orderId), '">',
        '<input type="hidden" name="token" value="', escapeHtml(token), '">',
        '<input type="hidden" name="leadIntake" value="1">',
        '<div class="grid">',
        '<label class="full">Company websites (one URL per line, up to 100)<textarea name="urls" required placeholder="https://example.com&#10;https://another-company.com"></textarea></label>',
        '<label>Industry / niche<input name="industry" placeholder="e.g. sports academies"></label>',
        '<label>Target geography<input name="geography" placeholder="e.g. UAE, India"></label>',
        '<label class="full">Requested fields<textarea name="fields" placeholder="Company, contact person, public email, phone, address, LinkedIn, source URL"></textarea></label>',
        '<label>Output format<select name="format"><option>CSV</option><option>XLSX</option><option>JSON</option></select></label>',
        '<label>Extra instructions<textarea name="notes" placeholder="Any qualification rules or exclusions"></textarea></label>',
        '<div class="full"><button class="btn" type="submit">Submit research brief</button></div>',
        "</div></form>",
        '<p class="note">Public-source research only. We do not guess contact details or provide private/restricted personal data.</p>',
      ].join("");
      return htmlPage("B2B Research Intake", body);
    }

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

    if (payload.plan === "LEADS" && String(form.get("leadIntake") || "") === "1") {
      const rawUrls = String(form.get("urls") || "");
      const urls = rawUrls.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
      const validUrls = urls.filter((value) => {
        try {
          const parsed = new URL(value);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      });

      if (!validUrls.length) throw new Error("AT_LEAST_ONE_VALID_URL_REQUIRED");
      if (validUrls.length > 100) throw new Error("MAX_100_URLS");

      const brief = {
        type: "B2B_CONTACT_RESEARCH",
        orderId,
        submittedAt: new Date().toISOString(),
        urls: validUrls,
        industry: String(form.get("industry") || "").trim().slice(0, 300),
        geography: String(form.get("geography") || "").trim().slice(0, 300),
        fields: String(form.get("fields") || "").trim().slice(0, 2000),
        format: ["CSV", "XLSX", "JSON"].includes(String(form.get("format") || "").toUpperCase())
          ? String(form.get("format")).toUpperCase()
          : "CSV",
        notes: String(form.get("notes") || "").trim().slice(0, 2000),
      };

      await addOrderNote(orderId, JSON.stringify(brief), "private");

      const body = [
        '<span class="pill">Research brief received</span>',
        "<h1>Your B2B research request is queued</h1>",
        "<p>Order <strong>", escapeHtml(orderId), "</strong> has been captured with ", String(validUrls.length), " target companies.</p>",
        "<p>We will process the request using public sources only and preserve source URLs in the final dataset.</p>",
        '<p class="note">Typical turnaround: up to 48 hours after a complete brief.</p>',
      ].join("");
      return htmlPage("B2B Research Submitted", body);
    }

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
    const body = new Uint8Array(pdf.length);
    body.set(pdf);
    return new Response(body.buffer as ArrayBuffer, {
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
