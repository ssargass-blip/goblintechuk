import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { getEligibleDeals, prepareDeals } from "./deals";
import type { Deal } from "../types";

export const loadDeals = cache(async function loadDeals() {
  try {
    const dealsPath = path.join(process.cwd(), "public", "deals.json");
    const rawDeals = await readFile(dealsPath, "utf8");
    const deals = JSON.parse(rawDeals) as unknown;
    return Array.isArray(deals) ? prepareDeals(deals as Deal[]) : [];
  } catch (error) {
    console.error("Failed to load deals.json", error);
    return [];
  }
});

export async function loadEligibleDeals() {
  return getEligibleDeals(await loadDeals());
}
