"use client";

import { Header } from "@/components/shared/header";

export default function EMIsPage() {
  return (
    <>
      <Header title="EMIs & Orders" description="Track IKEA orders and EMI schedules" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Order tracking with EMI schedules and monthly outflow — coming in Phase 4.
        </div>
      </div>
    </>
  );
}
