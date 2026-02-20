"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, Loader2, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFile, deleteFile } from "@/lib/firebase/storage";
import { resizeImage } from "@/lib/utils/image";
import { useProject } from "@/lib/providers/project-provider";
import { toast } from "sonner";
import type { RoomPhoto } from "@/lib/types/room";

interface RoomPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  photos: RoomPhoto[];
  onPhotosChange: (photos: RoomPhoto[]) => void;
}

const PHOTO_TYPES: { value: RoomPhoto["type"]; label: string }[] = [
  { value: "progress", label: "Progress" },
  { value: "inspiration", label: "Inspiration" },
  { value: "completed", label: "Completed" },
];

const TYPE_COLORS: Record<string, string> = {
  progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  inspiration: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
};

export function RoomPhotosDialog({
  open,
  onOpenChange,
  roomName,
  photos,
  onPhotosChange,
}: RoomPhotosDialogProps) {
  const { projectId } = useProject();
  const [uploading, setUploading] = useState(false);
  const [photoType, setPhotoType] = useState<RoomPhoto["type"]>("progress");
  const [caption, setCaption] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || !projectId) return;
    setUploading(true);

    try {
      const newPhotos: RoomPhoto[] = [];
      for (const file of Array.from(files)) {
        const resized = await resizeImage(file);
        const path = `projects/${projectId}/rooms/${roomName}/${Date.now()}_${resized.name}`;
        const url = await uploadFile(path, resized);
        newPhotos.push({
          url,
          caption: caption || `${roomName} — ${photoType}`,
          type: photoType,
          uploadedAt: new Date(),
        });
      }
      onPhotosChange([...newPhotos, ...photos]);
      setCaption("");
      toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? "s" : ""} uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const photo = photos[index];
    try {
      const url = new URL(photo.url);
      const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
      if (pathMatch) {
        await deleteFile(decodeURIComponent(pathMatch[1]));
      }
    } catch {
      // Continue with removal even if storage delete fails
    }
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
    toast.success("Photo removed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{roomName} — Photos</DialogTitle>
        </DialogHeader>

        {/* Upload section */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select
                value={photoType}
                onValueChange={(v) => setPhotoType(v as RoomPhoto["type"])}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHOTO_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-[2] space-y-1.5">
              <Label className="text-xs">Caption (optional)</Label>
              <Input
                className="h-9"
                placeholder="e.g. Electrical wiring done"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-14 flex-col gap-1"
              onClick={() => cameraRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Camera className="size-5" />
              )}
              <span className="text-xs">Camera</span>
            </Button>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />

            <Button
              variant="outline"
              className="flex-1 h-14 flex-col gap-1"
              onClick={() => galleryRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon className="size-5" />
              <span className="text-xs">Gallery</span>
            </Button>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Photo grid */}
        {photos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No photos yet. Capture progress as your room comes together.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {photos.map((photo, i) => (
              <div key={i} className="group relative rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[photo.type]}`}
                  >
                    {photo.type}
                  </Badge>
                  {photo.caption && (
                    <p className="text-[11px] text-white/90 mt-0.5 line-clamp-1">
                      {photo.caption}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(i)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
