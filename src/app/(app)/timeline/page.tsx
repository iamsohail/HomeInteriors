"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Pause, SkipForward } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_PHASES } from "@/lib/constants/task-phases";
import { TASK_STATUSES, STATUS_COLORS } from "@/lib/constants/statuses";
import type { TaskStatus } from "@/lib/types/task";

// Local state for now — will connect to Firestore in later iteration
interface PhaseState {
  status: TaskStatus;
  notes: string;
}

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  "Not Started": Circle,
  "In Progress": Clock,
  "Completed": CheckCircle2,
  "On Hold": Pause,
  "Skipped": SkipForward,
};

export default function TimelinePage() {
  const [phases, setPhases] = useState<Record<number, PhaseState>>(() => {
    const initial: Record<number, PhaseState> = {};
    TASK_PHASES.forEach((p) => {
      // Kitchen phase is "In Progress" since IKEA orders are placed
      initial[p.order] = {
        status: p.name === "Kitchen" ? "In Progress" : "Not Started",
        notes: "",
      };
    });
    return initial;
  });

  const updateStatus = (order: number, status: TaskStatus) => {
    setPhases((prev) => ({
      ...prev,
      [order]: { ...prev[order], status },
    }));
  };

  const completedCount = Object.values(phases).filter(
    (p) => p.status === "Completed"
  ).length;

  return (
    <>
      <Header
        title="Project Timeline"
        description={`${completedCount} / ${TASK_PHASES.length} phases completed`}
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-0">
          {TASK_PHASES.map((phase, index) => {
            const state = phases[phase.order];
            const StatusIcon = STATUS_ICONS[state.status];
            const isLast = index === TASK_PHASES.length - 1;

            // Check dependencies
            const depsCompleted = phase.dependsOn.every(
              (dep) => phases[dep]?.status === "Completed" || phases[dep]?.status === "Skipped"
            );
            const blocked = !depsCompleted && state.status === "Not Started";

            return (
              <div key={phase.order} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-10 items-center justify-center rounded-full border-2 shrink-0"
                    style={{
                      borderColor: phase.color,
                      backgroundColor:
                        state.status === "Completed"
                          ? phase.color
                          : "transparent",
                    }}
                  >
                    <StatusIcon
                      className="size-5"
                      style={{
                        color:
                          state.status === "Completed" ? "white" : phase.color,
                      }}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 min-h-[24px]"
                      style={{
                        backgroundColor:
                          state.status === "Completed"
                            ? phase.color
                            : "hsl(var(--border))",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <Card className={`flex-1 mb-4 ${blocked ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            Phase {phase.order}
                          </span>
                          <Badge
                            variant="secondary"
                            className={STATUS_COLORS[state.status] || ""}
                          >
                            {state.status}
                          </Badge>
                          {blocked && (
                            <Badge variant="outline" className="text-xs">
                              Blocked
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mt-1">{phase.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {phase.description}
                        </p>
                        {phase.dependsOn.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Depends on:{" "}
                            {phase.dependsOn
                              .map((d) => TASK_PHASES.find((p) => p.order === d)?.name)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          ~{phase.estimatedDays} days estimated
                        </p>
                      </div>
                      <Select
                        value={state.status}
                        onValueChange={(v) => updateStatus(phase.order, v as TaskStatus)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
