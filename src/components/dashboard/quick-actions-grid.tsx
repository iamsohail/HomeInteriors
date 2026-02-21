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
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
              "transition-all hover:border-border hover:bg-accent/50 hover:shadow-sm"
            )}
          >
            <Icon className={cn("size-3.5", action.color)} />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
