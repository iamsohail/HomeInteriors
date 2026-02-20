"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/statuses";
import { useCurrency } from "@/lib/hooks/use-currency";
import { formatDateShort } from "@/lib/utils/date";
import type { Expense } from "@/lib/types/expense";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const { formatCurrency } = useCurrency();
  const recent = expenses.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No expenses yet. Import your Excel file or add manually.
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{exp.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.vendor} &middot; {formatDateShort(exp.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className={`text-xs ${STATUS_COLORS[exp.status] || ""}`}>
                    {exp.status}
                  </Badge>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatCurrency(exp.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
