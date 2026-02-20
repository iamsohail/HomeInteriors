export const BHK_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Villa", "Studio", "Other"] as const;
export type BHKType = (typeof BHK_TYPES)[number];

export const CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Other",
] as const;

// Default rooms by BHK type
export const ROOMS_BY_BHK: Record<string, string[]> = {
  "Studio": ["Living Area", "Kitchen", "Bathroom", "Balcony"],
  "1 BHK": ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Balcony"],
  "2 BHK": [
    "Living Room", "Dining Area",
    "Master Bedroom", "Bedroom 2",
    "Kitchen", "Bathroom 1", "Bathroom 2",
    "Balcony", "Foyer",
  ],
  "3 BHK": [
    "Living Room", "Dining Area",
    "Master Bedroom", "Bedroom 1", "Bedroom 2",
    "Kitchen & Utility",
    "Master Toilet", "Toilet 1", "Toilet 2",
    "Balcony", "Foyer",
  ],
  "4 BHK": [
    "Living Room", "Dining Area",
    "Master Bedroom", "Bedroom 1", "Bedroom 2", "Bedroom 3",
    "Kitchen & Utility",
    "Master Toilet", "Toilet 1", "Toilet 2", "Toilet 3",
    "Balcony 1", "Balcony 2", "Foyer", "Utility Room",
  ],
  "5 BHK": [
    "Living Room", "Dining Area", "Family Room",
    "Master Bedroom", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Bedroom 4",
    "Kitchen & Utility",
    "Master Toilet", "Toilet 1", "Toilet 2", "Toilet 3", "Toilet 4",
    "Balcony 1", "Balcony 2", "Foyer", "Utility Room", "Pooja Room",
  ],
  "Villa": [
    "Living Room", "Dining Area", "Family Room",
    "Master Bedroom", "Bedroom 1", "Bedroom 2", "Bedroom 3",
    "Kitchen", "Modular Kitchen",
    "Master Toilet", "Toilet 1", "Toilet 2", "Toilet 3",
    "Balcony 1", "Balcony 2", "Garden", "Foyer", "Utility Room", "Pooja Room",
    "Garage", "Terrace",
  ],
  "Other": [
    "Living Room", "Dining Area",
    "Master Bedroom", "Bedroom 1",
    "Kitchen",
    "Bathroom 1", "Bathroom 2",
    "Balcony", "Foyer",
  ],
};

// Default budget ranges by BHK (in ₹)
export const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
  "Studio": { min: 200000, max: 500000 },
  "1 BHK": { min: 300000, max: 800000 },
  "2 BHK": { min: 500000, max: 1500000 },
  "3 BHK": { min: 1000000, max: 2500000 },
  "4 BHK": { min: 1500000, max: 4000000 },
  "5 BHK": { min: 2000000, max: 6000000 },
  "Villa": { min: 3000000, max: 10000000 },
  "Other": { min: 500000, max: 2000000 },
};
