import type { MeasurementCategory } from "@/lib/types/room";

export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  if (inches === 12) return `${feet + 1}' 0"`;
  return `${feet}' ${inches}"`;
}

export function formatMeasurement(cm: number): string {
  return `${cm} cm · ${cmToFeetInches(cm)}`;
}

export interface CategoryConfig {
  value: MeasurementCategory;
  label: string;
  icon: string;
  fields: ("width" | "height" | "depth" | "sillHeight")[];
}

export const MEASUREMENT_CATEGORIES: CategoryConfig[] = [
  { value: "wall", label: "Wall", icon: "🧱", fields: ["width", "height"] },
  {
    value: "window",
    label: "Window",
    icon: "🪟",
    fields: ["width", "height", "sillHeight"],
  },
  { value: "door", label: "Door", icon: "🚪", fields: ["width", "height"] },
  {
    value: "wardrobe",
    label: "Wardrobe",
    icon: "🗄️",
    fields: ["width", "height", "depth"],
  },
  {
    value: "counter",
    label: "Counter/Cabinet",
    icon: "🍳",
    fields: ["width", "height", "depth"],
  },
  {
    value: "fixture",
    label: "Fixture",
    icon: "🚿",
    fields: ["width", "height", "depth"],
  },
  {
    value: "custom",
    label: "Custom",
    icon: "📐",
    fields: ["width", "height", "depth"],
  },
];

const BASE_CATEGORIES: MeasurementCategory[] = [
  "wall",
  "window",
  "door",
  "wardrobe",
  "custom",
];

export function getCategoriesForRoom(roomName: string): CategoryConfig[] {
  const name = roomName.toLowerCase();
  const categories = [...BASE_CATEGORIES];

  if (name.includes("kitchen") || name.includes("utility")) {
    categories.splice(categories.indexOf("custom"), 0, "counter");
  }
  if (
    name.includes("toilet") ||
    name.includes("bathroom") ||
    name.includes("bath")
  ) {
    categories.splice(categories.indexOf("custom"), 0, "fixture");
  }

  return categories.map(
    (c) => MEASUREMENT_CATEGORIES.find((mc) => mc.value === c)!
  );
}

export function getNextLabel(
  category: MeasurementCategory,
  existingLabels: string[]
): string {
  const categoryConfig = MEASUREMENT_CATEGORIES.find(
    (c) => c.value === category
  );
  const baseName = categoryConfig?.label || "Item";
  const prefix =
    category === "wall"
      ? "Wall"
      : category === "window"
        ? "Window"
        : category === "door"
          ? "Door"
          : baseName;

  // For walls, use letters (Wall A, Wall B, ...)
  if (category === "wall") {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const letter of letters) {
      const label = `Wall ${letter}`;
      if (!existingLabels.includes(label)) return label;
    }
    return `Wall ${existingLabels.length + 1}`;
  }

  // For others, use numbers (Window 1, Door 1, ...)
  let n = 1;
  while (existingLabels.includes(`${prefix} ${n}`)) n++;
  return `${prefix} ${n}`;
}
