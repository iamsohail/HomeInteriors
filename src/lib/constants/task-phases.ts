import type { TaskPhase } from "@/lib/types/task";

export interface PhaseConfig {
  order: number;
  name: TaskPhase;
  description: string;
  dependsOn: number[]; // phase orders that must complete first
  estimatedDays: number;
  color: string;
}

export const TASK_PHASES: PhaseConfig[] = [
  {
    order: 1,
    name: "Civil/Masonry",
    description: "Wall modifications, demolition, partition walls, waterproofing",
    dependsOn: [],
    estimatedDays: 14,
    color: "#8B4513",
  },
  {
    order: 2,
    name: "Electrical",
    description: "Wiring, switch points, DB box, fan/light points, AC points",
    dependsOn: [1],
    estimatedDays: 10,
    color: "#FFD700",
  },
  {
    order: 3,
    name: "Plumbing",
    description: "Water supply lines, drainage, bathroom fittings rough-in",
    dependsOn: [1],
    estimatedDays: 7,
    color: "#4169E1",
  },
  {
    order: 4,
    name: "HVAC",
    description: "AC installation, copper piping, drain lines, outdoor units",
    dependsOn: [2],
    estimatedDays: 5,
    color: "#00CED1",
  },
  {
    order: 5,
    name: "False Ceiling",
    description: "Gypsum/POP false ceiling, cove lighting, peripheral",
    dependsOn: [2, 4],
    estimatedDays: 10,
    color: "#DDA0DD",
  },
  {
    order: 6,
    name: "Flooring",
    description: "Tile/marble/wooden flooring, skirting, threshold",
    dependsOn: [1, 3],
    estimatedDays: 12,
    color: "#D2691E",
  },
  {
    order: 7,
    name: "Painting",
    description: "Primer, putty, paint coats (walls + ceiling), texture/accent walls",
    dependsOn: [5, 6],
    estimatedDays: 10,
    color: "#FF6347",
  },
  {
    order: 8,
    name: "Carpentry",
    description: "Wardrobes, TV unit, shoe rack, storage units, doors",
    dependsOn: [7],
    estimatedDays: 21,
    color: "#8B6914",
  },
  {
    order: 9,
    name: "Kitchen",
    description: "Modular kitchen installation, countertop, backsplash, chimney, hob",
    dependsOn: [3, 7],
    estimatedDays: 14,
    color: "#FF8C00",
  },
  {
    order: 10,
    name: "Bathroom Fittings",
    description: "Sanitaryware, CP fittings, shower, vanity, mirrors, accessories",
    dependsOn: [3, 6, 7],
    estimatedDays: 7,
    color: "#5F9EA0",
  },
  {
    order: 11,
    name: "Furniture",
    description: "Sofa, dining table, beds, study table, bookshelves",
    dependsOn: [7],
    estimatedDays: 14,
    color: "#6B8E23",
  },
  {
    order: 12,
    name: "Curtains/Blinds",
    description: "Curtain rods, curtains, blinds, sheers",
    dependsOn: [7],
    estimatedDays: 5,
    color: "#9370DB",
  },
  {
    order: 13,
    name: "Appliances",
    description: "Washing machine, refrigerator, microwave, water purifier, geyser",
    dependsOn: [2, 3],
    estimatedDays: 3,
    color: "#708090",
  },
  {
    order: 14,
    name: "Decor",
    description: "Wall art, plants, rugs, lamps, accessories, soft furnishing",
    dependsOn: [8, 11],
    estimatedDays: 7,
    color: "#DB7093",
  },
  {
    order: 15,
    name: "Deep Cleaning",
    description: "Post-construction deep clean of entire apartment",
    dependsOn: [8, 9, 10, 11, 12, 13, 14],
    estimatedDays: 2,
    color: "#20B2AA",
  },
];
