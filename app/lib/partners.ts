import type { Deal } from "../types";

const partners = [
  { alt: "Acer", src: "/images/partners/acer.webp", aliases: ["acer", "acer uk"], host: "store.acer.com", source: "Acer UK Awin" },
  { alt: "Box.co.uk", src: "/images/partners/box.webp", aliases: ["box", "box.co.uk"], host: "box.co.uk", source: "Box.co.uk Awin" },
  { alt: "AliExpress", src: "/images/partners/aliexpress.webp", aliases: ["aliexpress"], host: "aliexpress.com", source: "AliExpress Awin" },
  { alt: "Amazon", src: "/images/partners/Amazon.svg", aliases: ["amazon"], host: "amazon.co.uk", source: "Amazon Awin" },
  { alt: "Stormforce Gaming", src: "/images/partners/stormforce.jpg", aliases: ["stormforce gaming", "stormforce"], host: "stormforcegaming.co.uk", source: "Stormforce Gaming Awin" },
  { alt: "Quzo UK", src: "/images/partners/quzo-logo.webp", aliases: ["quzo uk", "quzo"], host: "quzo.co.uk", source: "Quzo UK Awin" },
  { alt: "Laptop Outlet", src: "/images/partners/laptop-outlet.jpg", aliases: ["laptop outlet"], host: "laptopoutlet.co.uk", source: "Laptop Outlet Awin" },
];

export function getStoreLogo(deal: Pick<Deal, "merchant" | "source" | "link">) {
  const merchant = deal.merchant?.trim().toLowerCase();
  const explicit = partners.find((partner) => partner.aliases.includes(merchant || ""));
  if (explicit) return explicit;
  const source = partners.find((partner) => deal.source.toLowerCase().startsWith(partner.source.toLowerCase()));
  if (source) return source;
  try {
    const host = new URL(deal.link).hostname.toLowerCase().replace(/^www\./, "");
    return partners.find((partner) => host === partner.host || host.endsWith(`.${partner.host}`) || (partner.alt === "Quzo UK" && host === "quzo.net")) || null;
  } catch {
    return null;
  }
}
