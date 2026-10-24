import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { getStoreLogo } from "../app/lib/partners.ts";
import type { Deal } from "../app/types.ts";

test("every feed product has the logo of its explicit merchant", async () => {
  const deals = JSON.parse(await readFile(new URL("../public/deals.json", import.meta.url), "utf8")) as Deal[];
  const names: Record<string, string> = { Acer: "Acer", Box: "Box.co.uk", "Box.co.uk": "Box.co.uk", AliExpress: "AliExpress", Amazon: "Amazon", "Stormforce Gaming": "Stormforce Gaming", "Quzo UK": "Quzo UK", "Laptop Outlet": "Laptop Outlet" };
  for (const deal of deals) {
    if (deal.merchant && names[deal.merchant]) {
      assert.equal(getStoreLogo(deal)?.alt, names[deal.merchant], deal.title);
    }
  }
});

test("Acer in a product URL never overrides the feed merchant", () => {
  for (const [merchant, host, expected] of [
    ["Laptop Outlet", "laptopoutlet.co.uk", "Laptop Outlet"],
    ["Box", "box.co.uk", "Box.co.uk"],
    ["Quzo UK", "quzo.co.uk", "Quzo UK"],
  ]) {
    assert.equal(getStoreLogo({ merchant, source: `${merchant} Awin Product Feed`, link: `https://${host}/acer-predator-pc.html` })?.alt, expected);
  }
});

test("missing merchant falls back to feed identity and then URL hostname", () => {
  assert.equal(getStoreLogo({ source: "Laptop Outlet Awin Product Feed", link: "https://example.com/acer-pc" })?.alt, "Laptop Outlet");
  assert.equal(getStoreLogo({ source: "Legacy", link: "https://www.laptopoutlet.co.uk/acer-pc" })?.alt, "Laptop Outlet");
  assert.equal(getStoreLogo({ source: "Legacy", link: "https://example.com/acer-pc" }), null);
});
