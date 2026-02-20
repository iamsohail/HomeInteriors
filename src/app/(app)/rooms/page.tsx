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
  Wrench,
  Flame,
  Home,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useProject } from "@/lib/providers/project-provider";
import { formatCurrency } from "@/lib/utils/currency";

const ROOM_ICON_MAP: Record<string, LucideIcon> = {
  "Living": Sofa,
  "Dining": Utensils,
  "Master": BedDouble,
  "Bedroom": BedSingle,
  "Kitchen": CookingPot,
  "Toilet": Bath,
  "Bathroom": Bath,
  "Balcony": Sun,
  "Foyer": DoorOpen,
  "Utility": Wrench,
  "Pooja": Flame,
  "Garden": Sun,
  "Terrace": Sun,
  "Garage": Building,
  "Family": Sofa,
};

function getIcon(roomName: string): LucideIcon {
  for (const [key, icon] of Object.entries(ROOM_ICON_MAP)) {
    if (roomName.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return Home;
}

export default function RoomsPage() {
  const { project } = useProject();
  const { expenses } = useExpenses();

  const rooms = project?.rooms || [];

  const roomStats = rooms.map((room) => {
    const roomExpenses = expenses.filter(
      (e) => e.room === room || e.room?.toLowerCase() === room.toLowerCase()
    );
    const totalSpent = roomExpenses.reduce((s, e) => s + e.total, 0);
    const itemCount = roomExpenses.length;
    return { room, totalSpent, itemCount };
  });

  return (
    <>
      <Header
        title="Rooms"
        description={`${rooms.length} rooms in your ${project?.bhkType || "project"}`}
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roomStats.map(({ room, totalSpent, itemCount }) => {
            const Icon = getIcon(room);
            return (
              <Card key={room} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{room}</p>
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
          {rooms.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              No rooms configured. Create a project to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
