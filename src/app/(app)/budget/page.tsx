"use client";

import { Header } from "@/components/shared/header";

export default function BudgetPage() {
  return (
    <>
      <Header title="Budget Planner" description="Category-wise budget allocation" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Budget allocation, needs vs wants analysis — coming in Phase 3.
        </div>
      </div>
    </>
  );
}
