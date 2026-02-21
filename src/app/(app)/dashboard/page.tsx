"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Header } from "@/components/shared/header";
import { HeroBudgetBanner } from "@/components/dashboard/hero-budget-banner";
import {
  SmartAlertsStrip,
  type DashboardAlert,
} from "@/components/dashboard/smart-alerts-strip";
import { BudgetBreakdown } from "@/components/dashboard/budget-breakdown";
import { PhaseProgress } from "@/components/dashboard/phase-progress";
import { RoomSpendingCards } from "@/components/dashboard/room-spending-cards";
import {
  CashflowEmiWidget,
  type EmiSummary,
} from "@/components/dashboard/cashflow-emi-widget";
import {
  RecentActivityEnhanced,
  type EnhancedActivityItem,
} from "@/components/dashboard/recent-activity-enhanced";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useOrders } from "@/lib/hooks/use-orders";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useBudget } from "@/lib/hooks/use-budget";
import { useProject } from "@/lib/providers/project-provider";
import { useCurrency } from "@/lib/hooks/use-currency";
import { TASK_PHASES } from "@/lib/constants/task-phases";
import { formatDate } from "@/lib/utils/date";
import type { TaskStatus, TaskPhase } from "@/lib/types/task";

export default function DashboardPage() {
  const { project } = useProject();
  const { expenses, loading: expLoading } = useExpenses();
  const { orders, loading: ordLoading } = useOrders();
  const { tasks, loading: taskLoading } = useTasks();
  const {
    categoryBudgets,
    totalSpent,
    totalRemaining,
    needsWants,
  } = useBudget(expenses);
  const { formatCurrency, formatCurrencyCompact } = useCurrency();

  const loading = expLoading || ordLoading || taskLoading;

  // ---------- Budget ----------
  const expectedBudget = project?.expectedBudget || 0;
  const budgetDisplay = expectedBudget > 0 ? expectedBudget : totalSpent + totalRemaining;
  const budgetRemaining = budgetDisplay - totalSpent;

  // ---------- Monthly Burn Rate ----------
  const monthlyBurnRate = useMemo(() => {
    if (expenses.length === 0 || totalSpent === 0) return 0;
    const dates = expenses
      .map((e) => new Date(e.date).getTime())
      .filter((t) => !isNaN(t));
    if (dates.length === 0) return 0;
    const earliest = Math.min(...dates);
    const monthsElapsed = Math.max(
      (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 30),
      1
    );
    return totalSpent / monthsElapsed;
  }, [expenses, totalSpent]);

  // ---------- Phase Statuses ----------
  const phaseStatuses = useMemo(() => {
    const map: Record<string, TaskStatus> = {};
    for (const task of tasks) {
      const existing = map[task.phase];
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

  const completedPhases = useMemo(() => {
    return TASK_PHASES.filter((p) => phaseStatuses[p.name] === "Completed").length;
  }, [phaseStatuses]);

  const currentPhase = useMemo((): TaskPhase | null => {
    const inProgress = TASK_PHASES.find(
      (p) => phaseStatuses[p.name] === "In Progress"
    );
    if (inProgress) return inProgress.name;
    const notDone = TASK_PHASES.find(
      (p) => phaseStatuses[p.name] !== "Completed"
    );
    return notDone?.name ?? null;
  }, [phaseStatuses]);

  // ---------- Phase Costs ----------
  const phaseCosts = useMemo(() => {
    const costs: Record<string, { estimated: number; actual: number }> = {};
    for (const task of tasks) {
      if (!costs[task.phase]) {
        costs[task.phase] = { estimated: 0, actual: 0 };
      }
      costs[task.phase].estimated += task.estimatedCost || 0;
      costs[task.phase].actual += task.actualCost || 0;
    }
    return costs;
  }, [tasks]);

  // ---------- Room Progress ----------
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

  // ---------- Alerts ----------
  const alerts = useMemo((): DashboardAlert[] => {
    const result: DashboardAlert[] = [];

    // Over-budget categories
    for (const cat of categoryBudgets) {
      if (cat.allocated > 0 && cat.spent > cat.allocated) {
        result.push({
          id: `over-${cat.category}`,
          type: "error",
          message: `${cat.category} is over budget by ${formatCurrencyCompact(cat.spent - cat.allocated)}`,
        });
      }
    }

    // Pending expenses
    const pendingCount = expenses.filter(
      (e) => e.status === "Pending" || e.status === "Partially Paid"
    ).length;
    if (pendingCount > 0) {
      result.push({
        id: "pending-expenses",
        type: "warning",
        message: `${pendingCount} pending expense${pendingCount > 1 ? "s" : ""} need attention`,
      });
    }

    // Upcoming EMI payments
    const now = new Date();
    let upcomingEmiCount = 0;
    for (const order of orders) {
      if (order.isEMI && order.emiSchedule) {
        for (const emi of order.emiSchedule) {
          if (!emi.paid && new Date(emi.dueDate) > now) {
            upcomingEmiCount++;
          }
        }
      }
    }
    if (upcomingEmiCount > 0) {
      result.push({
        id: "upcoming-emi",
        type: "info",
        message: `${upcomingEmiCount} upcoming EMI payment${upcomingEmiCount > 1 ? "s" : ""}`,
      });
    }

    // Phases on hold
    const onHoldPhases = TASK_PHASES.filter(
      (p) => phaseStatuses[p.name] === "On Hold"
    );
    if (onHoldPhases.length > 0) {
      result.push({
        id: "blocked-phases",
        type: "info",
        message: `${onHoldPhases.length} phase${onHoldPhases.length > 1 ? "s" : ""} on hold`,
      });
    }

    return result;
  }, [categoryBudgets, expenses, orders, phaseStatuses, formatCurrencyCompact]);

  // ---------- EMI Summary ----------
  const emiSummary = useMemo((): EmiSummary => {
    let totalOrdersValue = 0;
    let totalPaid = 0;
    let monthlyEmi = 0;
    const upcomingPayments: EmiSummary["upcomingPayments"] = [];
    const orderBars: EmiSummary["orderBars"] = [];
    const now = new Date();

    for (const order of orders) {
      totalOrdersValue += order.totalAmount;
      totalPaid += order.amountPaid;

      orderBars.push({
        vendor: order.vendor,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        amountPaid: order.amountPaid,
      });

      if (order.isEMI && order.emiSchedule) {
        monthlyEmi += order.emiPerMonth || 0;
        for (const emi of order.emiSchedule) {
          if (!emi.paid) {
            const dueDate = new Date(emi.dueDate);
            upcomingPayments.push({
              vendor: order.vendor,
              dueDate: formatDate(emi.dueDate),
              amount: emi.amount,
              isOverdue: dueDate < now,
            });
          }
        }
      }
    }

    // Sort upcoming: overdue first, then by date
    upcomingPayments.sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    });

    return {
      totalOrdersValue,
      totalPaid,
      outstanding: totalOrdersValue - totalPaid,
      monthlyEmi,
      upcomingPayments,
      orderBars,
    };
  }, [orders]);

  // ---------- Recent Activity (enhanced) ----------
  const recentActivity = useMemo((): EnhancedActivityItem[] => {
    const expenseItems: EnhancedActivityItem[] = expenses.slice(0, 6).map((e) => ({
      id: e.id,
      type: "expense" as const,
      description: e.item,
      amount: e.total,
      date: e.date,
      status: e.status,
      secondaryInfo: e.category,
    }));
    const orderItems: EnhancedActivityItem[] = orders.slice(0, 6).map((o) => ({
      id: o.id,
      type: "order" as const,
      description: `${o.vendor} — ${o.items.slice(0, 2).join(", ")}`,
      amount: o.totalAmount,
      date: o.orderDate,
      status: o.status,
      secondaryInfo: o.vendor,
    }));
    return [...expenseItems, ...orderItems]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 6);
  }, [expenses, orders]);

  // ---------- Header ----------
  const headerDescription = project
    ? [project.bhkType, project.city].filter(Boolean).join(" \u00b7 ")
    : undefined;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Link
        href="/expenses"
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="size-3.5" />
        Add Expense
      </Link>
      <Link
        href="/emis"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
      >
        <Package className="size-3.5" />
        Add Order
      </Link>
    </div>
  );

  // ---------- Loading skeleton ----------
  if (loading) {
    return (
      <>
        <Header title="Dashboard" description={headerDescription} actions={headerActions} />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-2xl" />
            ))}
          </div>
          {/* Widget grids */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-[380px] rounded-2xl" />
            <Skeleton className="h-[380px] rounded-2xl" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-[280px] rounded-2xl" />
            <Skeleton className="h-[280px] rounded-2xl" />
          </div>
          <Skeleton className="h-[250px] rounded-2xl" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" description={headerDescription} actions={headerActions} />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {/* KPI Stats Row */}
        {project && (
          <HeroBudgetBanner
            totalBudget={budgetDisplay}
            totalSpent={totalSpent}
            remaining={budgetRemaining}
            monthlyBurnRate={monthlyBurnRate}
            formatCurrencyCompact={formatCurrencyCompact}
          />
        )}

        {/* Smart Alerts */}
        {alerts.length > 0 && <SmartAlertsStrip alerts={alerts} />}

        {/* Budget + Phase */}
        <div className="grid gap-4 lg:grid-cols-2">
          <BudgetBreakdown
            spent={totalSpent}
            remaining={budgetRemaining}
            categories={categoryBudgets}
            needsWants={needsWants}
          />
          <PhaseProgress
            phaseStatuses={phaseStatuses}
            currentPhase={currentPhase}
            phaseCosts={phaseCosts}
          />
        </div>

        {/* Room Spending + Cash Flow */}
        <div className="grid gap-4 lg:grid-cols-2">
          <RoomSpendingCards rooms={roomProgress} />
          <CashflowEmiWidget emiSummary={emiSummary} />
        </div>

        {/* Recent Activity */}
        <RecentActivityEnhanced items={recentActivity} />
      </div>
    </>
  );
}
