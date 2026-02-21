"use client";

import { Wallet, Receipt, TrendingDown, Flame } from "lucide-react";

interface HeroBudgetBannerProps {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  monthlyBurnRate: number;
  formatCurrencyCompact: (amount: number) => string;
}

export function HeroBudgetBanner({
  totalBudget,
  totalSpent,
  remaining,
  monthlyBurnRate,
  formatCurrencyCompact,
}: HeroBudgetBannerProps) {
  const usedPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const spentPillColor =
    usedPercent > 90
      ? "bg-red-500/15 text-red-500"
      : usedPercent > 70
        ? "bg-amber-500/15 text-amber-500"
        : "bg-emerald-500/15 text-emerald-500";

  const stats = [
    {
      label: "Total Budget",
      value: formatCurrencyCompact(totalBudget),
      subtitle: "Expected budget",
      icon: Wallet,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Spent",
      value: formatCurrencyCompact(totalSpent),
      pill: `${Math.round(usedPercent)}% used`,
      pillColor: spentPillColor,
      icon: Receipt,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-500",
    },
    {
      label: "Remaining",
      value: formatCurrencyCompact(remaining),
      subtitle: "Available to spend",
      icon: TrendingDown,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-500",
    },
    {
      label: "Monthly Burn",
      value: formatCurrencyCompact(monthlyBurnRate),
      subtitle: "Average per month",
      icon: Flame,
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/40 bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
                  {stat.value}
                </p>
                {"subtitle" in stat && stat.subtitle && (
                  <p className="mt-1 text-2xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                )}
                {"pill" in stat && stat.pill && (
                  <span
                    className={`mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-semibold ${"pillColor" in stat ? stat.pillColor : ""}`}
                  >
                    {stat.pill}
                  </span>
                )}
              </div>
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <Icon className={`size-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
