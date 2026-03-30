import type { MetadataRoute } from "next";

const BASE_URL = "https://autotoj.tj";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/parts`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/rental`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/logbook`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
  ];

  // Dynamic pages would be fetched from API here
  // For now return static pages
  // TODO: Fetch ads, parts, rental, services from API and add URLs

  return staticPages;
}
