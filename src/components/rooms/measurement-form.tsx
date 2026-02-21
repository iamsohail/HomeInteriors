"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile, deleteFile } from "@/lib/firebase/storage";
import { resizeImage } from "@/lib/utils/image";
import {
  formatMeasurement,
  getNextLabel,
  type CategoryConfig,
} from "@/lib/utils/measurements";
import { useProject } from "@/lib/providers/project-provider";
import { toast } from "sonner";
import type { MeasurementEntry, MeasurementCategory } from "@/lib/types/room";

interface MeasurementFormProps {
  categories: CategoryConfig[];
  existingEntries: MeasurementEntry[];
  editEntry?: MeasurementEntry;
  roomName: string;
  onSave: (entry: MeasurementEntry) => void;
  onCancel: () => void;
}

export function MeasurementForm({
  categories,
  existingEntries,
  editEntry,
  roomName,
  onSave,
  onCancel,
}: MeasurementFormProps) {
  const { projectId } = useProject();
  const [category, setCategory] = useState<MeasurementCategory>(
    editEntry?.category || categories[0].value
  );
  const [label, setLabel] = useState(
    editEntry?.label ||
      getNextLabel(
        categories[0].value,
        existingEntries
          .filter((e) => e.category === categories[0].value)
          .map((e) => e.label)
      )
  );
  const [width, setWidth] = useState(editEntry?.width?.toString() || "");
  const [height, setHeight] = useState(editEntry?.height?.toString() || "");
  const [depth, setDepth] = useState(editEntry?.depth?.toString() || "");
  const [sillHeight, setSillHeight] = useState(
    editEntry?.sillHeight?.toString() || ""
  );
  const [notes, setNotes] = useState(editEntry?.notes || "");
  const [photoUrl, setPhotoUrl] = useState(editEntry?.photoUrl || "");
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const activeCategory = categories.find((c) => c.value === category)!;
  const fields = activeCategory.fields;

  const handleCategoryChange = (cat: MeasurementCategory) => {
    setCategory(cat);
    if (!editEntry) {
      const labelsForCat = existingEntries
        .filter((e) => e.category === cat)
        .map((e) => e.label);
      setLabel(getNextLabel(cat, labelsForCat));
    }
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files?.length || !projectId) return;
    setUploading(true);
    try {
      const file = files[0];
      const resized = await resizeImage(file);
      const path = `projects/${projectId}/rooms/${roomName}/measurements/${Date.now()}_${resized.name}`;
      const url = await uploadFile(path, resized);
      setPhotoUrl(url);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!photoUrl) return;
    try {
      const url = new URL(photoUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
      if (pathMatch) {
        await deleteFile(decodeURIComponent(pathMatch[1]));
      }
    } catch {
      // Continue even if storage delete fails
    }
    setPhotoUrl("");
  };

  const handleSave = () => {
    if (!label.trim()) {
      toast.error("Label is required");
      return;
    }
    const w = width ? parseFloat(width) : undefined;
    const h = height ? parseFloat(height) : undefined;
    if (!w && !h) {
      toast.error("Enter at least width or height");
      return;
    }

    const entry: MeasurementEntry = {
      id: editEntry?.id || crypto.randomUUID(),
      category,
      label: label.trim(),
      width: w,
      height: h,
      depth: depth ? parseFloat(depth) : undefined,
      sillHeight: sillHeight ? parseFloat(sillHeight) : undefined,
      notes: notes.trim() || undefined,
      photoUrl: photoUrl || undefined,
      createdAt: editEntry?.createdAt || new Date(),
    };
    onSave(entry);
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      {/* Category selector */}
      <div className="space-y-1.5">
        <Label className="text-xs">Category</Label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors ${
                category === cat.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="space-y-1.5">
        <Label className="text-xs">Label</Label>
        <Input
          className="h-9"
          placeholder="e.g. Wall A, Main Door"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      {/* Dimension inputs */}
      <div className="grid grid-cols-2 gap-3">
        {fields.includes("width") && (
          <div className="space-y-1.5">
            <Label className="text-xs">Width (cm)</Label>
            <Input
              className="h-9"
              type="number"
              inputMode="decimal"
              placeholder="cm"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            {width && (
              <p className="text-[11px] text-muted-foreground">
                {formatMeasurement(parseFloat(width))}
              </p>
            )}
          </div>
        )}
        {fields.includes("height") && (
          <div className="space-y-1.5">
            <Label className="text-xs">Height (cm)</Label>
            <Input
              className="h-9"
              type="number"
              inputMode="decimal"
              placeholder="cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            {height && (
              <p className="text-[11px] text-muted-foreground">
                {formatMeasurement(parseFloat(height))}
              </p>
            )}
          </div>
        )}
        {fields.includes("depth") && (
          <div className="space-y-1.5">
            <Label className="text-xs">Depth (cm)</Label>
            <Input
              className="h-9"
              type="number"
              inputMode="decimal"
              placeholder="cm"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />
            {depth && (
              <p className="text-[11px] text-muted-foreground">
                {formatMeasurement(parseFloat(depth))}
              </p>
            )}
          </div>
        )}
        {fields.includes("sillHeight") && (
          <div className="space-y-1.5">
            <Label className="text-xs">Sill Height (cm)</Label>
            <Input
              className="h-9"
              type="number"
              inputMode="decimal"
              placeholder="cm"
              value={sillHeight}
              onChange={(e) => setSillHeight(e.target.value)}
            />
            {sillHeight && (
              <p className="text-[11px] text-muted-foreground">
                {formatMeasurement(parseFloat(sillHeight))}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Photo attachment */}
      <div className="space-y-1.5">
        <Label className="text-xs">Photo (optional)</Label>
        {photoUrl ? (
          <div className="relative w-24 h-24 rounded-md overflow-hidden">
            <img
              src={photoUrl}
              alt="Measurement reference"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => cameraRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
              Camera
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => galleryRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon className="size-3.5" />
              Gallery
            </Button>
          </div>
        )}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files)}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs">Notes (optional)</Label>
        <Textarea
          className="min-h-12 text-sm"
          placeholder="Any extra info for vendors..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          {editEntry ? "Update" : "Add"}
        </Button>
      </div>
    </div>
  );
}
