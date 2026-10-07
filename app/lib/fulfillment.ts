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
