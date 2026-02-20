"use client";

import {
  Sofa, UtensilsCrossed, BedDouble, BedSingle,
  CookingPot, Bath, DoorOpen, Sun, Building,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrency } from "@/lib/hooks/use-currency";

interface RoomData {
  name: string;
  itemCount: number;
  totalSpent: number;
}

interface RoomProgressGridProps {
  rooms: RoomData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  "sofa": Sofa,
  "utensils": UtensilsCrossed,
  "bed-double": BedDouble,
  "bed-single": BedSingle,
  "cooking-pot": CookingPot,
  "bath": Bath,
  "door-open": DoorOpen,
  "sun": Sun,
  "building": Building,
};

import { ROOM_ICONS } from "@/lib/constants/rooms";
import type { RoomType } from "@/lib/constants/rooms";

function getRoomIcon(roomName: string): LucideIcon {
  const iconName = ROOM_ICONS[roomName as RoomType];
  return ICON_MAP[iconName] || Building;
}

export function RoomProgressGrid({ rooms }: RoomProgressGridProps) {
  const { formatCurrency } = useCurrency();
  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
          Room Progress
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
        Room Progress
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rooms.map((room) => {
          const Icon = getRoomIcon(room.name);
          return (
            <div
              key={room.name}
              className="rounded-lg border border-border/40 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{room.name}</span>
              </div>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  {room.itemCount} {room.itemCount === 1 ? "item" : "items"}
                </p>
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(room.totalSpent)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
