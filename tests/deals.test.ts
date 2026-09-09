import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { trackDealClick } from "../app/lib/analytics.ts";
import {
  buildDealId,
  canonicalProductUrl,
  getAffiliateUrl,
  getEligibleDeals,
  prepareDeal,
  prepareDeals,
} from "../app/lib/deals.ts";
import type { Deal } from "../app/types.ts";

const fixture: Deal = {
  title: "Example SSD £99",
  cleanTitle: "Example SSD",
  price: "£99",
  category: "SSDs",
  quality: "Worth Checking",
  source: "Box Product Feed",
  merchant: "Box",
  link: "https://www.box.co.uk/product/abc?utm_source=test",
  image: "https://cdn.example.com/ssd.jpg",
  timestamp: "2026-09-09T10:00:00",
};

test("deal IDs stay stable when title and price change", () => {
  const changed = { ...fixture, title: "Renamed SSD", price: "£79" };
  assert.equal(buildDealId(changed), buildDealId(fixture));
  assert.equal(buildDealId(fixture), "deal-f291e944a4d84e18");
});

test("canonical URLs remove tracking but preserve product variants", () => {
  assert.equal(canonicalProductUrl(fixture.link), "https://box.co.uk/product/abc");
  assert.equal(
    canonicalProductUrl("https://www.stormforcegaming.co.uk/product/laptop/?attribute_choose-your-spec=32GB+RAM%2C+2TB+SSD&utm_source=test"),
    "https://stormforcegaming.co.uk/product/laptop?attribute_choose-your-spec=32GB+RAM%2C+2TB+SSD"
  );
});

test("existing persisted slugs are preserved", () => {
  const prepared = prepareDeal({ ...fixture, slug: "original-stable-slug" });
  assert.equal(prepared.slug, "original-stable-slug");
});

test("affiliate URLs continue to route through Awin", () => {
  const deal = prepareDeal(fixture);
  const url = new URL(getAffiliateUrl(deal, "deal_page"));
  assert.equal(url.hostname, "www.awin1.com");
  assert.equal(url.searchParams.get("awinmid"), "100685");
  assert.equal(url.searchParams.get("awinaffid"), "2936395");
  assert.equal(url.searchParams.get("clickref"), deal.dealId);
  assert.equal(url.searchParams.get("clickref2"), "deal_page");
  assert.equal(url.searchParams.get("ued"), fixture.link);
});

test("featured affiliate clicks emit funnel events with useful metadata", () => {
  const sent: Array<{ name: string; options?: { props?: Record<string, string> } }> = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      AhrefsAnalytics: {
        sendEvent: (name: string, options?: { props?: Record<string, string> }) =>
          sent.push({ name, options }),
      },
    },
  });

  const deal = prepareDeal(fixture);
  trackDealClick(deal, "featured_deal", true);

  assert.deepEqual(sent.map((event) => event.name), ["affiliate_click", "top_deal_click"]);
  assert.equal(sent[0].options?.props?.dealId, deal.dealId);
  assert.equal(sent[0].options?.props?.merchant, "Box");
  assert.equal(sent[0].options?.props?.category, "SSDs");
  assert.equal(sent[0].options?.props?.placement, "featured_deal");
  assert.ok(sent[0].options?.props?.ranking_band);

  Reflect.deleteProperty(globalThis, "window");
});

test("indexed V1 deal pages are capped and contain only eligible products", async () => {
  const raw = JSON.parse(await readFile(new URL("../public/deals.json", import.meta.url), "utf8")) as Deal[];
  const eligible = getEligibleDeals(prepareDeals(raw));
  assert.equal(eligible.length, 20);
  assert.ok(eligible.every((deal) => deal.dealType !== "offer"));
  assert.ok(eligible.every((deal) => !["Accessories", "Other"].includes(deal.category)));
  assert.equal(new Set(eligible.map((deal) => deal.slug)).size, eligible.length);
});
