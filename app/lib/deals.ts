import type { Deal, PreparedDeal } from "../types";

const AWIN_AFFILIATE_ID = "2936395";
const MAX_INDEXED_DEALS = 20;

// V1 is intentionally review-controlled so rankings cannot silently create or
// remove indexable URLs on the next feed refresh.
const V1_INDEXED_DEAL_IDS = new Set([
  "deal-662929b49df80580",
  "deal-14f5b966835d08f2",
  "deal-a4a2c16456361060",
  "deal-012e44939b85db27",
  "deal-dce4621192cb5c7d",
  "deal-93f1f897d2dde0e3",
  "deal-75a411facff7131e",
  "deal-9a09d7d275e242ce",
  "deal-8273f92ad6a09cc6",
  "deal-690360de971c126a",
  "deal-47a95f3f174cc9cb",
  "deal-dee7017717d733eb",
  "deal-c8679d065c88c4ba",
  "deal-21080845ae899fd1",
  "deal-a2d41e5aef20cf6e",
  "deal-2c3a7f407e9d0ddc",
  "deal-708fe8a95b1d155d",
  "deal-aba71ab5b66ff941",
  "deal-81fc6719ec5ab625",
  "deal-b63c6a16bcea8f3a",
]);

const TRACKING_QUERY_KEYS = new Set([
  "aa_adgroupid",
  "aa_campaignid",
  "aa_creativeid",
  "affid",
  "affiliate",
  "awinmid",
  "clickref",
  "clickref2",
  "clickref3",
  "clickref4",
  "clickref5",
  "clickref6",
  "maas",
  "ref",
  "ref_",
  "tag",
]);

export function isOffer(deal: Deal) {
  return (
    deal.dealType === "offer" ||
    deal.source.toLowerCase().includes("awin promotions")
  );
}

export function getAwinMerchantId(deal: Deal) {
  const merchant = deal.merchant?.trim().toLowerCase();
  const link = (deal.link || "").toLowerCase();

  if (merchant === "acer" || link.includes("store.acer.com")) return "12590";
  if (merchant === "box" || merchant === "box.co.uk" || link.includes("box.co.uk")) return "100685";
  if (merchant === "aliexpress" || link.includes("aliexpress.")) return "7035";
  if (merchant === "amazon" || link.includes("amazon.co.uk")) return "118045";
  if (merchant === "stormforce gaming" || merchant === "stormforce" || link.includes("stormforcegaming.co.uk")) return "24882";
  if (merchant === "quzo uk" || merchant === "quzo" || link.includes("quzo.net") || link.includes("quzo.co.uk")) return "19849";
  if (merchant === "laptop outlet" || link.includes("laptopoutlet.co.uk")) return "111534";

  return null;
}

export function isAffiliateDeal(deal: Deal) {
  return Boolean(getAwinMerchantId(deal));
}

