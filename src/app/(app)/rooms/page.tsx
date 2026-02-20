"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sofa,
  BedDouble,
  BedSingle,
  CookingPot,
  Bath,
  Sun,
  DoorOpen,
  Wrench,
  Flame,
  Home,
  Building,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { ROOMS } from "@/lib/constants/rooms";
import { formatCurrency } from "@/lib/utils/currency";
import type { RoomType } from "@/lib/types/room";
import type { LucideIcon } from "lucide-react";

const ROOM_ICON_MAP: Record<string, LucideIcon> = {
  "Living Room": Sofa,
  "Master Bedroom": BedDouble,
  "Bedroom 2": BedSingle,
  "Bedroom 3": BedSingle,
  "Kitchen": CookingPot,
  "Bathroom 1": Bath,
  "Bathroom 2": Bath,
  "Bathroom 3": Bath,
  "Balcony 1": Sun,
  "Balcony 2": Sun,
  "Entrance/Foyer": DoorOpen,
  "Utility/Service": Wrench,
  "Pooja Room": Flame,
  "Common Areas": Home,
  "Whole House": Building,
};

export default function RoomsPage() {
  const { expenses } = useExpenses();

  // Compute per-room stats
  const roomStats = ROOMS.map((room) => {
    const roomExpenses = expenses.filter((e) => e.room === room);
    const totalSpent = roomExpenses.reduce((s, e) => s + e.total, 0);
    const itemCount = roomExpenses.length;
    return { room, totalSpent, itemCount };
  });

  return (
    <>
      <Header title="Rooms" description="Room-by-room overview" />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {roomStats.map(({ room, totalSpent, itemCount }) => {
            const Icon = ROOM_ICON_MAP[room] || Home;
            return (
              <Card
                key={room}
                className="hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{room}</p>
                      <p className="text-xs text-muted-foreground">
                        {itemCount} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tabular-nums">
                      {totalSpent > 0 ? formatCurrency(totalSpent) : "—"}
                    </span>
                    {totalSpent > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
