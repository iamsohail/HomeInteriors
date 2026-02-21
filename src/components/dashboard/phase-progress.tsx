"use client";

import { Check, Loader2, Pause, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STATUS_COLORS } from "@/lib/constants/statuses";
import { TASK_PHASES } from "@/lib/constants/task-phases";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskPhase } from "@/lib/types/task";

interface PhaseCost {
  estimated: number;
  actual: number;
}

interface PhaseProgressProps {
  phaseStatuses: Record<string, TaskStatus>;
  currentPhase: TaskPhase | null;
  phaseCosts: Record<string, PhaseCost>;
}

const statusIcon: Record<string, React.ReactNode> = {
  Completed: <Check className="size-3" />,
  "In Progress": <Loader2 className="size-3 animate-spin" />,
  "On Hold": <Pause className="size-3" />,
};

export function PhaseProgress({
  phaseStatuses,
  currentPhase,
  phaseCosts,
}: PhaseProgressProps) {
  const { formatCurrencyCompact } = useCurrency();

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm">
      <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
        Phase Progress
      </h3>

      <ScrollArea className="max-h-[400px]">
        <div className="relative">
          {TASK_PHASES.map((phase, index) => {
            const status = phaseStatuses[phase.name] || "Not Started";
            const isCurrent = phase.name === currentPhase;
            const isCompleted = status === "Completed";
            const isLast = index === TASK_PHASES.length - 1;
            const cost = phaseCosts[phase.name];

            const dotColor = isCompleted
              ? "bg-green-500"
              : status === "In Progress"
                ? "bg-blue-500"
                : status === "On Hold"
                  ? "bg-amber-500"
                  : "bg-muted-foreground/30";

            return (
              <div
                key={phase.name}
                className={cn(
                  "relative flex gap-4 pb-6",
                  isCompleted && !isCurrent && "opacity-60"
                )}
              >
                {/* Connector line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                      isCurrent
                        ? "border-primary bg-primary/10 ring-4 ring-primary/20"
                        : isCompleted
                          ? "border-green-500 bg-green-500/10"
                          : "border-border bg-background"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-3 items-center justify-center rounded-full text-white",
                        dotColor
                      )}
                    >
                      {statusIcon[status] || <Circle className="size-2" />}
                    </div>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1",
                        isCompleted ? "bg-green-500/40" : "bg-border"
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={cn("min-w-0 flex-1 pb-1", isCurrent && "")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="text-sm font-medium">{phase.name}</span>
                    <Badge
                      variant="ghost"
                      className={cn(
                        "text-2xs px-1.5 py-0",
                        STATUS_COLORS[status]
                      )}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{phase.estimatedDays} days est.</span>
                    {cost && cost.estimated > 0 && (
                      <span>
                        Est: {formatCurrencyCompact(cost.estimated)}
                      </span>
                    )}
                    {cost && cost.actual > 0 && (
                      <span>
                        Actual: {formatCurrencyCompact(cost.actual)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
