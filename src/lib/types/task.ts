export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "On Hold" | "Skipped";

export type TaskPhase =
  | "Civil/Masonry"
  | "Electrical"
  | "Plumbing"
  | "HVAC"
  | "False Ceiling"
  | "Flooring"
  | "Painting"
  | "Carpentry"
  | "Kitchen"
  | "Bathroom Fittings"
  | "Furniture"
  | "Curtains/Blinds"
  | "Appliances"
  | "Decor"
  | "Deep Cleaning";

export interface Task {
  id: string;
  phase: TaskPhase;
  phaseOrder: number; // 1-15
  title: string;
  description: string;
  room: string;
  status: TaskStatus;
  vendor?: string;
  vendorContact?: string;
  estimatedCost?: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  dependsOn: string[]; // task IDs
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
