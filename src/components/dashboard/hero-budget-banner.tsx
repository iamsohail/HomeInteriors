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
  const pillColor =
    usedPercent > 90
      ? "bg-red-500/15 text-red-500"
      : usedPercent > 70
        ? "bg-amber-500/15 text-amber-500"
        : "bg-green-500/15 text-green-500";

  const stats = [
    { label: "Total Budget", value: formatCurrencyCompact(totalBudget), icon: Wallet },
    {
      label: "Spent",
      value: formatCurrencyCompact(totalSpent),
      icon: Receipt,
      pill: `${Math.round(usedPercent)}%`,
    },
    { label: "Remaining", value: formatCurrencyCompact(remaining), icon: TrendingDown },
    { label: "Monthly Burn", value: formatCurrencyCompact(monthlyBurnRate), icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card/80 px-3 py-2.5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3.5" />
              <span className="text-2xs">{stat.label}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold tabular-nums">{stat.value}</span>
              {stat.pill && (
                <span className={`rounded-full px-1.5 py-0.5 text-2xs font-semibold ${pillColor}`}>
                  {stat.pill}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
