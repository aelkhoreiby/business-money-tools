import { NextResponse } from "next/server";

const checkoutUrls = {
  RESCUE: process.env.NEXT_PUBLIC_RESCUE_CHECKOUT_URL,
  GUARD: process.env.NEXT_PUBLIC_GUARD_CHECKOUT_URL,
  PRO: process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL,
  AUDIT: process.env.NEXT_PUBLIC_AUDIT_CHECKOUT_URL,
  LEADS: process.env.NEXT_PUBLIC_LEADS_CHECKOUT_URL,
} as const;

export async function GET(request: Request) {
  const plan = new URL(request.url).searchParams.get("plan") as keyof typeof checkoutUrls | null;
  const target = plan ? checkoutUrls[plan] : undefined;

  if (!target) {
    return NextResponse.json({ ok: false, error: "CHECKOUT_UNAVAILABLE" }, { status: 503 });
  }

  return NextResponse.redirect(target, 302);
}

// Easy Orders checkout routes intentionally point to funnel URLs so product pages are not a sales step.

