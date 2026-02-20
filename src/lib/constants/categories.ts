export const EXPENSE_CATEGORIES = [
  "Civil/Masonry",
  "Electrical",
  "Plumbing",
  "HVAC/AC",
  "False Ceiling",
  "Flooring",
  "Painting",
  "Carpentry/Woodwork",
  "Kitchen",
  "Bathroom Fittings",
  "Furniture",
  "Curtains/Blinds",
  "Appliances",
  "Decor/Accessories",
  "Deep Cleaning",
  "Miscellaneous",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// Default budget allocation per category (in ₹) — total ~15L midpoint
export const DEFAULT_BUDGET_ALLOCATIONS: Record<string, number> = {
  "Civil/Masonry": 50000,
  "Electrical": 100000,
  "Plumbing": 75000,
  "HVAC/AC": 150000,
  "False Ceiling": 100000,
  "Flooring": 100000,
  "Painting": 100000,
  "Carpentry/Woodwork": 200000,
  "Kitchen": 500000,
  "Bathroom Fittings": 100000,
  "Furniture": 200000,
  "Curtains/Blinds": 50000,
  "Appliances": 150000,
  "Decor/Accessories": 50000,
  "Deep Cleaning": 15000,
  "Miscellaneous": 60000,
};
