"use client";

import { Header } from "@/components/shared/header";

export default function RecommendationsPage() {
  return (
    <>
      <Header title="Recommendations" description="Value-for-money options by category" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          3-tier recommendations with Bangalore vendors — coming in Phase 7.
        </div>
      </div>
    </>
  );
}
