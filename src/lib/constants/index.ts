export { EXPENSE_CATEGORIES, DEFAULT_BUDGET_ALLOCATIONS } from "./categories";
export { ROOMS, ROOM_ICONS } from "./rooms";
export { TASK_PHASES } from "./task-phases";
export {
  EXPENSE_STATUSES,
  TASK_STATUSES,
  ORDER_STATUSES,
  PAYMENT_MODES,
  PRIORITY_OPTIONS,
  STATUS_COLORS,
} from "./statuses";

// Project defaults
export const PROJECT_DEFAULTS = {
  name: "Vario Homes B1502 Interiors",
  description: "3BHK apartment interior design and furnishing",
  address: "Vario Homes, B1502, Bangalore",
  budgetMin: 1000000, // 10L
  budgetMax: 2000000, // 20L
} as const;
