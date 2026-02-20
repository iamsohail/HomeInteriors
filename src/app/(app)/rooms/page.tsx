"use client";

import { Header } from "@/components/shared/header";

export default function RoomsPage() {
  return (
    <>
      <Header title="Rooms" description="Room-by-room planning & checklists" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Room planner with checklists and photo gallery — coming in Phase 6.
        </div>
      </div>
    </>
  );
}
