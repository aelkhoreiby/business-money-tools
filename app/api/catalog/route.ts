import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const humanOffers = [
  { id: "AUDIT", name: "AI Visibility & Revenue Leak Audit", price_usd: 499, billing: "one_time" },
  { id: "INTEL", name: "Multi-Source Business Intelligence / Data Extraction", price_usd: 999, billing: "one_time" },
  { id: "PROSPECTS", name: "B2B Prospect Intelligence Pack", price_usd: 1499, billing: "one_time" },
] as const;

// These are code-default prices in NOVA source. Runtime x402 requirements may override them.
const upstreamPaidServices = [
  {
    id: "company-intelligence",
    provider: "NOVA Demand Worker",
    method: "POST",
    endpoint: "https://nova-demand-worker.vercel.app/x402/company-intelligence",
    input_example: { url: "https://example.com", focus: ["products", "services"] },
    payment: { protocol: "x402", scheme: "exact", network: "eip155:8453", asset: "USDC" },
    code_default_price_usd: 0.25,
    price_unit: "per_request",
    deployment_status: "production_deployment_ready",
    runtime_payment_challenge_verified: false,
  },
  {
    id: "contact-batch",
    provider: "NOVA Demand Worker",
    method: "POST",
    endpoint: "https://nova-demand-worker.vercel.app/x402/contact-batch",
    input_example: { urls: ["https://example.com", "https://example.org"] },
    max_urls_per_request: 100,
    payment: { protocol: "x402", scheme: "exact", network: "eip155:8453", asset: "USDC" },
    code_default_price_usd: 0.5,
    price_unit: "per_request_up_to_100_urls",
    deployment_status: "production_deployment_ready",
    runtime_payment_challenge_verified: false,
  },
  {
    id: "contact-extract",
    provider: "NOVA Demand Worker",
    method: "POST",
    endpoint: "https://nova-demand-worker.vercel.app/x402/contact-extract",
    input_example: { url: "https://example.com" },
    payment: { protocol: "x402", scheme: "exact", network: "eip155:8453", asset: "USDC" },
    code_default_price_usd: 0.005,
    price_unit: "per_request",
    deployment_status: "production_deployment_ready",
    runtime_payment_challenge_verified: true,
    last_challenge_tested_at: "2026-10-13",
    last_challenge_test: {
      http_status: 402,
      scheme: "exact",
      network: "eip155:8453",
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      asset_symbol: "USDC",
      amount_atomic_units: "5000",
      amount_display_usdc: "0.005",
      max_timeout_seconds: 300,
      payment_signature_sent: false,
      payment_response_header_received: false,
      settlement_verified: false,
    },
  },
  {
    id: "web-research",
    provider: "NOVA Demand Worker",
    method: "POST",
    endpoint: "https://nova-demand-worker.vercel.app/x402/web-research",
    input_example: { urls: ["https://example.com"], query: "company overview" },
    max_urls_per_request: 10,
    payment: { protocol: "x402", scheme: "exact", network: "eip155:8453", asset: "USDC" },
    code_default_price_usd: 0.05,
    price_unit: "per_request",
    deployment_status: "production_deployment_ready",
    runtime_payment_challenge_verified: false,
  },
  {
    id: "url-to-json",
    provider: "NOVA Demand Worker",
    method: "POST",
    endpoint: "https://nova-demand-worker.vercel.app/x402/url-to-json",
    input_example: { url: "https://example.com" },
    payment: { protocol: "x402", scheme: "exact", network: "eip155:8453", asset: "USDC" },
    code_default_price_usd: 0.01,
    price_unit: "per_request",
    deployment_status: "production_deployment_ready",
    runtime_payment_challenge_verified: true,
    last_challenge_tested_at: "2026-10-13",
    last_challenge_test: {
      http_status: 402,
      scheme: "exact",
      network: "eip155:8453",
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      asset_symbol: "USDC",
      amount_atomic_units: "10000",
      amount_display_usdc: "0.01",
      max_timeout_seconds: 300,
      payment_signature_sent: false,
      payment_response_header_received: false,
      settlement_verified: false,
    },
  },
] as const;

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      schema_version: "1.1",
      brand: "Profit Rescue AI",
      status: "discovery_and_two_payment_challenges_verified_marketplace_canary_settled_customer_revenue_unverified",
      generated_at: new Date().toISOString(),
      human_offers: humanOffers,
      upstream_paid_services: upstreamPaidServices,
      marketplace_canary_evidence: {
        "provider": "PayAPI Market",
        "listing_url": "https://payapi.market/api/nova-url-to-json",
        "service": "nova-url-to-json",
        "transaction_type": "marketplace_canary",
        "amount_usdc": 0.01,
        "network": "eip155:8453",
        "tx_hash": "0x5453ba9848d6c10b7fce1d11cc285e7b91fd066654798b7f4446a59c8f5f3d9a",
        "verified_at": "2026-09-20T21:58:53Z",
        "customer_revenue_proof": false
},
      bmt_local_api_services: [
        {
          id: "company-intelligence",
          method: "POST",
          endpoint: "/api/v1/intel/company",
          status: "planned",
          live: false,
          note: "Currently returns 503 API_NOT_ENABLED. Use the direct NOVA x402 endpoint listed above while BMT-local execution is not enabled.",
        },
      ],
      pricing_note:
        "NOVA prices shown here are source-code defaults and may be overridden by deployment configuration. The live x402 payment challenge is authoritative. This catalog does not claim that a payment or settlement has been tested.",
      revenue_proof_rule:
        "A route, catalog item, HTTP 402 challenge, or marketplace canary settlement is not customer revenue proof. Verify an independent buyer, execution/delivery, payment, and settlement.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
