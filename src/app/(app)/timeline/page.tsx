"use client";

import { Header } from "@/components/shared/header";

export default function TimelinePage() {
  return (
    <>
      <Header title="Project Timeline" description="15-phase renovation timeline" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          15-phase vertical timeline with task management — coming in Phase 5.
        </div>
      </div>
    </>
  );
}
