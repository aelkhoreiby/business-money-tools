import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://business-money-tools.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/tools/ecommerce-profit-calculator/", lastModified: new Date() },
    { url: base + "/guides/maximum-cac-for-ecommerce/", lastModified: new Date() },
    { url: base + "/guides/break-even-roas-ecommerce/", lastModified: new Date() },
    { url: base + "/guides/ecommerce-profit-vs-roas/", lastModified: new Date() },
    { url: base + "/about/", lastModified: new Date() },
    { url: base + "/privacy/", lastModified: new Date() },
    { url: base + "/terms/", lastModified: new Date() },
  ];
}
