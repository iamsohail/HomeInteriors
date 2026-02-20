"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/lib/hooks/use-currency";

interface BudgetDonutProps {
  spent: number;
  remaining: number;
}

export function BudgetDonut({ spent, remaining }: BudgetDonutProps) {
  const { formatCurrency } = useCurrency();
  const data = [
    { name: "Spent", value: spent, color: "hsl(var(--chart-1))" },
    { name: "Remaining", value: Math.max(remaining, 0), color: "hsl(var(--chart-2))" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative size-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    background: "oklch(0.16 0.01 260)",
                    color: "oklch(0.95 0.005 260)",
                  }}
                  itemStyle={{
                    color: "oklch(0.75 0.01 260)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ background: "hsl(var(--chart-1))" }} />
              <span className="text-muted-foreground">Spent:</span>
              <span className="font-semibold">{formatCurrency(spent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ background: "hsl(var(--chart-2))" }} />
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-semibold">{formatCurrency(remaining)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
