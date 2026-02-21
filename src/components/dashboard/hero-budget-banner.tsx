"use client";

import {
  Wallet,
  Receipt,
  TrendingDown,
  Flame,
  Building2,
  MapPin,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { TASK_PHASES } from "@/lib/constants/task-phases";

interface HeroBudgetBannerProps {
  projectName: string;
  bhkType: string;
  city: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  monthlyBurnRate: number;
  completedPhases: number;
  formatCurrency: (amount: number) => string;
  formatCurrencyCompact: (amount: number) => string;
}

export function HeroBudgetBanner({
  projectName,
  bhkType,
  city,
  totalBudget,
  totalSpent,
  remaining,
  monthlyBurnRate,
  completedPhases,
  formatCurrency,
  formatCurrencyCompact,
}: HeroBudgetBannerProps) {
  const usedPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const gaugeColor =
    usedPercent > 90
      ? "#ef4444"
      : usedPercent > 70
        ? "#f59e0b"
        : "#22c55e";

  const gaugeData = [{ value: Math.min(usedPercent, 100), fill: gaugeColor }];
  const totalPhases = TASK_PHASES.length;
  const phasePercent = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;

  const stats = [
    {
      label: "Total Budget",
      value: formatCurrencyCompact(totalBudget),
      icon: Wallet,
    },
    {
      label: "Spent",
      value: formatCurrency(totalSpent),
      icon: Receipt,
    },
    {
      label: "Remaining",
      value: formatCurrencyCompact(remaining),
      icon: TrendingDown,
    },
    {
      label: "Monthly Burn",
      value: formatCurrencyCompact(monthlyBurnRate),
      icon: Flame,
    },
  ];

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
      {/* Project info */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">{projectName}</h2>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-xs font-medium">
          <Building2 className="size-3" />
          {bhkType}
        </span>
        {city && (
          <span className="inline-flex items-center gap-1 text-xs">
            <MapPin className="size-3" />
            {city}
          </span>
        )}
      </div>

      {/* Gauge + Stats */}
      <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Radial gauge */}
        <div className="relative h-[160px] w-[200px] shrink-0 md:h-[160px] md:w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="85%"
              innerRadius="65%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              barSize={14}
              data={gaugeData}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "oklch(1 0 0 / 8%)" }}
                dataKey="value"
                cornerRadius={7}
                angleAxisId={0}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-x-0 bottom-[20%] flex flex-col items-center">
            <span className="text-xl font-bold tabular-nums">
              {formatCurrencyCompact(totalSpent)}
            </span>
            <span className="text-xs text-muted-foreground">
              of {formatCurrencyCompact(totalBudget)}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                  <p className="truncate text-sm font-semibold tabular-nums">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase progress bar */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Phase Progress</span>
          <span>
            {completedPhases}/{totalPhases} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
            style={{ width: `${phasePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
