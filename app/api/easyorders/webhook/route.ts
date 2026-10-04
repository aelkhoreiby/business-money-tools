import { NextRequest, NextResponse } from "next/server";
import { detectPlan, intakeUrl, PLAN_INFO } from "../../../lib/fulfillment";

export const dynamic = "force-dynamic";

const EASY_ORDERS_API = "https://api.easy-orders.net/api/v1/external-apps/orders";

function webhookSecretMatches(req: NextRequest) {
  const expected = String(process.env.EASY_ORDERS_WEBHOOK_SECRET || "").trim();
  return Boolean(expected && req.headers.get("secret") === expected);
}

async function readOrder(orderId: string) {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");

  const response = await fetch(EASY_ORDERS_API + "/" + encodeURIComponent(orderId), {
    method: "GET",
    headers: { "Api-Key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error("EASY_ORDERS_GET_ORDER_FAILED:" + response.status);
  return payload?.data ?? payload?.order ?? payload;
}

async function updateOrderStatus(orderId: string, status: string) {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");

  const response = await fetch(EASY_ORDERS_API + "/" + encodeURIComponent(orderId) + "/status", {
    method: "PATCH",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("EASY_ORDERS_STATUS_UPDATE_FAILED:" + response.status);
}

async function addPublicNote(orderId: string, storeId: string | undefined, note: string) {
  const apiKey = String(process.env.EASY_ORDERS_API_KEY || "").trim();
  if (!apiKey) throw new Error("EASY_ORDERS_API_KEY_NOT_CONFIGURED");

  const response = await fetch("https://api.easy-orders.net/api/v1/external-apps/order-notes", {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      order_id: orderId,
      store_id: storeId,
      type: "public",
      note,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("EASY_ORDERS_NOTE_FAILED:" + response.status);
}

export async function POST(req: NextRequest) {
  if (!webhookSecretMatches(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: process.env.EASY_ORDERS_WEBHOOK_SECRET
          ? "invalid_webhook_secret"
          : "webhook_secret_not_configured",
      },
      { status: process.env.EASY_ORDERS_WEBHOOK_SECRET ? 401 : 503 }
    );
  }

  let event: any;
  try {
    event = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const orderId = String(event?.order_id || event?.order?.id || "").trim();
  const newStatus = String(event?.new_status || event?.order?.status || "").trim().toLowerCase();

  if (!orderId) return NextResponse.json({ ok: false, error: "order_id_required" }, { status: 400 });
  if (newStatus !== "paid") {
    return NextResponse.json({ ok: true, ignored: true, reason: "status_not_paid", orderId, newStatus });
  }

  try {
    const order = await readOrder(orderId);
    const verifiedStatus = String(order?.status || order?.payment_status || "").trim().toLowerCase();
    const paymentRef = String(
      event?.payment_ref_id ||
      order?.payment_ref_id ||
      order?.payment_reference ||
      order?.payment?.payment_ref_id ||
      ""
    ).trim();

    if (verifiedStatus !== "paid" || !paymentRef) {
      return NextResponse.json(
        {
          ok: false,
          status: "pending_verification",
          orderId,
          verifiedStatus,
          paymentRefPresent: Boolean(paymentRef),
        },
        { status: 409 }
      );
    }

    const plan = detectPlan(order);
    if (!plan) {
      await addPublicNote(
        orderId,
        order?.store_id,
        "Payment received. We could not identify the purchased Profit Rescue plan automatically. Support will review the order."
      );
      return NextResponse.json({ ok: false, status: "paid_unmapped_plan", orderId }, { status: 422 });
    }

    const intake = intakeUrl(orderId, plan);

    try {
      await updateOrderStatus(orderId, "processing");
    } catch {
      // Delivery remains usable if order-status update permission is unavailable.
    }

    await addPublicNote(
      orderId,
      order?.store_id,
      "Payment verified (ref " + paymentRef + "). Your " + PLAN_INFO[plan].name +
        " fulfillment is ready. Complete your secure intake here: " + intake
    );

    return NextResponse.json({
      ok: true,
      status: "paid_verified_intake_issued",
      orderId,
      plan,
      paymentRefPresent: true,
      fulfillmentUrl: intake,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "fulfillment_error",
        orderId,
        error: String(error instanceof Error ? error.message : error),
      },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/easyorders/webhook",
    configured: Boolean(process.env.EASY_ORDERS_WEBHOOK_SECRET && process.env.EASY_ORDERS_API_KEY),
    secretConfigured: Boolean(process.env.EASY_ORDERS_WEBHOOK_SECRET),
    apiKeyConfigured: Boolean(process.env.EASY_ORDERS_API_KEY),
  });
}
