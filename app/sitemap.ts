import type { MetadataRoute } from "next";

const BASE = "https://tubelesslab.com";
const PATHS = ["", "/links", "/privacidade", "/termos", "/strava", "/strava/en", "/exclusao-de-dados"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({ url: `${BASE}${p}` }));
}
