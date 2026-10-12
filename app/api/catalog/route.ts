import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const humanOffers = [
  {
    id: "AUDIT",
    name: "AI Visibility & Revenue Leak Audit",
    price_usd: 499,
    billing: "one_time",
    delivery: "Research deliverable; confirm checkout and fulfillment for each order.",
  },
  {
    id: "INTEL",
    name: "Multi-Source Business Intelligence / Data Extraction",
    price_usd: 999,
    billing: "one_time",
    delivery: "Structured dataset and research summary; confirm checkout and fulfillment for each order.",
  },
  {
    id: "PROSPECTS",
    name: "B2B Prospect Intelligence Pack",
    price_usd: 1499,
    billing: "one_time",
    delivery: "Prospect intelligence deliverable; confirm checkout and fulfillment for each order.",
  },
] as const;

const apiServices = [
  {
    id: "company-intelligence",
    method: "POST",
    endpoint: "/api/v1/intel/company",
    status: "planned",
    live: false,
    pricing: {
      model: "metered",
      currency: "USD",
      status: "not_configured",
      unit_price: null,
    },
    payment: {
      status: "not_enabled",
      protocol: null,
    },
    constraints: {
      mock_data: false,
      charge_initiated: false,
    },
  },
  {
    id: "prospect-enrichment",
    method: "POST",
    endpoint: "/api/v1/prospects/enrich",
    status: "planned",
    live: false,
    pricing: {
      model: "metered",
      currency: "USD",
      status: "not_configured",
      unit_price: null,
    },
    payment: {
      status: "not_enabled",
      protocol: null,
    },
  },
  {
    id: "visibility-audit",
    method: "POST",
    endpoint: "/api/v1/audit/visibility",
    status: "planned",
    live: false,
    pricing: {
      model: "metered",
      currency: "USD",
      status: "not_configured",
      unit_price: null,
    },
    payment: {
      status: "not_enabled",
      protocol: null,
    },
  },
] as const;

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      schema_version: "1.0",
      brand: "Profit Rescue AI",
      status: "discovery_only",
      generated_at: new Date().toISOString(),
      human_offers: humanOffers,
      api_services: apiServices,
      warning:
        "Machine execution, API authentication, metered pricing, payment, and verifiable settlement are not enabled. Do not treat planned API services as purchasable. Human offer listing does not itself prove checkout, payment, or fulfillment.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
