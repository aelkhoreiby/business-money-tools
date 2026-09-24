import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Trend = {
  title: string;
  traffic: string;
  published: string;
  link: string;
  source: string;
  geo: string;
  rank: number;
};

function textOf(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

function unescapeHtml(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function parseRss(xml: string, geo: string): Trend[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m, i) => {
    const item = m[1];
    return {
      title: unescapeHtml(textOf(item, "title")),
      traffic: unescapeHtml(textOf(item, "ht:approx_traffic") || textOf(item, "approx_traffic")),
      published: textOf(item, "pubDate"),
      link: textOf(item, "link"),
      source: "google-trends",
      geo,
      rank: i + 1
    };
  }).filter(x => x.title);
}

export async function GET(req: NextRequest) {
  const geo = (req.nextUrl.searchParams.get("geo") || "US").toUpperCase();
  const allowed = /^[A-Z]{2}$/.test(geo) ? geo : "US";
  const url = `https://trends.google.com/trending/rss?geo=${allowed}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "user-agent": "Mozilla/5.0 NOVA-Trend-API/1.0" }
    });
    if (!res.ok) throw new Error(`Google Trends returned ${res.status}`);
    const xml = await res.text();
    const trends = parseRss(xml, allowed);

    return NextResponse.json({
      ok: true,
      product: "trend-opportunity",
      generatedAt: new Date().toISOString(),
      geo: allowed,
      count: trends.length,
      trends,
      meta: {
        source: "Google Trends RSS",
        mode: "live",
        pricePlan: "per-request",
        intendedConsumers: ["AI agents", "research agents", "content agents", "market-intelligence agents"]
      }
    }, { headers: { "Cache-Control": "no-store" }});
  } catch (error) {
    return NextResponse.json({
      ok: false,
      product: "trend-opportunity",
      error: String(error instanceof Error ? error.message : error)
    }, { status: 502 });
  }
}
