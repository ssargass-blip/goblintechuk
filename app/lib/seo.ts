export function compactText(value: string, limit: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const prefix = text.slice(0, limit - 1);
  const boundary = prefix.lastIndexOf(" ");
  return `${prefix.slice(0, boundary > limit / 2 ? boundary : prefix.length).trimEnd()}…`;
}

export function dealSearchMetadata(name: string, price: string, merchant: string) {
  const suffix = " | GoblinTechUK";
  return {
    title: `${compactText(name, 60 - suffix.length)}${suffix}`,
    description: compactText(
      `${name} for ${price} at ${merchant}. Compare this UK deal and check the latest price and availability at the retailer.`,
      160,
    ),
  };
}

// Only identify the product manufacturer when the product title names it.
export function productBrand(title: string) {
  return title.match(/^(?:Refurbished\s+|New Open Box\s*-\s*)?(ASUS|Acer|ASRock|Gigabyte|MSI|Samsung|Western Digital|Kingston|Crucial|Team Group|SureFire|Lenovo|HP|Dell|Hisense|iiyama|NiPoGi|Microsoft|Intel|AMD|Elgato|Razer)\b/i)?.[1];
}

// Next's sitemap serializer inserts image URLs verbatim into XML.
export function escapeSitemapUrl(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
