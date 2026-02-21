"use client";

import Link from "next/link";
import { Plus, ListTodo, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link href="/expenses/new">
          <Plus className="size-4" />
          Add Expense
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link href="/timeline">
          <ListTodo className="size-4" />
          Add Task
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link href="/budget">
          <PieChart className="size-4" />
          View Budget
        </Link>
      </Button>
    </div>
  );
}
