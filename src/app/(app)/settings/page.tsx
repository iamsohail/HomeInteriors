"use client";

import { Header } from "@/components/shared/header";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" description="Project & account settings" />
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Project settings, member management, export — coming in Phase 8.
        </div>
      </div>
    </>
  );
}
