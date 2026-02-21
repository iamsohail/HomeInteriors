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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROOM_ICONS } from "@/lib/constants/rooms";
import type { RoomType } from "@/lib/constants/rooms";
import { useCurrency } from "@/lib/hooks/use-currency";
import { cn } from "@/lib/utils";

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

  const maxSpent = Math.max(...rooms.map((r) => r.totalSpent), 1);

  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-4">
        <h3 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
          Room Spending
        </h3>
        <p className="py-4 text-center text-sm text-muted-foreground">
          No rooms configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
        Room Spending
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rooms.map((room) => {
          const Icon = getRoomIcon(room.name);
          const barPercent = maxSpent > 0 ? (room.totalSpent / maxSpent) * 100 : 0;
          return (
            <Link
              key={room.name}
              href="/rooms"
              className={cn(
                "group rounded-lg border border-border/40 bg-muted/20 p-3",
                "transition-colors hover:border-border hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{room.name}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {room.itemCount} {room.itemCount === 1 ? "item" : "items"}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrencyCompact(room.totalSpent)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${barPercent}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
