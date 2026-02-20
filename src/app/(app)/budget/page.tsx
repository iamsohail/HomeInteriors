"use client";

import { Header } from "@/components/shared/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useBudget } from "@/lib/hooks/use-budget";
import { useCurrency } from "@/lib/hooks/use-currency";
import { STATUS_COLORS } from "@/lib/constants/statuses";

export default function BudgetPage() {
  const { expenses, loading } = useExpenses();
  const { categoryBudgets, totalAllocated, totalSpent, totalRemaining, needsWants } =
    useBudget(expenses);
  const { formatCurrency } = useCurrency();

  if (loading) {
    return (
      <>
        <Header title="Budget Planner" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </>
    );
  }

  const niceToHaveSavings = needsWants["Nice-to-Have"] + needsWants["Can Skip"];

  return (
    <>
      <Header title="Budget Planner" description="Category-wise allocation & needs vs wants" />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Allocated</p>
              <p className="text-xl font-bold">{formatCurrency(totalAllocated)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-xl font-bold ${totalRemaining < 0 ? "text-destructive" : ""}`}>
                {formatCurrency(totalRemaining)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">% Used</p>
              <p className="text-xl font-bold">
                {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Needs vs Wants Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Needs vs Wants Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={STATUS_COLORS["Must-Have"]}>Must-Have</Badge>
                <span className="font-semibold">{formatCurrency(needsWants["Must-Have"])}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={STATUS_COLORS["Nice-to-Have"]}>Nice-to-Have</Badge>
                <span className="font-semibold">{formatCurrency(needsWants["Nice-to-Have"])}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Badge className={STATUS_COLORS["Can Skip"]}>Can Skip</Badge>
                <span className="font-semibold">{formatCurrency(needsWants["Can Skip"])}</span>
              </div>
            </div>
            {niceToHaveSavings > 0 && (
              <p className="text-sm text-muted-foreground">
                Skipping all Nice-to-Have and Can Skip items would save{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(niceToHaveSavings)}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category-wise Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBudgets.map((b) => (
                <div key={b.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{b.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(b.spent)} / {formatCurrency(b.allocated)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(b.percentUsed, 100)}
                    className="h-2"
                  />
                  {b.percentUsed > 100 && (
                    <p className="text-xs text-destructive">
                      Over budget by {formatCurrency(Math.abs(b.remaining))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
