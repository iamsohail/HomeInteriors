"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";

interface CategoryBudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

interface NeedsWants {
  "Must-Have": number;
  "Nice-to-Have": number;
  "Can Skip": number;
}

interface BudgetBreakdownProps {
  spent: number;
  remaining: number;
  categories: CategoryBudgetData[];
  needsWants: NeedsWants;
}

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  fontSize: "12px",
  border: "1px solid oklch(1 0 0 / 10%)",
  background: "oklch(0.16 0.01 260)",
  color: "oklch(0.95 0.005 260)",
};

export function BudgetBreakdown({
  spent,
  remaining,
  categories,
  needsWants,
}: BudgetBreakdownProps) {
  const { formatCurrency, formatCurrencyCompact } = useCurrency();

  const donutData = [
    { name: "Spent", value: spent, color: "hsl(var(--chart-1))" },
    { name: "Remaining", value: Math.max(remaining, 0), color: "hsl(var(--chart-2))" },
  ];

  const needsTotal = needsWants["Must-Have"] + needsWants["Nice-to-Have"] + needsWants["Can Skip"];
  const needsPct = needsTotal > 0 ? (needsWants["Must-Have"] / needsTotal) * 100 : 0;
  const wantsPct = needsTotal > 0 ? (needsWants["Nice-to-Have"] / needsTotal) * 100 : 0;
  const skipPct = needsTotal > 0 ? (needsWants["Can Skip"] / needsTotal) * 100 : 0;

  const sortedCategories = [...categories]
    .filter((c) => c.spent > 0 || c.allocated > 0)
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm">
      <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
        Budget Breakdown
      </h3>

      {/* Donut chart */}
      <div className="flex items-center justify-center">
        <div className="relative size-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "oklch(0.75 0.01 260)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold tabular-nums">
              {formatCurrencyCompact(Math.max(remaining, 0))}
            </span>
            <span className="text-xs text-muted-foreground">remaining</span>
          </div>
        </div>
      </div>

      {/* Needs vs Wants bar */}
      {needsTotal > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Needs vs Wants
          </p>
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            {needsPct > 0 && (
              <div
                className="bg-red-500/80 transition-all"
                style={{ width: `${needsPct}%` }}
                title={`Must-Have: ${Math.round(needsPct)}%`}
              />
            )}
            {wantsPct > 0 && (
              <div
                className="bg-blue-500/80 transition-all"
                style={{ width: `${wantsPct}%` }}
                title={`Nice-to-Have: ${Math.round(wantsPct)}%`}
              />
            )}
            {skipPct > 0 && (
              <div
                className="bg-gray-400/60 transition-all"
                style={{ width: `${skipPct}%` }}
                title={`Can Skip: ${Math.round(skipPct)}%`}
              />
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-2xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-red-500/80" />
              Must-Have {Math.round(needsPct)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-blue-500/80" />
              Nice-to-Have {Math.round(wantsPct)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-gray-400/60" />
              Can Skip {Math.round(skipPct)}%
            </span>
          </div>
        </div>
      )}

      {/* Category list */}
      {sortedCategories.length > 0 && (
        <ScrollArea className="mt-4 max-h-[260px]">
          <div className="space-y-2.5">
            {sortedCategories.map((cat) => {
              const overBudget = cat.spent > cat.allocated && cat.allocated > 0;
              const barPercent =
                cat.allocated > 0
                  ? Math.min((cat.spent / cat.allocated) * 100, 100)
                  : 0;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn("font-medium", overBudget && "text-red-500")}>
                      {cat.category}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrencyCompact(cat.spent)}
                      {cat.allocated > 0 && (
                        <span className="text-muted-foreground/60">
                          {" "}
                          / {formatCurrencyCompact(cat.allocated)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        overBudget
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-primary to-primary/60"
                      )}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
