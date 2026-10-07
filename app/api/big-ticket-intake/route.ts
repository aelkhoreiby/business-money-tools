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
    "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>" +
      esc(title) +
      "</title><style>" +
      "body{margin:0;background:#080a0d;color:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,sans-serif}.wrap{max-width:860px;margin:0 auto;padding:44px 18px}.card{background:#11151b;border:1px solid #252c35;border-radius:20px;padding:28px;box-shadow:0 14px 50px rgba(0,0,0,.28)}" +
      "h1{margin:0 0 8px;font-size:32px}p{color:#b7c0ca;line-height:1.6}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}label{display:block;color:#cbd2da;font-size:14px}input,select,textarea{width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border-radius:10px;border:1px solid #37404b;background:#0a0d11;color:#fff}textarea{min-height:150px;resize:vertical;font:inherit;line-height:1.5}.full{grid-column:1/-1}.btn{margin-top:18px;width:100%;padding:14px;border:0;border-radius:12px;background:#65e7c7;color:#07090c;font-weight:800;cursor:pointer}.pill{display:inline-block;padding:5px 9px;border:1px solid #37404b;border-radius:999px;font-size:12px;color:#cbd2da}.note{font-size:13px}.done{border:1px solid #65e7c7;border-radius:14px;padding:16px;color:#d9fff5;background:#0d1b18}@media(max-width:620px){.grid{grid-template-columns:1fr}}" +
      "</style></head><body><main class='wrap'><section class='card'>" +
      body +
      "</section></main></body></html>",
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
      "<label class='full'>Source URLs — up to 100 public URLs<textarea name='urls' required placeholder='https://example.com&#10;https://another-company.com'></textarea></label>",
      "<label>Business question<input name='question' required placeholder='What decision should this data support?'></label>",
      "<label>Target market / geography<input name='geography' placeholder='e.g. GCC, Egypt, Europe'></label>",
      "<label>Industry / niche<input name='industry' placeholder='e.g. SaaS, logistics, retail'></label>",
      "<label>Output fields<input name='fields' placeholder='company, price, product, category, contact, evidence'></label>",
      "<label>Output format<select name='format'><option>CSV</option><option>JSON</option></select></label>",
      "<label class='full'>Research focus<textarea name='notes' placeholder='Competitors, pricing, positioning, market questions, exclusions'></textarea></label>",
    ].join("");
  }

  return [
    "<label class='full'>Target-account websites — up to 100 public company URLs<textarea name='urls' required placeholder='https://target-company.com&#10;https://another-target.com'></textarea></label>",
    "<label>ICP / qualification rule<input name='question' required placeholder='What makes an account a good prospect?'></label>",
    "<label>Target market / geography<input name='geography' placeholder='e.g. UAE, Saudi Arabia'></label>",
    "<label>Industry / niche<input name='industry' placeholder='e.g. private education groups'></label>",
    "<label>Desired fields<input name='fields' placeholder='company, email, phone, LinkedIn, address, fit signals, source URL'></label>",
    "<label>Output format<select name='format'><option>CSV</option><option>JSON</option></select></label>",
    "<label class='full'>Sales notes<textarea name='notes' placeholder='Exclusions, account tiers, outreach context'></textarea></label>",
  ].join("");
}

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).join("; ") : String(value ?? "");
  return '"' + text.replaceAll('"', '""') + '"';
}

async function runWorker(input: {
  orderId: string;
  token: string;
  plan: "INTEL" | "PROSPECTS";
  urls: string[];
  question: string;
  geography: string;
  industry: string;
  fields: string;
}) {
  const response = await fetch("https://nova-demand-worker.vercel.app/internal/big-ticket/research", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
    signal: AbortSignal.timeout(225_000),
  });
  const raw = await response.text();
  const payload = raw ? JSON.parse(raw) : null;
  if (!response.ok || !payload?.ok) throw new Error(String(payload?.error || "BIG_TICKET_WORKER_FAILED").slice(0, 500));
  return payload;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");
  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== orderId || payload.plan === "AUDIT") throw new Error("INVALID_BIG_TICKET_TOKEN");
    const body = [
      "<span class='pill'>", esc(PLAN_INFO[payload.plan].name), " · Paid fulfillment</span>",
      "<h1>Submit your delivery brief</h1>",
      "<p>Order <strong>", esc(orderId), "</strong>. We use public sources and the scope you provide. The worker will execute the purchased intelligence pack after intake.</p>",
      "<form method='POST'><input type='hidden' name='order' value='", esc(orderId), "'><input type='hidden' name='token' value='", esc(token), "'>",
      "<div class='grid'>", fieldsFor(payload.plan), "<div class='full'><button class='btn' type='submit'>Run my paid intelligence pack</button></div></div></form>",
      "<p class='note'>Public-source data only. No fabricated fields or restricted personal data.</p>"
    ].join("");
    return page(PLAN_INFO[payload.plan].name, body);
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

    const urls = [...new Set(String(form.get("urls") || "").split(/\r?\n/).map((value) => value.trim()).filter(Boolean))];
    if (!urls.length) throw new Error("AT_LEAST_ONE_URL_REQUIRED");
    if (urls.length > 100) throw new Error("MAX_100_URLS");

    for (const value of urls) {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("URLS_MUST_BE_HTTP_OR_HTTPS");
    }

    const brief = {
      question: String(form.get("question") || "").trim().slice(0, 1000),
      geography: String(form.get("geography") || "").trim().slice(0, 300),
      industry: String(form.get("industry") || "").trim().slice(0, 300),
      fields: String(form.get("fields") || "").trim().slice(0, 2000),
      notes: String(form.get("notes") || "").trim().slice(0, 3000),
      format: String(form.get("format") || "CSV").toUpperCase() === "JSON" ? "JSON" : "CSV"
    };

    const result = await runWorker({
      orderId, token, plan: payload.plan,
      urls,
      question: brief.question,
      geography: brief.geography,
      industry: brief.industry,
      fields: brief.fields
    });

    await addPrivateNote(orderId, JSON.stringify({
      type: "BIG_TICKET_COMPLETED",
      plan: payload.plan,
      orderId,
      completedAt: new Date().toISOString(),
      requestedUrls: urls.length,
      succeeded: result.summary?.succeeded || 0,
      failed: result.summary?.failed || 0,
      format: brief.format
    }));

    if (brief.format === "JSON") {
      const output = JSON.stringify({ ...result, brief }, null, 2);
      return new Response(output, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": 'attachment; filename="'+payload.plan.toLowerCase()+"-"+orderId.replace(/[^a-zA-Z0-9_-]/g,"-")+'.json"',
          "Cache-Control": "no-store"
        }
      });
    }

    const rows = Array.isArray(result.rows) ? result.rows : [];
    const headers = payload.plan === "PROSPECTS"
      ? ["companyName","website","publicEmails","publicPhones","socialProfiles","address","fitScore","fitSignals","evidence","sourceUrl","status"]
      : ["url","ok","score","matchedTerms","title","description","canonical","headings","snippets"];

    const csv = [
      headers.map(csvCell).join(","),
      ...rows.map((row: any) => headers.map((field) => csvCell(row[field])).join(","))
    ].join("\r\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="'+payload.plan.toLowerCase()+"-"+orderId.replace(/[^a-zA-Z0-9_-]/g,"-")+'.csv"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return page("Fulfillment failed", "<span class='pill'>Execution error</span><h1>Pack not generated</h1><p>"+esc(error instanceof Error ? error.message : error)+"</p>");
  }
}
