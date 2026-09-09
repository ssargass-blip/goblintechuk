export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.goblintechuk.uk"
).replace(/\/$/, "");

export const canonicalUrl = `${siteUrl}/`;

export function absoluteSiteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value, canonicalUrl).toString();
}

export const siteTitle = "GoblinTechUK - UK Tech Deal Hunter";

export const siteDescription =
  "Discover the best UK tech, gaming and electronics deals from trusted retailers, with hand-picked offers, discounts and daily updates from GoblinTechUK.";
