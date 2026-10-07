import { NextRequest } from "next/server";
import { verifyFulfillmentToken } from "../../lib/fulfillment";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = String(url.searchParams.get("order") || "");
  const token = String(url.searchParams.get("token") || "");
  if (url.searchParams.get("mode") === "verify") {
    try {
      const payload = verifyFulfillmentToken(token);
      if (payload.orderId !== orderId) throw new Error("TOKEN_ORDER_MISMATCH");
      return Response.json({ ok: true, orderId: payload.orderId, plan: payload.plan });
    } catch {
      return Response.json({ ok: false }, { status: 401 });
    }
  }
  return Response.json({
    ok: false,
    error: "LEGACY_INTAKE_RETIRED",
    message: "Paid fulfillment now uses the three Big Ticket plans and dedicated intake routes."
  }, { status: 410 });
}
