"use client";

import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatMeasurement,
  MEASUREMENT_CATEGORIES,
} from "@/lib/utils/measurements";
import { toast } from "sonner";
import type { MeasurementEntry, MeasurementCategory } from "@/lib/types/room";

interface MeasurementListProps {
  entries: MeasurementEntry[];
  onEdit: (entry: MeasurementEntry) => void;
  onDelete: (id: string) => void;
}

function DimensionChip({ label, cm }: { label: string; cm: number }) {
  const text = formatMeasurement(cm);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-mono hover:bg-muted/80 transition-colors group"
      title="Tap to copy"
    >
      <span className="text-muted-foreground text-[10px] font-sans">
        {label}:
      </span>
      <span>{text}</span>
      <Copy className="size-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function EntryCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: MeasurementEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-3 py-2.5">
      {entry.photoUrl && (
        <img
          src={entry.photoUrl}
          alt={entry.label}
          className="size-14 rounded-md object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{entry.label}</p>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onEdit}
              title="Edit"
            >
              <Pencil className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onDelete}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {entry.width && <DimensionChip label="W" cm={entry.width} />}
          {entry.height && <DimensionChip label="H" cm={entry.height} />}
          {entry.depth && <DimensionChip label="D" cm={entry.depth} />}
          {entry.sillHeight && (
            <DimensionChip label="Sill" cm={entry.sillHeight} />
          )}
        </div>
        {entry.notes && (
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
            {entry.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export function MeasurementList({
  entries,
  onEdit,
  onDelete,
}: MeasurementListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-6">
        No measurements yet. Add dimensions for walls, windows, doors, and more.
      </p>
    );
  }

  // Group by category, preserving order from MEASUREMENT_CATEGORIES
  const grouped = new Map<MeasurementCategory, MeasurementEntry[]>();
  for (const entry of entries) {
    const list = grouped.get(entry.category) || [];
    list.push(entry);
    grouped.set(entry.category, list);
  }

  const orderedCategories = MEASUREMENT_CATEGORIES.map((c) => c.value).filter(
    (c) => grouped.has(c)
  );

  return (
    <div className="space-y-4">
      {orderedCategories.map((cat) => {
        const config = MEASUREMENT_CATEGORIES.find((c) => c.value === cat)!;
        const items = grouped.get(cat)!;
        return (
          <div key={cat}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{config.icon}</span>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {config.label}s
              </h4>
              <span className="text-xs text-muted-foreground">
                ({items.length})
              </span>
            </div>
            <div className="divide-y">
              {items.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
