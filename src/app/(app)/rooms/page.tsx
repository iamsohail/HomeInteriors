"use client";

import { useState } from "react";
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
  Camera,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useRooms } from "@/lib/hooks/use-rooms";
import { useProject } from "@/lib/providers/project-provider";
import { useCurrency } from "@/lib/hooks/use-currency";
import { RoomPhotosDialog } from "@/components/rooms/room-photos-dialog";
import type { RoomPhoto } from "@/lib/types/room";

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
  const { project, projectId } = useProject();
  const { expenses } = useExpenses();
  const { rooms: roomDocs, updateRoom, addRoom } = useRooms();
  const { formatCurrency } = useCurrency();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const projectRooms = project?.rooms || [];

  const roomStats = projectRooms.map((room) => {
    const roomExpenses = expenses.filter(
      (e) => e.room === room || e.room?.toLowerCase() === room.toLowerCase()
    );
    const totalSpent = roomExpenses.reduce((s, e) => s + e.total, 0);
    const itemCount = roomExpenses.length;
    const roomDoc = roomDocs.find((r) => r.name === room);
    const photoCount = roomDoc?.photos?.length || 0;
    return { room, totalSpent, itemCount, photoCount, roomDoc };
  });

  const selectedStat = roomStats.find((r) => r.room === selectedRoom);
  const selectedPhotos = selectedStat?.roomDoc?.photos || [];

  const handlePhotosChange = async (photos: RoomPhoto[]) => {
    if (!selectedRoom || !projectId) return;
    const roomDoc = roomDocs.find((r) => r.name === selectedRoom);
    if (roomDoc) {
      await updateRoom(roomDoc.id, { photos });
    } else {
      await addRoom({
        name: selectedRoom as any,
        description: "",
        checklist: [],
        photos,
        notes: "",
      });
    }
  };

  return (
    <>
      <Header
        title="Rooms"
        description={`${projectRooms.length} rooms in your ${project?.bhkType || "project"}`}
      />
      <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roomStats.map(({ room, totalSpent, itemCount, photoCount }) => {
            const Icon = getIcon(room);
            return (
              <Card
                key={room}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{room}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {photoCount > 0 && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Camera className="size-3" />
                          {photoCount}
                        </Badge>
                      )}
                      {itemCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {itemCount} items
                        </Badge>
                      )}
                    </div>
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
          {projectRooms.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              No rooms configured. Create a project to get started.
            </div>
          )}
        </div>
      </div>

      {selectedRoom && (
        <RoomPhotosDialog
          open={!!selectedRoom}
          onOpenChange={(open) => {
            if (!open) setSelectedRoom(null);
          }}
          roomName={selectedRoom}
          photos={selectedPhotos}
          onPhotosChange={handlePhotosChange}
        />
      )}
    </>
  );
}
