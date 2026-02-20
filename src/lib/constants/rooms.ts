export type RoomType =
  | "Living Room"
  | "Dining Area"
  | "Master Bedroom"
  | "Bedroom 1"
  | "Bedroom 2"
  | "Kitchen & Utility"
  | "Master Toilet"
  | "Toilet 1"
  | "Toilet 2"
  | "Foyer"
  | "Balcony"
  | "Whole House";

export const ROOMS: RoomType[] = [
  "Living Room",
  "Dining Area",
  "Master Bedroom",
  "Bedroom 1",
  "Bedroom 2",
  "Kitchen & Utility",
  "Master Toilet",
  "Toilet 1",
  "Toilet 2",
  "Foyer",
  "Balcony",
  "Whole House",
];

// Actual measurements from Vario Homes B1502 floor plan
export const ROOM_MEASUREMENTS: Record<RoomType, { dimensions: string; areaSqft?: number }> = {
  "Living Room": { dimensions: "11'10\" x 20'5\"", areaSqft: 242 },
  "Dining Area": { dimensions: "8'6\" x 11'3\"", areaSqft: 96 },
  "Master Bedroom": { dimensions: "15'8\" x 11'2\" (+ Bay Window)", areaSqft: 175 },
  "Bedroom 1": { dimensions: "10'0\" x 12'0\"", areaSqft: 120 },
  "Bedroom 2": { dimensions: "10'0\" x 12'3\"", areaSqft: 123 },
  "Kitchen & Utility": { dimensions: "14'9\" x 8'0\"", areaSqft: 118 },
  "Master Toilet": { dimensions: "5'3\" x 8'2\"", areaSqft: 43 },
  "Toilet 1": { dimensions: "5'3\" x 8'2\"", areaSqft: 43 },
  "Toilet 2": { dimensions: "5'3\" x 8'2\"", areaSqft: 43 },
  "Foyer": { dimensions: "5'0\" x 5'5\"", areaSqft: 27 },
  "Balcony": { dimensions: "9'9\" x 3'4\"", areaSqft: 33 },
  "Whole House": { dimensions: "Carpet: 1132.91 sqft", areaSqft: 1133 },
};

export const ROOM_ICONS: Record<RoomType, string> = {
  "Living Room": "sofa",
  "Dining Area": "utensils",
  "Master Bedroom": "bed-double",
  "Bedroom 1": "bed-single",
  "Bedroom 2": "bed-single",
  "Kitchen & Utility": "cooking-pot",
  "Master Toilet": "bath",
  "Toilet 1": "bath",
  "Toilet 2": "bath",
  "Foyer": "door-open",
  "Balcony": "sun",
  "Whole House": "building",
};
