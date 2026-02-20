"use client";

import { useState, useMemo } from "react";
import { Plus, Palette } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { PinGrid } from "@/components/mood-board/pin-grid";
import { AddPinDialog } from "@/components/mood-board/add-pin-dialog";
import { usePins } from "@/lib/hooks/use-pins";
import { useProject } from "@/lib/providers/project-provider";
import { deleteFile } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";
import type { Pin } from "@/lib/types/pin";

export default function MoodBoardPage() {
  const { project } = useProject();
  const { pins, loading, addPin, updatePin, deletePin } = usePins();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPin, setEditPin] = useState<Pin | null>(null);
  const [activeRoom, setActiveRoom] = useState("All");

  const rooms = useMemo(() => ["All", ...(project?.rooms || [])], [project]);

  const filteredPins = useMemo(
    () =>
      activeRoom === "All"
        ? pins
        : pins.filter((p) => p.room === activeRoom),
    [pins, activeRoom]
  );

  const handleSave = async (data: Omit<Pin, "id" | "createdAt" | "updatedAt">) => {
    if (editPin) {
      await updatePin(editPin.id, data);
      toast.success("Pin updated");
    } else {
      await addPin(data);
      toast.success("Pin saved");
    }
  };

  const handleEdit = (pin: Pin) => {
    setEditPin(pin);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const pin = pins.find((p) => p.id === id);
    if (pin?.type === "image" && pin.imageUrl) {
      try {
        // Extract storage path from download URL
        const url = new URL(pin.imageUrl);
        const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
        if (pathMatch) {
          const storagePath = decodeURIComponent(pathMatch[1]);
          await deleteFile(storagePath);
        }
      } catch {
        // Image may already be deleted, continue with pin deletion
      }
    }
    await deletePin(id);
    toast.success("Pin deleted");
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditPin(null);
  };

  return (
    <>
      <Header
        title="Mood Board"
        description="Save design inspiration for your home"
        actions={
          <Button onClick={() => setDialogOpen(true)} className="hidden md:flex">
            <Plus className="mr-2 size-4" />
            Add Pin
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 space-y-4">
        {/* Room filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {rooms.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRoom(r)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeRoom === r
                  ? "bg-primary text-primary-foreground"
                  : "glass-card hover:bg-accent"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-muted/30"
              />
            ))}
          </div>
        ) : (
          <PinGrid
            pins={filteredPins}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden active:scale-95 transition-transform"
      >
        <Plus className="size-6" />
      </button>

      <AddPinDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSave={handleSave}
        editPin={editPin}
      />
    </>
  );
}
