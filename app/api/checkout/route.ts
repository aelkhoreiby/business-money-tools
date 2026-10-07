import { NextResponse } from "next/server";

const checkoutUrls = {
  AUDIT: process.env.NEXT_PUBLIC_BIG_AUDIT_CHECKOUT_URL,
  INTEL: process.env.NEXT_PUBLIC_BIG_INTEL_CHECKOUT_URL,
  PROSPECTS: process.env.NEXT_PUBLIC_BIG_PROSPECTS_CHECKOUT_URL,
} as const;

export async function GET(request: Request) {
  const plan = new URL(request.url).searchParams.get("plan") as keyof typeof checkoutUrls | null;
  const target = plan ? checkoutUrls[plan] : undefined;

  if (!target) {
    return NextResponse.json({ ok: false, error: "BIG_TICKET_CHECKOUT_UNAVAILABLE" }, { status: 503 });
  }

  return NextResponse.redirect(target, 302);
}
