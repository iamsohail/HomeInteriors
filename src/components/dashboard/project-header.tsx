"use client";

import { Building2, MapPin } from "lucide-react";
import type { Project } from "@/lib/types/project";
import type { TaskPhase } from "@/lib/types/task";
import { TASK_PHASES } from "@/lib/constants/task-phases";

interface ProjectHeaderProps {
  project: Project;
  completedPhases: number;
  currentPhase: TaskPhase | null;
}

export function ProjectHeader({ project, completedPhases, currentPhase }: ProjectHeaderProps) {
  const totalPhases = TASK_PHASES.length;
  const progress = totalPhases > 0 ? completedPhases / totalPhases : 0;
  const currentPhaseConfig = currentPhase
    ? TASK_PHASES.find((p) => p.name === currentPhase)
    : null;

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/90 to-card/60 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="size-3.5" />
              {project.bhkType}
            </span>
            {project.city && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {project.city}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">
            {currentPhaseConfig
              ? `Phase ${currentPhaseConfig.order} of ${totalPhases}: ${currentPhaseConfig.name}`
              : completedPhases === totalPhases && completedPhases > 0
                ? "All phases complete!"
                : "No phases started"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-semibold">{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
