"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CreditCard,
  Pause,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertType = "error" | "warning" | "info";

export interface DashboardAlert {
  id: string;
  type: AlertType;
  message: string;
}

interface SmartAlertsStripProps {
  alerts: DashboardAlert[];
}

const alertConfig: Record<
  AlertType,
  { icon: LucideIcon; border: string; bg: string; text: string }
> = {
  error: {
    icon: AlertTriangle,
    border: "border-l-red-500",
    bg: "bg-red-500/10",
    text: "text-red-500",
  },
  warning: {
    icon: Clock,
    border: "border-l-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  info: {
    icon: CreditCard,
    border: "border-l-blue-500",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
};

// Choose the right icon based on message content
function getAlertIcon(alert: DashboardAlert): LucideIcon {
  if (alert.type === "error") return AlertTriangle;
  if (alert.message.toLowerCase().includes("emi") || alert.message.toLowerCase().includes("payment"))
    return CreditCard;
  if (alert.message.toLowerCase().includes("blocked") || alert.message.toLowerCase().includes("hold"))
    return Pause;
  return alertConfig[alert.type].icon;
}

export function SmartAlertsStrip({ alerts }: SmartAlertsStripProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      {visible.map((alert) => {
        const config = alertConfig[alert.type];
        const Icon = getAlertIcon(alert);
        return (
          <div
            key={alert.id}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg border-l-4 px-3 py-2 text-sm",
              config.border,
              config.bg
            )}
          >
            <Icon className={cn("size-4 shrink-0", config.text)} />
            <span className="whitespace-nowrap">{alert.message}</span>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
              className="ml-1 shrink-0 rounded p-0.5 transition-colors hover:bg-muted/50"
            >
              <X className="size-3 text-muted-foreground" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
