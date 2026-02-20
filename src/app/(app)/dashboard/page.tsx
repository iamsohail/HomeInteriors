"use client";

import { Wallet, Receipt, CreditCard, ClipboardList } from "lucide-react";
import { Header } from "@/components/shared/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { BudgetDonut } from "@/components/dashboard/budget-donut";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useOrders } from "@/lib/hooks/use-orders";
import { useBudget } from "@/lib/hooks/use-budget";
import { useProject } from "@/lib/providers/project-provider";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils/currency";

export default function DashboardPage() {
  const { project } = useProject();
  const { expenses, loading: expLoading } = useExpenses();
  const { orders, loading: ordLoading } = useOrders();
  const { categoryBudgets, totalAllocated, totalSpent, totalRemaining } =
    useBudget(expenses);

  const loading = expLoading || ordLoading;

  const activeEMIs = orders.filter((o) => o.isEMI).length;
  const totalEMIMonthly = orders
    .filter((o) => o.isEMI)
    .reduce((s, o) => s + (o.emiPerMonth || 0), 0);

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Dashboard"
        description={project?.name || "Project overview"}
      />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Budget"
            value={formatCurrencyCompact(totalAllocated)}
            subtitle="Allocated across categories"
            icon={Wallet}
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle={`${formatCurrency(totalRemaining)} remaining`}
            icon={Receipt}
          />
          <StatCard
            title="Active EMIs"
            value={`${activeEMIs} orders`}
            subtitle={activeEMIs > 0 ? `${formatCurrency(totalEMIMonthly)}/mo` : "No EMIs"}
            icon={CreditCard}
          />
          <StatCard
            title="Expenses"
            value={`${expenses.length} items`}
            subtitle={`${orders.length} orders tracked`}
            icon={ClipboardList}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetDonut spent={totalSpent} remaining={totalRemaining} />
          <CategoryChart data={categoryBudgets} />
        </div>

        <RecentExpenses expenses={expenses} />
      </div>
    </>
  );
}
