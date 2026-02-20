"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/lib/hooks/use-currency";
import type { CategoryBudget } from "@/lib/hooks/use-budget";

interface CategoryChartProps {
  data: CategoryBudget[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const { formatCurrency, formatCurrencyCompact } = useCurrency();
  // Only show categories with spending or allocation
  const chartData = data
    .filter((d) => d.spent > 0 || d.allocated > 0)
    .map((d) => ({
      category: d.category.replace(" / ", "/").split("/")[0],
      spent: d.spent,
      allocated: d.allocated,
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
              <XAxis
                type="number"
                tickFormatter={(v) => formatCurrencyCompact(v)}
                fontSize={11}
                tick={{ fill: "oklch(0.65 0.01 260)" }}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={85}
                fontSize={11}
                tickLine={false}
                tick={{ fill: "oklch(0.75 0.01 260)" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "spent" ? "Spent" : "Budget",
                ]}
                cursor={{ fill: "oklch(1 0 0 / 5%)" }}
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  background: "oklch(0.16 0.01 260)",
                  color: "oklch(0.95 0.005 260)",
                }}
                labelStyle={{
                  color: "oklch(0.95 0.005 260)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "oklch(0.75 0.01 260)",
                }}
              />
              <Bar
                dataKey="allocated"
                fill="hsl(var(--chart-2))"
                radius={[0, 4, 4, 0]}
                opacity={0.4}
              />
              <Bar
                dataKey="spent"
                fill="hsl(var(--chart-1))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
