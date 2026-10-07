import crypto from "node:crypto";

export type WebsiteAuditResult = {
  url: string;
  finalUrl?: string;
  httpCode?: number;
  loadTime?: number;
  pageSize?: number;
  score?: number;
  grade?: string;
  scores?: Record<string, number>;
  quickStats?: Record<string, unknown>;
  metrics?: Record<string, Array<{
    label?: string;
    value?: string;
    status?: string;
    details?: string;
    priority?: boolean;
  }>>;
};

const PROVIDER_URL = "https://seoinspectorhub.com/";

function clean(value: unknown, max = 500) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .slice(0, max);
}

export async function runWebsiteAudit(url: string): Promise<WebsiteAuditResult> {
  let parsed: URL;
  try {
    parsed = new URL(String(url).trim());
  } catch {
    throw new Error("INVALID_WEBSITE_URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("UNSUPPORTED_URL_SCHEME");
  const endpoint = PROVIDER_URL + "?action=audit&url=" + encodeURIComponent(parsed.toString());
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });
  const text = await response.text();
  let payload: WebsiteAuditResult | null = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!response.ok || !payload?.url || !payload?.metrics) {
    throw new Error("SEO_AUDIT_PROVIDER_FAILED:" + response.status);
  }
  return payload;
}

function pdfEscape(value: string) {
  return clean(value, 900).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, max = 92) {
  const words = clean(text, 400).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? current + " " + word : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function buildWebsiteAuditPdf(report: WebsiteAuditResult, orderId: string, profitReport?: { profit:number; margin:number; maxCac:number; breakEvenRoas:number; breakEvenPrice:number; decision:string; leaks:string[]; actions:string[]; currency:string }) {
  const score = Number.isFinite(Number(report.score)) ? Number(report.score) : 0;
  const aeo = Number.isFinite(Number(report.scores?.aeo)) ? Number(report.scores?.aeo) : 0;
  const geo = Number.isFinite(Number(report.scores?.geo)) ? Number(report.scores?.geo) : 0;
  const lines: string[] = [
    "PROFIT RESCUE AI",
    "AI VISIBILITY & REVENUE LEAK AUDIT",
    "Order: " + orderId,
    "Generated: " + new Date().toISOString(),
    "",
    "WEBSITE",
    clean(report.finalUrl || report.url, 300),
    "HTTP: " + clean(report.httpCode ?? ""),
    "Load time: " + clean(report.loadTime ?? "") + " ms",
    "Page size: " + clean(report.pageSize ?? "") + " bytes",
    "",
    "OVERALL SCORE: " + score + "/100",
    "GRADE: " + clean(report.grade || "N/A"),
    "AEO SCORE: " + aeo + "/100",
    "GEO SCORE: " + geo + "/100",
    "",
    "PRIORITY FINDINGS",
  ];

  const metrics = report.metrics || {};
  const findings = Object.values(metrics).flatMap(items =>
    Array.isArray(items) ? items : []
  ).filter(item => item?.status === "fail" || item?.status === "warn")
   .sort((a, b) => Number(Boolean(b?.priority)) - Number(Boolean(a?.priority)));

  const topFindings = findings.slice(0, 18);
  if (!topFindings.length) {
    lines.push("No failed or warning checks were returned by the audit engine.");
  } else {
    for (const item of topFindings) {
      lines.push((item.status || "INFO").toUpperCase() + " | " + clean(item.label || "Check"));
      lines.push(...wrap(clean(item.value || "", 300), 88));
      if (item.details) lines.push(...wrap(clean(item.details, 450), 88));
      lines.push("");
    }
  }

  if (profitReport) {
    lines.push("REVENUE LEAK DIAGNOSTIC");
    lines.push("Net profit/order: " + clean(profitReport.currency) + " " + Number(profitReport.profit || 0).toFixed(2));
    lines.push("Net contribution margin: " + Number(profitReport.margin || 0).toFixed(2) + "%");
    lines.push("Max safe CAC: " + clean(profitReport.currency) + " " + Number(profitReport.maxCac || 0).toFixed(2));
    lines.push("Break-even ROAS: " + (profitReport.breakEvenRoas ? Number(profitReport.breakEvenRoas).toFixed(2) + "x" : "-"));
    lines.push("Break-even price: " + clean(profitReport.currency) + " " + Number(profitReport.breakEvenPrice || 0).toFixed(2));
    lines.push("Decision: " + clean(profitReport.decision));
    lines.push("");
    lines.push("TOP REVENUE LEAKS");
    for (const item of (profitReport.leaks || []).slice(0,3)) lines.push("- " + clean(item,300));
    lines.push("");
    lines.push("PRIORITIZED REVENUE ACTIONS");
    for (const item of (profitReport.actions || []).slice(0,3)) lines.push("- " + clean(item,300));
    lines.push("");
  }

  lines.push("CATEGORY SUMMARY");
  for (const [category, items] of Object.entries(metrics)) {
    const arr = Array.isArray(items) ? items : [];
    const scored = arr.filter(x => x?.status && x.status !== "info");
    const passed = scored.filter(x => x.status === "pass").length;
    const catScore = scored.length ? Math.round((passed / scored.length) * 100) : 0;
    lines.push(clean(category, 80) + ": " + catScore + "/100 (" + passed + "/" + scored.length + " checks passed)");
  }

  lines.push(
    "",
    "DELIVERY NOTE",
    "This report combines public website/AI-visibility evidence with a deterministic order-economics diagnostic based on buyer-submitted figures.",
    "It does not guarantee search rankings, traffic, conversions, or revenue uplift.",
    "The buyer confirmed they own, manage, or have permission to audit the submitted site."
  );

  const perPage = 42;
  const chunks: string[][] = [];
  for (let i = 0; i < lines.length; i += perPage) chunks.push(lines.slice(i, i + perPage));

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  const addObject = (id: number, body: string) => {
    offsets[id] = Buffer.byteLength(pdf, "utf8");
    pdf += id + " 0 obj\n" + body + "\nendobj\n";
  };

  addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
  const pageIds = chunks.map((_, i) => 3 + i * 2);
  const contentIds = chunks.map((_, i) => 4 + i * 2);
  const fontId = 3 + chunks.length * 2;
  addObject(2, "<< /Type /Pages /Kids [" + pageIds.map(id => id + " 0 R").join(" ") + "] /Count " + pageIds.length + " >>");

  for (let i = 0; i < chunks.length; i++) {
    const rows = chunks[i];
    let stream = "BT\n/F1 16 Tf\n50 760 Td\n(" + pdfEscape(rows[0]) + ") Tj\n/F1 10 Tf\n0 -24 Td\n";
    for (let j = 1; j < rows.length; j++) {
      stream += "(" + pdfEscape(rows[j]) + ") Tj\n0 -14 Td\n";
    }
    stream += "ET\n";
    addObject(contentIds[i], "<< /Length " + Buffer.byteLength(stream, "utf8") + " >>\nstream\n" + stream + "endstream");
    addObject(pageIds[i], "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 " + fontId + " 0 R >> >> /Contents " + contentIds[i] + " 0 R >>");
  }

  addObject(fontId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const maxObject = fontId;
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += "xref\n0 " + (maxObject + 1) + "\n0000000000 65535 f \n";
  for (let i = 1; i <= maxObject; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += "trailer\n<< /Size " + (maxObject + 1) + " /Root 1 0 R >>\n";
  pdf += "startxref\n" + xrefOffset + "\n%%EOF\n";
  return Buffer.from(pdf, "utf8");
}
