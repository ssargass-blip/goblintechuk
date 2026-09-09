"use client";

import type { CSSProperties, ReactNode } from "react";
import { trackDealClick } from "../lib/analytics";
import { getAffiliateUrl } from "../lib/deals";
import type { PreparedDeal } from "../types";

export function AffiliateDealLink({
  children,
  deal,
  placement = "deal_page",
  style,
}: {
  children: ReactNode;
  deal: PreparedDeal;
  placement?: "deal_page";
  style?: CSSProperties;
}) {
  return (
    <a
      href={getAffiliateUrl(deal, placement)}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => trackDealClick(deal, placement)}
      style={style}
    >
      {children}
    </a>
  );
}
