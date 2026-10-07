import crypto from "node:crypto";

export type PlanKey = "AUDIT" | "INTEL" | "PROSPECTS";

export const PLAN_INFO: Record<PlanKey, { name: string; priceUsd: number }> = {
  AUDIT: { name: "AI Visibility & Revenue Leak Audit", priceUsd: 499 },
  INTEL: { name: "Multi-Source Business Intelligence / Data Extraction", priceUsd: 999 },
  PROSPECTS: { name: "B2B Prospect Intelligence Pack", priceUsd: 1499 },
};

type TokenPayload = {
  orderId: string;
  plan: PlanKey;
  exp: number;
};

export type ProfitInputs = {
  currency: "USD" | "AED" | "SAR";
  sellingPrice: number;
  productCost: number;
  shipping: number;
  paymentFee: number;
  discount: number;
  cac: number;
  returnsRate: number;
};

export type ProfitReport = ProfitInputs & {
  orderId: string;
  plan: PlanKey;
  planName: string;
  generatedAt: string;
  revenueAfterDiscount: number;
  returnsCost: number;
  netRevenue: number;
  nonAdCosts: number;
  profit: number;
  margin: number;
  maxCac: number;
  breakEvenRoas: number;
  breakEvenPrice: number;
  decision: "SCALE" | "FIX" | "STOP";
  leaks: string[];
  actions: string[];
};

function secret() {
  const value = String(process.env.FULFILLMENT_TOKEN_SECRET || "").trim();
  if (!value) throw new Error("FULFILLMENT_TOKEN_SECRET_NOT_CONFIGURED");
  return value;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createFulfillmentToken(orderId: string, plan: PlanKey, ttlDays = 7) {
  const payload: TokenPayload = {
    orderId,
    plan,
    exp: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return encoded + "." + sign(encoded);
}

export function verifyFulfillmentToken(token: string): TokenPayload {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) throw new Error("INVALID_FULFILLMENT_TOKEN");

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("INVALID_FULFILLMENT_TOKEN");
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new Error("INVALID_FULFILLMENT_TOKEN");
  }

  if (!payload?.orderId || !payload?.plan || !PLAN_INFO[payload.plan]) {
    throw new Error("INVALID_FULFILLMENT_TOKEN");
  }
  if (!Number.isFinite(payload.exp) || payload.exp < Date.now()) {
    throw new Error("FULFILLMENT_TOKEN_EXPIRED");
  }

  return payload;
}

export function appBaseUrl() {
  return String(process.env.NEXT_PUBLIC_APP_URL || "https://business-money-tools.vercel.app").replace(/\/+$/, "");
}

export function intakeUrl(orderId: string, plan: PlanKey) {
  const token = createFulfillmentToken(orderId, plan);
  const route = plan === "AUDIT" ? "/api/audit-intake" : "/api/big-ticket-intake";
  return appBaseUrl() + route + "?order=" + encodeURIComponent(orderId) + "&token=" + encodeURIComponent(token);
}

