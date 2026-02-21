"use client";

import Link from "next/link";
import {
  Plus,
  ListTodo,
  Package,
  PieChart,
  CalendarClock,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Add Expense", href: "/expenses/new", icon: Plus, color: "text-green-500" },
  { label: "Add Task", href: "/timeline", icon: ListTodo, color: "text-blue-500" },
  { label: "Add Order", href: "/orders/new", icon: Package, color: "text-purple-500" },
  { label: "View Budget", href: "/budget", icon: PieChart, color: "text-amber-500" },
  { label: "View Timeline", href: "/timeline", icon: CalendarClock, color: "text-cyan-500" },
  { label: "View Rooms", href: "/rooms", icon: Home, color: "text-rose-500" },
];

export function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm",
              "transition-all hover:border-border hover:bg-accent/50 hover:shadow-sm"
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full bg-muted/50",
                "transition-colors group-hover:bg-muted"
              )}
            >
              <Icon className={cn("size-5", action.color)} />
            </div>
            <span className="text-center text-xs font-medium">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
