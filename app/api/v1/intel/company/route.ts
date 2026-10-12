import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error_code: "API_NOT_ENABLED",
      message:
        "Company intelligence execution is not yet connected to a real data source, authentication, usage metering, payment, and verifiable settlement. No placeholder company records were returned and no charge was initiated.",
      service: "company-intelligence",
      status: "planned",
      charge_incurred: false,
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": "86400",
      },
    },
  );
}
