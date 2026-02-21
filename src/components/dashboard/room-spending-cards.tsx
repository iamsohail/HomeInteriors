"use client";

import Link from "next/link";
import {
  Sofa,
  UtensilsCrossed,
  BedDouble,
  BedSingle,
  CookingPot,
  Bath,
  DoorOpen,
  Sun,
  Building,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROOM_ICONS } from "@/lib/constants/rooms";
import type { RoomType } from "@/lib/constants/rooms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrency } from "@/lib/hooks/use-currency";

export interface RoomSpendingData {
  name: string;
  itemCount: number;
  totalSpent: number;
}

interface RoomSpendingCardsProps {
  rooms: RoomSpendingData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  sofa: Sofa,
  utensils: UtensilsCrossed,
  "bed-double": BedDouble,
  "bed-single": BedSingle,
  "cooking-pot": CookingPot,
  bath: Bath,
  "door-open": DoorOpen,
  sun: Sun,
  building: Building,
};

function getRoomIcon(roomName: string): LucideIcon {
  const iconName = ROOM_ICONS[roomName as RoomType];
  return ICON_MAP[iconName] || Building;
}

export function RoomSpendingCards({ rooms }: RoomSpendingCardsProps) {
  const { formatCurrencyCompact } = useCurrency();

  // Only show rooms with actual spending
  const activeRooms = rooms.filter((r) => r.totalSpent > 0 || r.itemCount > 0);
  const maxSpent = Math.max(...activeRooms.map((r) => r.totalSpent), 1);

  if (activeRooms.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-4">
        <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
          Room Spending
        </h3>
        <p className="py-4 text-center text-sm text-muted-foreground">
          No room spending data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          Room Spending
        </h3>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <ScrollArea className="max-h-[280px]">
        <div className="space-y-1.5">
          {activeRooms.map((room) => {
            const Icon = getRoomIcon(room.name);
            const barPercent = maxSpent > 0 ? (room.totalSpent / maxSpent) * 100 : 0;
            return (
              <div
                key={room.name}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{room.name}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatCurrencyCompact(room.totalSpent)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-2xs text-muted-foreground">
                      {room.itemCount} {room.itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
