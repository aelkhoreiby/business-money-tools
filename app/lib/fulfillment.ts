import crypto from "node:crypto";

export type PlanKey = "RESCUE" | "GUARD" | "PRO" | "LEADS" | "AUDIT";

export const PLAN_INFO: Record<PlanKey, { name: string; priceUsd: number }> = {
  RESCUE: { name: "Profit Rescue Report", priceUsd: 29 },
  GUARD: { name: "Profit Guard - 1 Month", priceUsd: 49 },
  PRO: { name: "Guard Pro - 1 Month", priceUsd: 99 },
  LEADS: { name: "B2B Contact Research - Up to 100 Companies", priceUsd: 249 },
  AUDIT: { name: "Website SEO + AI Visibility Audit", priceUsd: 59 },
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
  return appBaseUrl() + "/api/intake?order=" + encodeURIComponent(orderId) + "&token=" + encodeURIComponent(token);
}

export function detectPlan(order: any): PlanKey | null {
  const items = Array.isArray(order?.cart_items) ? order.cart_items : [];
  const haystack = items
    .map((item: any) =>
      [
        item?.product?.name,
        item?.product?.slug,
        item?.product?.sku,
        item?.name,
        item?.sku,
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ")
    .toLowerCase();

  if (!haystack) return null;
  if (haystack.includes("b2b-contact-research") || haystack.includes("b2b contact") || haystack.includes("contact research") || haystack.includes("lead dataset")) return "LEADS";
  if (haystack.includes("website seo") || haystack.includes("seo audit") || haystack.includes("website audit") || haystack.includes("ai visibility audit") || haystack.includes("seo-inspector")) return "AUDIT";
  if (haystack.includes("guard pro") || haystack.includes("guard-pro")) return "PRO";
  if (haystack.includes("profit guard") || haystack.includes("profit-guard")) return "GUARD";
  if (haystack.includes("profit rescue") || haystack.includes("rescue report") || haystack.includes("profit-rescue")) {
    return "RESCUE";
  }
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
  const breakEvenPrice =
    1 - returnsRate / 100 > 0
      ? (nonAdCosts + cac) / (1 - returnsRate / 100) + discount
      : 0;

  const leaks: string[] = [];
  if (maxCac <= 0) {
    leaks.push("Core economics are negative before acquisition cost.");
  } else if (cac >= maxCac * 0.9) {
    leaks.push("CAC is consuming almost all available contribution profit.");
  }
  if (margin < 15) {
    leaks.push("Net contribution margin is thin for paid acquisition.");
  }
  if (returnsRate >= 8) {
    leaks.push("Returns/RTO pressure is materially reducing realized revenue.");
  }
  if (shipping + paymentFee > sellingPrice * 0.15) {
    leaks.push("Shipping and payment/platform fees are taking a large share of order value.");
  }
  if (discount > sellingPrice * 0.1) {
    leaks.push("Discount depth is materially compressing realized revenue.");
  }
  while (leaks.length < 3) leaks.push("Review pricing, fulfillment cost, and acquisition efficiency before scaling.");
  const selectedLeaks = leaks.slice(0, 3);

  const actions: string[] = [];
  if (profit < 0) {
    actions.push("STOP scaling paid acquisition until order-level economics are positive.");
  } else if (cac > 0 && cac > maxCac * 0.8) {
    actions.push("Lower CAC toward a safer ceiling before adding budget.");
  } else {
    actions.push("Scale the acquisition source only while realized margin stays above the current floor.");
  }
  if (returnsRate >= 8) {
    actions.push("Attack returns/RTO causes before increasing traffic.");
  } else if (discount > sellingPrice * 0.1) {
    actions.push("Test a smaller discount or a higher-value bundle instead of deeper discounting.");
  } else {
    actions.push("Test a higher-AOV bundle before relying on more traffic.");
  }
  actions.push("Re-run the report with actual store totals weekly while Guard is active.");

  let decision: ProfitReport["decision"] = "SCALE";
  if (profit < 0) decision = "STOP";
  else if (margin < 15 || cac > maxCac * 0.9 || returnsRate >= 12) decision = "FIX";

  return {
    currency: input.currency,
    sellingPrice,
    productCost,
    shipping,
    paymentFee,
    discount,
    cac,
    returnsRate,
    orderId,
    plan,
    planName: PLAN_INFO[plan].name,
    generatedAt: new Date().toISOString(),
    revenueAfterDiscount,
    returnsCost,
    netRevenue,
    nonAdCosts,
    profit,
    margin,
    maxCac,
    breakEvenRoas,
    breakEvenPrice,
    decision,
    leaks: selectedLeaks,
    actions,
  };
}

function ascii(value: string) {
  return String(value)
    .replace(/[€£¥]/g, "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildProfitReportPdf(report: ProfitReport): Buffer {
  const money = (value: number) => report.currency + " " + value.toFixed(2);
  const lines = [
    "PROFIT RESCUE AI",
    report.planName,
    "Order: " + report.orderId,
    "Generated: " + report.generatedAt,
    "",
    "1. ORDER ECONOMICS",
    "Selling price: " + money(report.sellingPrice),
    "Product cost: " + money(report.productCost),
    "Shipping: " + money(report.shipping),
    "Payment/platform fee: " + money(report.paymentFee),
    "Discount: " + money(report.discount),
    "CAC per order: " + money(report.cac),
    "Returns rate: " + report.returnsRate.toFixed(2) + "%",
    "",
    "2. PROFIT DIAGNOSTIC",
    "Revenue after discount: " + money(report.revenueAfterDiscount),
    "Returns impact: " + money(report.returnsCost),
    "Net revenue: " + money(report.netRevenue),
    "Non-ad costs: " + money(report.nonAdCosts),
    "Net profit/order: " + money(report.profit),
    "Net margin: " + report.margin.toFixed(2) + "%",
    "Max safe CAC: " + money(report.maxCac),
    "Break-even ROAS: " + (report.breakEvenRoas ? report.breakEvenRoas.toFixed(2) + "x" : "-"),
    "Break-even selling price: " + money(report.breakEvenPrice),
    "Decision: " + report.decision,
    "",
    "3. TOP PROFIT LEAKS",
    "1) " + report.leaks[0],
    "2) " + report.leaks[1],
    "3) " + report.leaks[2],
    "",
    "4. PRIORITIZED ACTION PLAN",
    "1) " + report.actions[0],
    "2) " + report.actions[1],
    "3) " + report.actions[2],
    "",
    "This report is a deterministic diagnostic based only on the figures submitted by the buyer.",
    "It is not a forecast and does not fabricate an expected revenue uplift.",
  ];

  const pageChunks: string[][] = [];
  const perPage = 41;
  for (let i = 0; i < lines.length; i += perPage) pageChunks.push(lines.slice(i, i + perPage));

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  const addObject = (id: number, body: string) => {
    offsets[id] = Buffer.byteLength(pdf, "utf8");
    pdf += id + " 0 obj\n" + body + "\nendobj\n";
  };

  addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
  const pageObjectIds = pageChunks.map((_, index) => 3 + index * 2);
  const contentObjectIds = pageChunks.map((_, index) => 4 + index * 2);
  const fontObjectId = 3 + pageChunks.length * 2;
  addObject(2, "<< /Type /Pages /Kids [" + pageObjectIds.map((id) => id + " 0 R").join(" ") + "] /Count " + pageObjectIds.length + " >>");

  for (let i = 0; i < pageChunks.length; i += 1) {
    const pageId = pageObjectIds[i];
    const contentId = contentObjectIds[i];
    const chunk = pageChunks[i];
    let stream = "BT\n/F1 16 Tf\n50 760 Td\n(" + pdfEscape(chunk[0]) + ") Tj\n/F1 10 Tf\n0 -24 Td\n";
    for (let lineIndex = 1; lineIndex < chunk.length; lineIndex += 1) {
      stream += "(" + pdfEscape(chunk[lineIndex]) + ") Tj\n0 -14 Td\n";
    }
    stream += "ET\n";
    addObject(contentId, "<< /Length " + Buffer.byteLength(stream, "utf8") + " >>\nstream\n" + stream + "endstream");
    addObject(pageId, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 " + fontObjectId + " 0 R >> >> /Contents " + contentId + " 0 R >>");
  }

  addObject(fontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const maxObject = fontObjectId;
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += "xref\n0 " + (maxObject + 1) + "\n0000000000 65535 f \n";
  for (let i = 1; i <= maxObject; i += 1) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += "trailer\n<< /Size " + (maxObject + 1) + " /Root 1 0 R >>\n";
  pdf += "startxref\n" + xrefOffset + "\n%%EOF\n";

  return Buffer.from(pdf, "utf8");
}
