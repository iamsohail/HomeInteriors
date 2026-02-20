export type RoomType =
  | "Living Room"
  | "Master Bedroom"
  | "Bedroom 2"
  | "Bedroom 3"
  | "Kitchen"
  | "Bathroom 1"
  | "Bathroom 2"
  | "Bathroom 3"
  | "Balcony 1"
  | "Balcony 2"
  | "Entrance/Foyer"
  | "Utility/Service"
  | "Common Areas"
  | "Pooja Room"
  | "Whole House";

export interface Room {
  id: string;
  name: RoomType;
  description: string;
  measurements?: {
    length?: number;
    width?: number;
    height?: number;
    area?: number;
  };
  checklist: ChecklistItem[];
  photos: RoomPhoto[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  category: string;
}

export interface RoomPhoto {
  url: string;
  caption: string;
  type: "inspiration" | "progress" | "completed";
  uploadedAt: Date;
}
