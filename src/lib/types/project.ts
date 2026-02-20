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
  budgetMin: number;
  budgetMax: number;
  budgetAllocations: BudgetAllocation[];
  memberUids: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
