"use client";

import { Header } from "@/components/shared/header";
import { MemberList } from "@/components/settings/member-list";
import { useProject } from "@/lib/providers/project-provider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { project } = useProject();

  return (
    <>
      <Header title="Settings" description="Project & account settings" />
      <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 space-y-6 max-w-2xl">
        {/* Project Info */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">Project Info</h2>
          <div className="rounded-xl glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{project?.name || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <Badge variant="secondary">{project?.bhkType || "—"}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">City</span>
              <span className="text-sm font-medium">{project?.city || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="text-sm font-medium">
                {project?.expectedBudget
                  ? `₹${(project.expectedBudget / 100000).toFixed(1)}L`
                  : project?.budgetMin && project?.budgetMax
                    ? `₹${(project.budgetMin / 100000).toFixed(0)}L – ₹${(project.budgetMax / 100000).toFixed(0)}L`
                    : "—"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rooms</span>
              <span className="text-sm font-medium">{project?.rooms.length || 0} rooms</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Members */}
        <MemberList />
      </div>
    </>
  );
}
