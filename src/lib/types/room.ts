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
