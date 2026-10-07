import { NextRequest } from "next/server";
import { calculateProfitReport, verifyFulfillmentToken } from "../../lib/fulfillment";
import { buildWebsiteAuditPdf, runWebsiteAudit } from "../../lib/auditFulfillment";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

function safe(value: string) {
  return String(value || "").replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c] || c));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const order = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");
  try {
    const payload = verifyFulfillmentToken(token);
    if (payload.orderId !== order || payload.plan !== "AUDIT") throw new Error("INVALID_AUDIT_TOKEN");
    const html = [
      "<!doctype html><html><body style='font-family:system-ui;max-width:760px;margin:40px auto;padding:20px'>",
      "<h1>AI Visibility & Revenue Leak Audit</h1>",
      "<p>Paid order <strong>"+safe(order)+"</strong>. Submit one public website and representative order economics.</p>",
      "<form method='POST'><input type='hidden' name='order' value='"+safe(order)+"'><input type='hidden' name='token' value='"+safe(token)+"'>",
      "<label>Website URL<br><input name='websiteUrl' type='url' required placeholder='https://example.com' style='width:100%;padding:12px'></label><br><br>",
      "<label>Currency<br><select name='currency'><option>USD</option><option>AED</option><option>SAR</option></select></label><br><br>",
      "<div style='display:grid;grid-template-columns:1fr 1fr;gap:12px'>",
      "<label>Selling price<input name='sellingPrice' type='number' min='0' step='0.01' required style='width:100%;padding:10px'></label>",
      "<label>Product cost<input name='productCost' type='number' min='0' step='0.01' required style='width:100%;padding:10px'></label>",
      "<label>Shipping<input name='shipping' type='number' min='0' step='0.01' required style='width:100%;padding:10px'></label>",
      "<label>Payment/platform fee<input name='paymentFee' type='number' min='0' step='0.01' required style='width:100%;padding:10px'></label>",
      "<label>Discount<input name='discount' type='number' min='0' step='0.01' value='0' required style='width:100%;padding:10px'></label>",
      "<label>CAC / ad cost per order<input name='cac' type='number' min='0' step='0.01' required style='width:100%;padding:10px'></label>",
      "<label>Returns / RTO rate %<input name='returnsRate' type='number' min='0' max='100' step='0.01' value='0' required style='width:100%;padding:10px'></label>",
      "</div><p><label><input name='permission' value='yes' type='checkbox' required> I own, manage, or have permission to audit this website.</label></p>",
      "<button type='submit' style='padding:13px 18px;font-weight:800'>Generate my Big-Ticket Audit</button>",
      "</form><p style='color:#667085;font-size:13px'>Evidence-based and deterministic. No guaranteed rankings, traffic, conversions, or revenue uplift.</p>",
      "</body></html>"
    ].join("");
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8", "cache-control":"no-store" } });
  } catch {
    return Response.json({ ok:false, error:"INVALID_AUDIT_LINK" }, { status:401 });
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const order = String(form.get("order") || "");
  const token = String(form.get("token") || "");
  const websiteUrl = String(form.get("websiteUrl") || "").trim();
  const permission = String(form.get("permission") || "").trim().toLowerCase();
  const payload = verifyFulfillmentToken(token);

  if (payload.orderId !== order || payload.plan !== "AUDIT") return Response.json({ok:false,error:"INVALID_AUDIT_TOKEN"},{status:401});
  if (!websiteUrl) return Response.json({ok:false,error:"WEBSITE_URL_REQUIRED"},{status:400});
  if (permission !== "yes") return Response.json({ok:false,error:"SITE_PERMISSION_REQUIRED"},{status:400});

  const currencyValue = String(form.get("currency") || "USD");
  const currency = currencyValue === "AED" || currencyValue === "SAR" ? currencyValue : "USD";
  const profitReport = calculateProfitReport({
    currency,
    sellingPrice: Number(form.get("sellingPrice") || 0),
    productCost: Number(form.get("productCost") || 0),
    shipping: Number(form.get("shipping") || 0),
    paymentFee: Number(form.get("paymentFee") || 0),
    discount: Number(form.get("discount") || 0),
    cac: Number(form.get("cac") || 0),
    returnsRate: Number(form.get("returnsRate") || 0),
  }, order, "AUDIT");

  const audit = await runWebsiteAudit(websiteUrl);
  const pdf = buildWebsiteAuditPdf(audit, order, {
    profit: profitReport.profit,
    margin: profitReport.margin,
    maxCac: profitReport.maxCac,
    breakEvenRoas: profitReport.breakEvenRoas,
    breakEvenPrice: profitReport.breakEvenPrice,
    decision: profitReport.decision,
    leaks: profitReport.leaks,
    actions: profitReport.actions,
    currency
  });

  return new Response(pdf, { headers: {
    "Content-Type":"application/pdf",
    "Content-Disposition": 'attachment; filename="ai-visibility-revenue-leak-audit-'+order.replace(/[^a-zA-Z0-9_-]/g,"-")+'.pdf',
    "Cache-Control":"no-store"
  }});
}
