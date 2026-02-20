"use client";

import { useMemo } from "react";
import { Wallet, Receipt, ListChecks, Home } from "lucide-react";
import { Header } from "@/components/shared/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProjectHeader } from "@/components/dashboard/project-header";
import { PhaseTimeline } from "@/components/dashboard/phase-timeline";
import { BudgetDonut } from "@/components/dashboard/budget-donut";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RoomProgressGrid } from "@/components/dashboard/room-progress-grid";
import { RecentActivity, type ActivityItem } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useOrders } from "@/lib/hooks/use-orders";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useBudget } from "@/lib/hooks/use-budget";
import { useProject } from "@/lib/providers/project-provider";
import { useCurrency } from "@/lib/hooks/use-currency";
import { TASK_PHASES } from "@/lib/constants/task-phases";
import type { TaskStatus, TaskPhase } from "@/lib/types/task";

export default function DashboardPage() {
  const { project } = useProject();
  const { expenses, loading: expLoading } = useExpenses();
  const { orders, loading: ordLoading } = useOrders();
  const { tasks, loading: taskLoading } = useTasks();
  const { categoryBudgets, totalSpent, totalRemaining } = useBudget(expenses);
  const { formatCurrency, formatCurrencyCompact } = useCurrency();

  const loading = expLoading || ordLoading || taskLoading;

  // Phase statuses derived from tasks
  const phaseStatuses = useMemo(() => {
    const map: Record<string, TaskStatus> = {};
    for (const task of tasks) {
      const existing = map[task.phase];
      // If any task in a phase is "In Progress", phase is in progress
      // If all tasks are "Completed", phase is completed
      // Otherwise use the "most active" status
      if (!existing) {
        map[task.phase] = task.status;
      } else if (task.status === "In Progress") {
        map[task.phase] = "In Progress";
      } else if (existing === "Completed" && task.status !== "Completed") {
        map[task.phase] = task.status;
      }
    }
    return map;
  }, [tasks]);

  // Completed and current phase
  const completedPhases = useMemo(() => {
    return TASK_PHASES.filter((p) => phaseStatuses[p.name] === "Completed").length;
  }, [phaseStatuses]);

  const currentPhase = useMemo((): TaskPhase | null => {
    // First phase that is "In Progress"
    const inProgress = TASK_PHASES.find((p) => phaseStatuses[p.name] === "In Progress");
    if (inProgress) return inProgress.name;
    // Otherwise first phase not completed
    const notDone = TASK_PHASES.find((p) => phaseStatuses[p.name] !== "Completed");
    return notDone?.name ?? null;
  }, [phaseStatuses]);

  // Room progress from expenses
  const roomProgress = useMemo(() => {
    const roomMap: Record<string, { itemCount: number; totalSpent: number }> = {};
    for (const exp of expenses) {
      if (!exp.room) continue;
      if (!roomMap[exp.room]) {
        roomMap[exp.room] = { itemCount: 0, totalSpent: 0 };
      }
      roomMap[exp.room].itemCount++;
      roomMap[exp.room].totalSpent += exp.total;
    }
    const projectRooms = project?.rooms || [];
    return projectRooms.map((name) => ({
      name,
      itemCount: roomMap[name]?.itemCount || 0,
      totalSpent: roomMap[name]?.totalSpent || 0,
    }));
  }, [expenses, project?.rooms]);

  // Recent activity: merge last expenses + orders, sort by date, take 6
  const recentActivity = useMemo((): ActivityItem[] => {
    const expenseItems: ActivityItem[] = expenses.slice(0, 6).map((e) => ({
      id: e.id,
      type: "expense" as const,
      description: e.item,
      amount: e.total,
      date: e.date,
      status: e.status,
    }));
    const orderItems: ActivityItem[] = orders.slice(0, 6).map((o) => ({
      id: o.id,
      type: "order" as const,
      description: `${o.vendor} — ${o.items.slice(0, 2).join(", ")}`,
      amount: o.totalAmount,
      date: o.orderDate,
      status: o.status,
    }));
    return [...expenseItems, ...orderItems]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 6);
  }, [expenses, orders]);

  // Budget: use expectedBudget if set, otherwise totalAllocated
  const expectedBudget = project?.expectedBudget || 0;
  const budgetDisplay = expectedBudget > 0 ? expectedBudget : totalSpent + totalRemaining;
  const budgetRemaining = budgetDisplay - totalSpent;
  const budgetUsedPercent = budgetDisplay > 0 ? totalSpent / budgetDisplay : 0;

  // Active rooms count
  const activeRooms = roomProgress.filter((r) => r.itemCount > 0).length;

  // Top 3 categories for the chart
  const topCategories = useMemo(() => {
    return [...categoryBudgets]
      .filter((c) => c.spent > 0 || c.allocated > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);
  }, [categoryBudgets]);

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Project Header */}
        {project && (
          <ProjectHeader
            project={project}
            completedPhases={completedPhases}
            currentPhase={currentPhase}
          />
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Budget"
            value={formatCurrencyCompact(budgetDisplay)}
            subtitle={expectedBudget > 0 ? "Expected" : "Allocated"}
            icon={Wallet}
            progress={budgetUsedPercent}
          />
          <StatCard
            title="Spent"
            value={formatCurrency(totalSpent)}
            subtitle={`${Math.round(budgetUsedPercent * 100)}% used`}
            icon={Receipt}
          />
          <StatCard
            title="Phases Done"
            value={`${completedPhases} / ${TASK_PHASES.length}`}
            subtitle={currentPhase || "Not started"}
            icon={ListChecks}
          />
          <StatCard
            title="Rooms"
            value={`${activeRooms} / ${roomProgress.length}`}
            subtitle="active"
            icon={Home}
          />
        </div>

        {/* Phase Timeline + Budget Health */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PhaseTimeline phaseStatuses={phaseStatuses} currentPhase={currentPhase} />
          <div className="space-y-6">
            <BudgetDonut spent={totalSpent} remaining={Math.max(budgetRemaining, 0)} />
            {topCategories.length > 0 && <CategoryChart data={topCategories} />}
          </div>
        </div>

        {/* Room Progress + Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RoomProgressGrid rooms={roomProgress} />
          <RecentActivity items={recentActivity} />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </>
  );
}
