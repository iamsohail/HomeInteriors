"use client";

import { Header } from "@/components/shared/header";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" description="Budget overview & project status" />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PlaceholderCard title="Total Budget" value="₹10L – ₹20L" />
          <PlaceholderCard title="Total Spent" value="₹5,10,011" />
          <PlaceholderCard title="Active EMIs" value="4 orders" />
          <PlaceholderCard title="Tasks" value="0 / 15 phases" />
        </div>
        <div className="mt-6 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Charts and detailed widgets will be built in Phase 3.
        </div>
      </div>
    </>
  );
}

function PlaceholderCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
