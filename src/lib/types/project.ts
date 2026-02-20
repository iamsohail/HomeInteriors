import type { ProjectMember } from "./user";

export interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  address: string;
  budgetMin: number;
  budgetMax: number;
  budgetAllocations: BudgetAllocation[];
  members: ProjectMember[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
