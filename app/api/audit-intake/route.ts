import { NextRequest } from "next/server";
import { verifyFulfillmentToken } from "../../lib/fulfillment";
import { buildWebsiteAuditPdf, runWebsiteAudit } from "../../lib/auditFulfillment";

export const dynamic = "force-dynamic";

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
    return new Response("<html><body style='font-family:system-ui;max-width:700px;margin:40px auto;padding:20px'><h1>Website SEO + AI Visibility Audit</h1><p>Order "+safe(order)+"</p><form method='POST'><input type='hidden' name='order' value='"+safe(order)+"'><input type='hidden' name='token' value='"+safe(token)+"'><label>Website URL<br><input name='websiteUrl' type='url' required placeholder='https://example.com' style='width:100%;padding:12px'></label><p><label><input name='permission' value='yes' type='checkbox' required> I own, manage, or have permission to audit this website.</label></p><button type='submit' style='padding:12px 18px'>Generate PDF</button></form></body></html>", { headers: { "content-type":"text/html; charset=utf-8", "cache-control":"no-store" } });
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
  const audit = await runWebsiteAudit(websiteUrl);
  const pdf = buildWebsiteAuditPdf(audit, order);
  return new Response(pdf, { headers: { "Content-Type":"application/pdf", "Content-Disposition": 'attachment; filename="website-audit-'+order.replace(/[^a-zA-Z0-9_-]/g,"-")+'.pdf', "Cache-Control":"no-store" } });
}
