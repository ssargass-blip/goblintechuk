import type { PreparedDeal } from "../types";
import { getRankingBand } from "./deals.ts";

declare global {
  interface Window {
    AhrefsAnalytics?: {
      sendEvent: (eventName: string, options?: { props?: Record<string, string> }) => void;
    };
  }
}

type DealPlacement = "featured_deal" | "featured_offer" | "product_grid" | "deal_page";

export function trackDealClick(
  deal: PreparedDeal,
  placement: DealPlacement,
  trackAsTopDeal = false
) {
  const props = {
    dealId: deal.dealId,
    merchant: deal.merchant || deal.source,
    category: deal.category,
    placement,
    ranking_band: getRankingBand(deal.rankingScore),
  };

  window.AhrefsAnalytics?.sendEvent("affiliate_click", { props });

  if (trackAsTopDeal) {
    window.AhrefsAnalytics?.sendEvent("top_deal_click", { props });
  }
}
