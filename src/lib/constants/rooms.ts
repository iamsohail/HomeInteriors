import type { RoomType } from "@/lib/types/room";

export const ROOMS: RoomType[] = [
  "Living Room",
  "Master Bedroom",
  "Bedroom 2",
  "Bedroom 3",
  "Kitchen",
  "Bathroom 1",
  "Bathroom 2",
  "Bathroom 3",
  "Balcony 1",
  "Balcony 2",
  "Entrance/Foyer",
  "Utility/Service",
  "Pooja Room",
  "Common Areas",
  "Whole House",
];

export const ROOM_ICONS: Record<RoomType, string> = {
  "Living Room": "sofa",
  "Master Bedroom": "bed-double",
  "Bedroom 2": "bed-single",
  "Bedroom 3": "bed-single",
  "Kitchen": "cooking-pot",
  "Bathroom 1": "bath",
  "Bathroom 2": "bath",
  "Bathroom 3": "bath",
  "Balcony 1": "sun",
  "Balcony 2": "sun",
  "Entrance/Foyer": "door-open",
  "Utility/Service": "wrench",
  "Pooja Room": "flame",
  "Common Areas": "home",
  "Whole House": "building",
};
