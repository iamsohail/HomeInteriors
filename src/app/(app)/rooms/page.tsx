"use client";

import {
  Sofa,
  BedDouble,
  BedSingle,
  CookingPot,
  Bath,
  Sun,
  DoorOpen,
  Building,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { ROOMS, ROOM_MEASUREMENTS, type RoomType } from "@/lib/constants/rooms";
import { formatCurrency } from "@/lib/utils/currency";

const ROOM_ICON_MAP: Record<string, LucideIcon> = {
  "Living Room": Sofa,
  "Dining Area": Utensils,
  "Master Bedroom": BedDouble,
  "Bedroom 1": BedSingle,
  "Bedroom 2": BedSingle,
  "Kitchen & Utility": CookingPot,
  "Master Toilet": Bath,
  "Toilet 1": Bath,
  "Toilet 2": Bath,
  "Foyer": DoorOpen,
  "Balcony": Sun,
  "Whole House": Building,
};

export default function RoomsPage() {
  const { expenses } = useExpenses();

  const roomStats = ROOMS.map((room) => {
    // Match expenses by room name (handle "Kitchen" → "Kitchen & Utility" mapping)
    const roomExpenses = expenses.filter(
      (e) => e.room === room || (room === "Kitchen & Utility" && e.room === "Kitchen")
    );
    const totalSpent = roomExpenses.reduce((s, e) => s + e.total, 0);
    const itemCount = roomExpenses.length;
    const measurements = ROOM_MEASUREMENTS[room];
    return { room, totalSpent, itemCount, measurements };
  });

  return (
    <>
      <Header title="Rooms" description="Vario Homes B1502 — 3BHK, 1133 sqft carpet" />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roomStats.map(({ room, totalSpent, itemCount, measurements }) => {
            const Icon = ROOM_ICON_MAP[room] || Building;
            return (
              <Card key={room} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{room}</p>
                      <p className="text-xs text-muted-foreground">
                        {measurements.dimensions}
                        {measurements.areaSqft && room !== "Whole House"
                          ? ` (~${measurements.areaSqft} sqft)`
                          : ""}
                      </p>
                    </div>
                    {itemCount > 0 && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {itemCount} items
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t">
                    <span className="text-sm text-muted-foreground">Spent</span>
                    <span className="text-lg font-bold tabular-nums">
                      {totalSpent > 0 ? formatCurrency(totalSpent) : "—"}
                    </span>
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