export function getAffiliateUrl(deal: Deal, placement?: string) {
  const merchantId = getAwinMerchantId(deal);

  if (!merchantId) return deal.link || "";

  const dealId = deal.dealId || buildDealId(deal);
  const clickReference2 = placement
    ? `&clickref2=${encodeURIComponent(placement)}`
    : "";

  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${AWIN_AFFILIATE_ID}&clickref=${encodeURIComponent(
    dealId
  )}${clickReference2}&ued=${encodeURIComponent(deal.link || "")}`;
}

export function parsePrice(price: string) {
  const match = price.match(/[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?/);
  return match ? Number(match[0].replace(/,/g, "")) : Number.POSITIVE_INFINITY;
}

function normalizedMerchant(deal: Deal) {
  return (deal.merchant || deal.source || "unknown")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function canonicalProductUrl(link: string) {
  try {
    const url = new URL(link.trim());
    url.hash = "";
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";

    const keptParams = [...url.searchParams.entries()]
      .filter(([key]) => {
        const normalizedKey = key.toLowerCase();
        return !normalizedKey.startsWith("utm_") && !TRACKING_QUERY_KEYS.has(normalizedKey);
      })
      .sort(([firstKey, firstValue], [secondKey, secondValue]) => {
        const first = `${firstKey}=${firstValue}`;
        const second = `${secondKey}=${secondValue}`;
        return first < second ? -1 : first > second ? 1 : 0;
      });

    url.search = "";
    for (const [key, value] of keptParams) url.searchParams.append(key, value);

    return url.toString().replace(/\/$/, "");
  } catch {
    return link.trim().toLowerCase().replace(/#.*$/, "");
  }
}

export function getDealIdentity(deal: Deal) {
  if (isOffer(deal) && deal.offerId) {
    return `offer:${normalizedMerchant(deal)}:${deal.offerId.trim().toLowerCase()}`;
  }

  return `product:${normalizedMerchant(deal)}:${canonicalProductUrl(deal.link || deal.title)}`;
}

function fnv1a32(value: string, seed: number) {
  let hash = seed >>> 0;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

export function buildDealId(deal: Deal) {
  const identity = getDealIdentity(deal);
  return `deal-${fnv1a32(identity, 0x811c9dc5)}${fnv1a32(identity, 0x9e3779b1)}`;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-+$/, "");
}

export function buildDealSlug(deal: Deal, dealId = deal.dealId || buildDealId(deal)) {
  const titlePart = slugify(deal.cleanTitle || deal.title) || "tech-deal";
  return `${titlePart}-${dealId}`;
}

export function getRankingScore(deal: Deal) {
  if (typeof deal.rankingScore === "number") return deal.rankingScore;

  const title = `${deal.cleanTitle || deal.title} ${deal.category}`.toLowerCase();
  const discountMatch = deal.discount?.match(/-?([0-9]+)%/);
  const discountScore = discountMatch ? Math.min(Number(discountMatch[1]) || 0, 35) : 0;
  const categoryScore: Record<string, number> = {
    GPUs: 48,
    Laptops: 46,
    Gaming: 42,
    Monitors: 40,
    TVs: 38,
    SSDs: 36,
    Tablets: 35,
    Hardware: 34,
    Accessories: 8,
    Other: 0,
  };

  let score = categoryScore[deal.category] ?? 0;
  const price = parsePrice(deal.price);

  if (deal.image) score += 14;
  if (Number.isFinite(price)) score += 10;
  if (deal.oldPrice) score += 8;
  if (deal.quality.includes("GOOD PRICE")) score += 24;
  score += discountScore;

  if (/(rtx|geforce|radeon|ryzen|core i[579]|oled|qled|mini led|gaming pc|laptop|tablet|ipad|galaxy tab|monitor|nvme|ssd|ddr5|32gb|64gb|1tb|2tb)/.test(title)) score += 18;
  if (/(case|cable|adapter|sticker|screen protector|cover|stand only)/.test(title)) score -= 45;
  if (/(refurbished|renewed|open box)/.test(title)) score -= 10;
  if (deal.category === "Accessories") score -= 30;

  return score;
}

export function getRankingBand(score: number) {
  if (score >= 90) return "priority";
  if (score >= 70) return "strong";
  if (score >= 50) return "standard";
  return "low";
}

export function prepareDeal(deal: Deal): PreparedDeal {
  const dealId = deal.dealId || buildDealId(deal);
  return {
    ...deal,
    dealId,
    slug: deal.slug || buildDealSlug(deal, dealId),
    rankingScore: getRankingScore(deal),
  };
}

export function prepareDeals(deals: Deal[]) {
  return deals.map(prepareDeal);
}

function hasSpecificProductSignals(deal: Deal) {
  const title = (deal.cleanTitle || deal.title).trim();
  const words = title.match(/[a-z0-9]+/gi) || [];
  return title.length >= 18 && words.length >= 4 && /[a-z]/i.test(title);
}

function hasProductImage(deal: Deal) {
  const image = (deal.image || "").trim().toLowerCase();
  return Boolean(
    image &&
      !image.includes("/deal-placeholders/") &&
      !image.endsWith("/goblin-logo.png") &&
      !image.endsWith("/stormforce.jpg")
  );
}

export function isEligibleDealPage(deal: PreparedDeal) {
  const price = parsePrice(deal.price);
  return Boolean(
    !isOffer(deal) &&
      isAffiliateDeal(deal) &&
      Number.isFinite(price) &&
      price >= 15 &&
      price <= 10000 &&
      hasProductImage(deal) &&
      hasSpecificProductSignals(deal) &&
      !["Accessories", "Other"].includes(deal.category)
  );
}

export function getEligibleDeals(deals: PreparedDeal[], limit = MAX_INDEXED_DEALS) {
  return [...deals]
    .filter((deal) => V1_INDEXED_DEAL_IDS.has(deal.dealId) && isEligibleDealPage(deal))
    .sort((first, second) => {
      const scoreDifference = second.rankingScore - first.rankingScore;
      if (scoreDifference !== 0) return scoreDifference;
      return getCheckedTime(second) - getCheckedTime(first);
    })
    .slice(0, limit);
}

export function getCheckedTime(deal: Deal) {
  const value = new Date(deal.lastCheckedAt || deal.timestamp).getTime();
  return Number.isNaN(value) ? 0 : value;
}
