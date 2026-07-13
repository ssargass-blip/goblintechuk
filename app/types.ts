export type Deal = {
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
  dealType?: string;
  offerId?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  offerStatus?: string;
  description?: string;
  score?: number;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "az" | "za";
