"use client";

import { Header } from "@/components/shared/header";

export default function ExpensesPage() {
  return (
    <>
      <Header title="Expenses" description="Track all interior expenses" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Expense tracker with DataTable, filters, and Excel import — coming in Phase 2.
        </div>
      </div>
    </>
  );
}
