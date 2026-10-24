import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { dealSearchMetadata, escapeSitemapUrl, productBrand } from "../app/lib/seo.ts";
import { getEligibleDeals, prepareDeals } from "../app/lib/deals.ts";
import type { Deal } from "../app/types.ts";

test("all indexed deals have concise, distinct search metadata", async () => {
  const feed = JSON.parse(await readFile(new URL("../public/deals.json", import.meta.url), "utf8")) as Deal[];
  const deals = getEligibleDeals(prepareDeals(feed));
  const titles = deals.map((deal) => {
    const meta = dealSearchMetadata(deal.cleanTitle || deal.title, deal.price, deal.merchant || deal.source);
    assert.ok(meta.title.length <= 60, meta.title);
    assert.ok(meta.description.length <= 160, meta.description);
    return meta.title;
  });
  assert.equal(new Set(titles).size, deals.length);
});

test("Stormforce query separators cannot invalidate sitemap XML", () => {
  assert.equal(
    escapeSitemapUrl("https://i0.wp.com/image.webp?w=640&quality=85"),
    "https://i0.wp.com/image.webp?w=640&amp;quality=85",
  );
});

test("brand identifies the product rather than an embedded component", () => {
  assert.equal(productBrand("Refurbished Lenovo Legion 27Q-10 monitor"), "Lenovo");
  assert.equal(productBrand("NiPoGi P1 Mini PC AMD Ryzen 7330U"), "NiPoGi");
  assert.equal(productBrand("Example PC with Intel CPU"), undefined);
});
