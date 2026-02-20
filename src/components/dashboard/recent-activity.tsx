"use client";

import { Receipt, Truck } from "lucide-react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { useCurrency } from "@/lib/hooks/use-currency";

export interface ActivityItem {
  id: string;
  type: "expense" | "order";
  description: string;
  amount: number;
  date: string; // ISO date
  status: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

function formatRelativeDate(date: string): string {
  const d = parseISO(date);
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function RecentActivity({ items }: RecentActivityProps) {
  const { formatCurrency } = useCurrency();
  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
        Recent Activity
      </h3>
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No activity yet. Start adding expenses or orders.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                {item.type === "expense" ? (
                  <Receipt className="size-4 text-muted-foreground" />
                ) : (
                  <Truck className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.description}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeDate(item.date)}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
