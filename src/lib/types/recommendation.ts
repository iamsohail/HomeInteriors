export type RecommendationTier = "Budget" | "Mid-range" | "Premium";

export interface RecommendationOption {
  tier: RecommendationTier;
  vendor: string;
  product: string;
  priceRange: string; // e.g., "₹5,000 - ₹10,000"
  priceMin: number;
  priceMax: number;
  pros: string[];
  cons: string[];
  link?: string;
  selected?: boolean;
}

export interface Recommendation {
  id: string;
  category: string;
  room?: string;
  options: RecommendationOption[];
  tips: string[];
  gotchas: string[];
  selectedTier?: RecommendationTier;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