export function detectPlan(order: any): PlanKey | null {
  const items = Array.isArray(order?.cart_items) ? order.cart_items : [];
  const haystack = items
    .map((item: any) =>
      [item?.product?.name, item?.product?.slug, item?.product?.sku, item?.name, item?.sku]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ")
    .toLowerCase();

  if (!haystack) return null;
  if (
    haystack.includes("b2b prospect intelligence") ||
    haystack.includes("prospect-intelligence") ||
    haystack.includes("prospect intelligence") ||
    haystack.includes("nova-prospects")
  ) return "PROSPECTS";
  if (
    haystack.includes("multi-source business intelligence") ||
    haystack.includes("multi-source") ||
    haystack.includes("business intelligence") ||
    haystack.includes("data extraction") ||
    haystack.includes("nova-intel")
  ) return "INTEL";
  if (
    haystack.includes("ai visibility & revenue leak audit") ||
    haystack.includes("ai visibility") ||
    haystack.includes("revenue leak audit") ||
    haystack.includes("website seo")
  ) return "AUDIT";
  return null;
}


function numberOrZero(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function calculateProfitReport(input: ProfitInputs, orderId: string, plan: PlanKey): ProfitReport {
  const sellingPrice = numberOrZero(input.sellingPrice);
  const productCost = numberOrZero(input.productCost);
  const shipping = numberOrZero(input.shipping);
  const paymentFee = numberOrZero(input.paymentFee);
  const discount = numberOrZero(input.discount);
  const cac = numberOrZero(input.cac);
  const returnsRate = Math.min(100, numberOrZero(input.returnsRate));
  const revenueAfterDiscount = Math.max(0, sellingPrice - discount);
  const returnsCost = revenueAfterDiscount * (returnsRate / 100);
  const netRevenue = Math.max(0, revenueAfterDiscount - returnsCost);
  const nonAdCosts = productCost + shipping + paymentFee;
  const profit = netRevenue - nonAdCosts - cac;
  const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
  const maxCac = netRevenue - nonAdCosts;
  const breakEvenRoas = maxCac > 0 && revenueAfterDiscount > 0 ? revenueAfterDiscount / maxCac : 0;
  const breakEvenPrice = (1 - returnsRate / 100) > 0
    ? (nonAdCosts + cac) / (1 - returnsRate / 100) + discount
    : 0;

  const leaks: string[] = [];
  if (maxCac <= 0) leaks.push("Core economics are negative before acquisition cost.");
  else if (cac >= maxCac * 0.9) leaks.push("CAC is consuming almost all available contribution profit.");
  if (margin < 15) leaks.push("Net contribution margin is thin for paid acquisition.");
  if (returnsRate >= 8) leaks.push("Returns/RTO pressure is materially reducing realized revenue.");
  if (shipping + paymentFee > sellingPrice * 0.15) leaks.push("Shipping and payment/platform fees are taking a large share of order value.");
  if (discount > sellingPrice * 0.1) leaks.push("Discount depth is materially compressing realized revenue.");
  while (leaks.length < 3) leaks.push("Review pricing, fulfillment cost, and acquisition efficiency before scaling.");
  const selectedLeaks = leaks.slice(0, 3);

  const actions: string[] = [];
  if (profit < 0) actions.push("STOP scaling paid acquisition until order-level economics are positive.");
  else if (cac > 0 && cac > maxCac * 0.8) actions.push("Lower CAC toward a safer ceiling before adding budget.");
  else actions.push("Scale only while realized contribution margin stays above the current floor.");
  if (returnsRate >= 8) actions.push("Attack returns/RTO causes before increasing traffic.");
  else if (discount > sellingPrice * 0.1) actions.push("Test a smaller discount or a higher-value bundle instead of deeper discounting.");
  else actions.push("Test a higher-AOV bundle before relying on more traffic.");
  actions.push("Re-run the diagnostic with actual store totals after the highest-impact fix.");

  let decision: ProfitReport["decision"] = "SCALE";
  if (profit < 0) decision = "STOP";
  else if (margin < 15 || cac > maxCac * 0.9 || returnsRate >= 12) decision = "FIX";

  return {
    ...input,
    sellingPrice, productCost, shipping, paymentFee, discount, cac, returnsRate,
    orderId, plan, planName: PLAN_INFO[plan].name, generatedAt: new Date().toISOString(),
    revenueAfterDiscount, returnsCost, netRevenue, nonAdCosts, profit, margin, maxCac,
    breakEvenRoas, breakEvenPrice, decision, leaks: selectedLeaks, actions
  };
}

function ascii(value: string) {
  return String(value).replace(/[€£¥]/g, "").replace(/[\u2013\u2014]/g, "-").replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildProfitReportPdf(report: ProfitReport): Buffer {
  const money = (value: number) => report.currency + " " + value.toFixed(2);
  const lines = [
    "PROFIT RESCUE AI", report.planName, "Order: " + report.orderId, "Generated: " + report.generatedAt, "",
    "ORDER ECONOMICS",
    "Selling price: " + money(report.sellingPrice), "Product cost: " + money(report.productCost),
    "Shipping: " + money(report.shipping), "Payment/platform fee: " + money(report.paymentFee),
    "Discount: " + money(report.discount), "CAC: " + money(report.cac),
    "Returns/RTO rate: " + report.returnsRate.toFixed(2) + "%",
    "", "PROFIT DIAGNOSTIC",
    "Net revenue: " + money(report.netRevenue), "Net profit/order: " + money(report.profit),
    "Net margin: " + report.margin.toFixed(2) + "%", "Max safe CAC: " + money(report.maxCac),
    "Break-even ROAS: " + (report.breakEvenRoas ? report.breakEvenRoas.toFixed(2) + "x" : "-"),
    "Break-even price: " + money(report.breakEvenPrice), "Decision: " + report.decision, "",
    "TOP PROFIT LEAKS", "1) " + report.leaks[0], "2) " + report.leaks[1], "3) " + report.leaks[2], "",
    "PRIORITIZED ACTIONS", "1) " + report.actions[0], "2) " + report.actions[1], "3) " + report.actions[2], "",
    "Deterministic diagnostic based only on buyer-submitted figures."
  ];
  const perPage = 41;
  const chunks: string[][] = [];
  for (let i=0; i<lines.length; i+=perPage) chunks.push(lines.slice(i,i+perPage));
  let pdf = "%PDF-1.4\n";
  const offsets:number[]=[0];
  const addObject=(id:number,body:string)=>{offsets[id]=Buffer.byteLength(pdf,"utf8");pdf+=id+" 0 obj\n"+body+"\nendobj\n";};
  addObject(1,"<< /Type /Catalog /Pages 2 0 R >>");
  const pageIds=chunks.map((_,i)=>3+i*2), contentIds=chunks.map((_,i)=>4+i*2), fontId=3+chunks.length*2;
  addObject(2,"<< /Type /Pages /Kids ["+pageIds.map(id=>id+" 0 R").join(" ")+"] /Count "+pageIds.length+" >>");
  for(let i=0;i<chunks.length;i++){
    const rows=chunks[i];
    let stream="BT\n/F1 16 Tf\n50 760 Td\n("+pdfEscape(rows[0])+") Tj\n/F1 10 Tf\n0 -24 Td\n";
    for(let j=1;j<rows.length;j++) stream+="("+pdfEscape(rows[j])+") Tj\n0 -14 Td\n";
    stream+="ET\n";
    addObject(contentIds[i],"<< /Length "+Buffer.byteLength(stream,"utf8")+" >>\nstream\n"+stream+"endstream");
    addObject(pageIds[i],"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 "+fontId+" 0 R >> >> /Contents "+contentIds[i]+" 0 R >>");
  }
  addObject(fontId,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const xrefOffset=Buffer.byteLength(pdf,"utf8");
  pdf+="xref\n0 "+(fontId+1)+"\n0000000000 65535 f \n";
  for(let i=1;i<=fontId;i++) pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  pdf+="trailer\n<< /Size "+(fontId+1)+" /Root 1 0 R >>\nstartxref\n"+xrefOffset+"\n%%EOF\n";
  return Buffer.from(pdf,"utf8");
}
