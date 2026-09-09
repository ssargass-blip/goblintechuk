export type Deal = {
  dealId?: string;
  slug?: string;
  title: string;
  cleanTitle?: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  category: string;
  quality: string;
  merchant?: string;
  source: string;
  link: string;
  image: string;
  timestamp: string;
  firstSeenAt?: string;
  lastCheckedAt?: string;
  dealType?: string;
  offerId?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  offerStatus?: string;
  description?: string;
  rankingScore?: number;
};

export type PreparedDeal = Deal & {
  dealId: string;
  slug: string;
  rankingScore: number;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "az" | "za";
