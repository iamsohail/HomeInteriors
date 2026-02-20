export interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  city: string;
  bhkType: string;
  address: string;
  rooms: string[];
  expectedBudget?: number;
  budgetMin: number;
  budgetMax: number;
  budgetAllocations: BudgetAllocation[];
  memberUids: string[];
  pendingInvites?: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInvite {
  id: string;
  email: string;
  role: "editor" | "viewer";
  invitedBy: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
}
