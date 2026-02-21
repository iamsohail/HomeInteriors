"use client";

import Link from "next/link";
import { Receipt, Truck, ArrowRight } from "lucide-react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants/statuses";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";

export interface EnhancedActivityItem {
  id: string;
  type: "expense" | "order";
  description: string;
  amount: number;
  date: string;
  status: string;
  secondaryInfo: string; // category for expenses, vendor for orders
}

interface RecentActivityEnhancedProps {
  items: EnhancedActivityItem[];
}

function formatRelativeDate(date: string): string {
  const d = parseISO(date);
  if (!isValid(d)) return "\u2014";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function RecentActivityEnhanced({ items }: RecentActivityEnhancedProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/40 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          Recent Activity
        </h3>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No activity yet. Start adding expenses or orders.
        </p>
      ) : (
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                {item.type === "expense" ? (
                  <Receipt className="size-4 text-muted-foreground" />
                ) : (
                  <Truck className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{item.description}</p>
                  <Badge
                    variant="ghost"
                    className={cn(
                      "shrink-0 text-2xs px-1.5 py-0",
                      STATUS_COLORS[item.status]
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {item.secondaryInfo} &middot; {formatRelativeDate(item.date)}
                </p>
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
