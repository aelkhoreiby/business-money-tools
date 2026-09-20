import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://business-money-tools.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/tools/ecommerce-profit-calculator/", lastModified: new Date() },
    { url: base + "/tools/break-even-roas-calculator/", lastModified: new Date() },
    { url: base + "/tools/maximum-cac-calculator/", lastModified: new Date() },
    { url: base + "/guides/ecommerce-profit-vs-roas/", lastModified: new Date() },
  ];
}
