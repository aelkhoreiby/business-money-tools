import { NextRequest } from "next/server";
import { PLAN_INFO, verifyFulfillmentToken } from "../../lib/fulfillment";

export const dynamic = "force-dynamic";
export const maxDuration = 240;

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function page(title: string, body: string) {
  return new Response(
    "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>" + esc(title) + "</title><style>" +
      "body{margin:0;background:#080a0d;color:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,sans-serif}" +
      ".wrap{max-width:860px;margin:0 auto;padding:44px 18px}.card{background:#11151b;border:1px solid #252c35;border-radius:20px;padding:28px;box-shadow:0 14px 50px rgba(0,0,0,.28)}" +
      "h1{margin:0 0 8px;font-size:32px}p{color:#b7c0ca;line-height:1.6}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}" +
      "label{display:block;color:#cbd2da;font-size:14px}input,select,textarea{width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border-radius:10px;border:1px solid #37404b;background:#0a0d11;color:#fff}textarea{min-height:150px;resize:vertical;font:inherit;line-height:1.5}" +
      ".full{grid-column:1/-1}.btn{margin-top:18px;width:100%;padding:14px;border:0;border-radius:12px;background:#fff;color:#07090c;font-weight:800;cursor:pointer}.pill{display:inline-block;padding:5px 9px;border:1px solid #37404b;border-radius:999px;font-size:12px;color:#cbd2da}.note{font-size:13px}.done{border:1px solid #65e7c7;border-radius:14px;padding:16px;color:#d9fff5;background:#0d1b18}" +
      "@media(max-width:620px){.grid{grid-template-columns:1fr}}" +
      "</style></head><body><main class='wrap'><section class='card'>" + body + "</section></main></body></html>",
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

async function addPrivateNote(orderId: string, note: string) {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");
  const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/order-notes", {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ order_id: orderId, type: "private", note }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("EASY_ORDERS_NOTE_FAILED:" + response.status);
}

function fieldsFor(plan: "INTEL" | "PROSPECTS") {
  if (plan === "INTEL") {
    return [
      "<label class='full'>Source URLs — up to 100 public URLs<textarea name='urls' required placeholder='https://example.com\nhttps://another-company.com'></textarea></label>",
      "<label>Business question<input name='question' required placeholder='What decision should this data support?'></label>",
      "<label>Target market / geography<input name='geography' placeholder='e.g. GCC, Egypt, Europe'></label>",
      "<label>Industry / niche<input name='industry' placeholder='e.g. SaaS, logistics, retail'></label>",
      "<label>Output fields<input name='fields' placeholder='company, price, product, category, contact, evidence'></label>",
      "<label>Output format<select name='format'><option>CSV</option><option>JSON</option></select></label>",
      "<label class='full'>Competitor / research focus<textarea name='notes' placeholder='Competitors, pages, pricing, positioning, market questions, exclusions'></textarea></label>",
    ].join("");
  }

  return [
    "<label class='full'>Target-account websites — up to 100 public company URLs<textarea name='urls' required placeholder='https://target-company.com\nhttps://another-target.com'></textarea></label>",
    "<label>ICP / qualification rule<input name='question' required placeholder='What makes an account a good prospect?'></label>",
    "<label>Target market / geography<input name='geography' placeholder='e.g. UAE, Saudi Arabia'></label>",
    "<label>Industry / niche<input name='industry' placeholder='e.g. private education groups'></label>",
    "<label>Desired fields<input name='fields' placeholder='company, email, phone, LinkedIn, address, fit signal, source URL'></label>",
    "<label>Output format<select name='format'><option>CSV</option><option>JSON</option></select></label>",
    "<label class='full'>Sales notes<textarea name='notes' placeholder='Exclusions, account tiers, outreach context, qualification notes'></textarea></label>",
  ].join("");
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");

  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId) throw new Error("TOKEN_ORDER_MISMATCH");
    if (payload.plan === "AUDIT") throw new Error("AUDIT_USES_AUDIT_INTAKE");

    const title = PLAN_INFO[payload.plan].name;
    const body = [
      "<span class='pill'>", esc(title), " · Paid fulfillment</span>",
      "<h1>Submit your delivery brief</h1>",
      "<p>Order <strong>", esc(orderId), "</strong>. We use public sources and the scope you provide. This intake defines the exact dataset/brief to be produced.</p>",
      "<form method='POST'><input type='hidden' name='order' value='", esc(orderId), "'><input type='hidden' name='token' value='", esc(token), "'>",
      "<div class='grid'>", fieldsFor(payload.plan), "<div class='full'><button class='btn' type='submit'>Submit paid brief</button></div></div></form>",
      "<p class='note'>No private/restricted personal data. No fabricated fields. Source-backed output only.</p>"
    ].join("");
    return page(title, body);
  } catch (error) {
    return page("Invalid fulfillment link", "<span class='pill'>Fulfillment link rejected</span><h1>Link unavailable</h1><p>" + esc(error instanceof Error ? error.message : error) + "</p>");
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const orderId = String(form.get("order") || "");
  const token = String(form.get("token") || "");

  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId || payload.plan === "AUDIT") throw new Error("INVALID_BIG_TICKET_TOKEN");

    const rawUrls = String(form.get("urls") || "");
    const urls = [...new Set(rawUrls.split(/\r?\n/).map((value) => value.trim()).filter(Boolean))];
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
      orderId,
      plan: payload.plan,
      submittedAt: new Date().toISOString(),
      urls: validUrls,
      question: String(form.get("question") || "").trim().slice(0, 1000),
      geography: String(form.get("geography") || "").trim().slice(0, 300),
      industry: String(form.get("industry") || "").trim().slice(0, 300),
      fields: String(form.get("fields") || "").trim().slice(0, 2000),
      format: ["CSV", "JSON"].includes(String(form.get("format") || "").toUpperCase()) ? String(form.get("format")).toUpperCase() : "CSV",
      notes: String(form.get("notes") || "").trim().slice(0, 3000)
    };

    await addPrivateNote(orderId, JSON.stringify({ type: "BIG_TICKET_BRIEF_SUBMITTED", ...brief }));

    const body = [
      "<div class='done'><strong>Brief received.</strong><br>Order ", esc(orderId), " is now queued for the purchased ", esc(PLAN_INFO[payload.plan].name), " scope.</div>",
      "<h1>Paid brief submitted</h1>",
      "<p>We captured ", String(validUrls.length), " public source URL", validUrls.length === 1 ? "" : "s", " and your requested scope.</p>",
      "<p class='note'>This confirms intake receipt only; it does not itself prove payment settlement or completion of the final deliverable.</p>"
    ].join("");
    return page("Brief received", body);
  } catch (error) {
    return page("Brief submission failed", "<span class='pill'>Fulfillment error</span><h1>Brief not submitted</h1><p>" + esc(error instanceof Error ? error.message : error) + "</p>");
  }
}
