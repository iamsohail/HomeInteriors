"use client";

import { CreditCard, CalendarClock } from "lucide-react";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { Order, EMISchedule } from "@/lib/types/emi";

export interface EmiSummary {
  totalOrdersValue: number;
  totalPaid: number;
  outstanding: number;
  monthlyEmi: number;
  upcomingPayments: {
    vendor: string;
    dueDate: string;
    amount: number;
    isOverdue: boolean;
  }[];
  orderBars: {
    vendor: string;
    orderId: string;
    totalAmount: number;
    amountPaid: number;
  }[];
}

interface CashflowEmiWidgetProps {
  emiSummary: EmiSummary;
}

export function CashflowEmiWidget({ emiSummary }: CashflowEmiWidgetProps) {
  const { formatCurrency, formatCurrencyCompact } = useCurrency();

  const {
    totalOrdersValue,
    totalPaid,
    outstanding,
    monthlyEmi,
    upcomingPayments,
    orderBars,
  } = emiSummary;

  const isEmpty = totalOrdersValue === 0;

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-4">
        <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
          Cash Flow / EMI
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CreditCard className="mb-2 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No orders yet. Add orders to track payments and EMIs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
        Cash Flow / EMI
      </h3>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/20 px-3 py-2 text-center">
          <p className="text-2xs text-muted-foreground">Orders Value</p>
          <p className="text-sm font-semibold tabular-nums">
            {formatCurrencyCompact(totalOrdersValue)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/20 px-3 py-2 text-center">
          <p className="text-2xs text-muted-foreground">Total Paid</p>
          <p className="text-sm font-semibold tabular-nums text-green-500">
            {formatCurrencyCompact(totalPaid)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/20 px-3 py-2 text-center">
          <p className="text-2xs text-muted-foreground">Outstanding</p>
          <p className="text-sm font-semibold tabular-nums text-amber-500">
            {formatCurrencyCompact(outstanding)}
          </p>
        </div>
      </div>

      {/* Monthly EMI pill */}
      {monthlyEmi > 0 && (
        <div className="mt-3 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500">
            <CalendarClock className="size-4" />
            Monthly EMI: {formatCurrency(monthlyEmi)}
          </div>
        </div>
      )}

      {/* Upcoming payments */}
      {upcomingPayments.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Upcoming Payments
          </p>
          <div className="space-y-2">
            {upcomingPayments.slice(0, 3).map((payment, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2"
              >
                <div
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    payment.isOverdue ? "bg-red-500" : "bg-blue-500"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{payment.vendor}</p>
                  <p className="text-2xs text-muted-foreground">
                    {payment.dueDate}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMI order bars */}
      {orderBars.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Order Payments
          </p>
          <div className="space-y-2.5">
            {orderBars.map((order) => {
              const paidPct =
                order.totalAmount > 0
                  ? (order.amountPaid / order.totalAmount) * 100
                  : 0;
              return (
                <div key={order.orderId}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate font-medium">{order.vendor}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {Math.round(paidPct)}%
                    </span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted/40">
                    <div
                      className="rounded-full bg-green-500/80 transition-all"
                      style={{ width: `${paidPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
