"use client";

import { useMemo } from "react";
import { EXPENSE_CATEGORIES, DEFAULT_BUDGET_ALLOCATIONS } from "@/lib/constants";
import type { Expense } from "@/lib/types/expense";

export interface CategoryBudget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export function useBudget(expenses: Expense[]) {
  const categoryBudgets = useMemo(() => {
    const spentByCategory: Record<string, number> = {};
    for (const exp of expenses) {
      spentByCategory[exp.category] = (spentByCategory[exp.category] || 0) + exp.total;
    }

    return EXPENSE_CATEGORIES.map((cat) => {
      const allocated = DEFAULT_BUDGET_ALLOCATIONS[cat] || 0;
      const spent = spentByCategory[cat] || 0;
      const remaining = allocated - spent;
      const percentUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
      return { category: cat, allocated, spent, remaining, percentUsed };
    });
  }, [expenses]);

  const totalAllocated = useMemo(
    () => categoryBudgets.reduce((s, b) => s + b.allocated, 0),
    [categoryBudgets]
  );

  const totalSpent = useMemo(
    () => categoryBudgets.reduce((s, b) => s + b.spent, 0),
    [categoryBudgets]
  );

  const totalRemaining = totalAllocated - totalSpent;

  // Needs vs Wants analysis
  const needsWants = useMemo(() => {
    const groups = { "Must-Have": 0, "Nice-to-Have": 0, "Can Skip": 0 };
    for (const exp of expenses) {
      const p = exp.priority || "Must-Have";
      if (p in groups) groups[p as keyof typeof groups] += exp.total;
    }
    return groups;
  }, [expenses]);

  return {
    categoryBudgets,
    totalAllocated,
    totalSpent,
    totalRemaining,
    needsWants,
  };
}
