"use client";

import type { Pin } from "@/lib/types/pin";
import { PinCard } from "./pin-card";

interface PinGridProps {
  pins: Pin[];
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
}

export function PinGrid({ pins, onEdit, onDelete }: PinGridProps) {
  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Save your design inspiration here — upload photos, paste links, or jot
          down ideas.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
