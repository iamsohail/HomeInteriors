"use client";

import { useRef, useCallback } from "react";
import { Check, Circle, Loader2, Pause } from "lucide-react";
import { TASK_PHASES } from "@/lib/constants/task-phases";
import type { TaskStatus, TaskPhase } from "@/lib/types/task";
import { cn } from "@/lib/utils";

interface PhaseTimelineProps {
  phaseStatuses: Record<string, TaskStatus>;
  currentPhase: TaskPhase | null;
}

function StatusIcon({ status }: { status: TaskStatus | undefined }) {
  switch (status) {
    case "Completed":
      return <Check className="size-3" />;
    case "In Progress":
      return <Loader2 className="size-3 animate-spin" />;
    case "On Hold":
      return <Pause className="size-3" />;
    default:
      return <Circle className="size-2.5" />;
  }
}

export function PhaseTimeline({ phaseStatuses, currentPhase }: PhaseTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft.current - (x - startX.current);
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
        Phase Timeline
      </h3>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto p-1 pb-2 -m-1 border-0 scrollbar-hide select-none"
        style={{ cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {TASK_PHASES.map((phase) => {
          const status = phaseStatuses[phase.name];
          const isCurrent = phase.name === currentPhase;

          return (
            <div
              key={phase.order}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                status === "Completed"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : status === "In Progress"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : status === "On Hold"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-border/50 bg-muted/50 text-muted-foreground",
                isCurrent && "ring-2 ring-primary/50"
              )}
            >
              <span
                className="flex size-4 items-center justify-center rounded-full"
                style={{ backgroundColor: `${phase.color}30`, color: phase.color }}
              >
                <StatusIcon status={status} />
              </span>
              <span className="whitespace-nowrap">{phase.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
