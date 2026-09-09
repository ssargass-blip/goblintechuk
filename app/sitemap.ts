import type { MetadataRoute } from "next";
import { loadEligibleDeals } from "./lib/deal-data";
import { absoluteSiteUrl, siteUrl } from "./lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await loadEligibleDeals();
  const dealEntries: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${siteUrl}/deals/${deal.slug}`,
    lastModified: deal.lastCheckedAt || deal.timestamp,
    changeFrequency: "daily",
    priority: 0.8,
    images: deal.image ? [absoluteSiteUrl(deal.image)] : undefined,
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...dealEntries,
  ];
}
