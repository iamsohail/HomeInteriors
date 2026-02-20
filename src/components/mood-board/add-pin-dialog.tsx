"use client";

import { useState, useCallback, useRef } from "react";
import { Camera, ImageIcon, Link2, FileText, Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/lib/providers/project-provider";
import { uploadFile } from "@/lib/firebase/storage";
import { resizeImage } from "@/lib/utils/image";
import type { Pin } from "@/lib/types/pin";

interface AddPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pin: Omit<Pin, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  editPin?: Pin | null;
}

export function AddPinDialog({ open, onOpenChange, onSave, editPin }: AddPinDialogProps) {
  const { project, projectId } = useProject();
  const rooms = project?.rooms || [];

  const [tab, setTab] = useState<string>(editPin?.type || "image");
  const [title, setTitle] = useState(editPin?.title || "");
  const [room, setRoom] = useState(editPin?.room || rooms[0] || "");
  const [tagsInput, setTagsInput] = useState(editPin?.tags.join(", ") || "");
  const [saving, setSaving] = useState(false);

  // Image tab state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editPin?.imageUrl || "");
  const [uploadProgress, setUploadProgress] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Link tab state
  const [linkUrl, setLinkUrl] = useState(editPin?.linkUrl || "");

  // Note tab state
  const [noteContent, setNoteContent] = useState(editPin?.content || "");

  const resetForm = useCallback(() => {
    setTitle("");
    setRoom(rooms[0] || "");
    setTagsInput("");
    setImageFile(null);
    setImagePreview("");
    setLinkUrl("");
    setNoteContent("");
    setTab("image");
    setSaving(false);
    setUploadProgress(false);
  }, [rooms]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetForm]
  );

  const handleImageSelect = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const resized = await resizeImage(file);
      setImageFile(resized);
      setImagePreview(URL.createObjectURL(resized));
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    },
    [title]
  );

  const parseTags = (input: string): string[] =>
    input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const handleSave = async () => {
    if (!projectId) return;
    setSaving(true);

    try {
      const tags = parseTags(tagsInput);
      const pinType = tab as Pin["type"];

      let imageUrl = editPin?.imageUrl;
      if (pinType === "image" && imageFile) {
        setUploadProgress(true);
        const path = `projects/${projectId}/pins/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(path, imageFile);
        setUploadProgress(false);
      }

      await onSave({
        type: pinType,
        title: title || (pinType === "note" ? "Untitled note" : "Untitled"),
        imageUrl: pinType === "image" ? imageUrl : undefined,
        linkUrl: pinType === "link" ? linkUrl : undefined,
        content: pinType === "note" ? noteContent : undefined,
        room,
        tags,
      });

      handleOpenChange(false);
    } catch {
      setSaving(false);
    }
  };

  const canSave =
    (tab === "image" && (imageFile || editPin?.imageUrl)) ||
    (tab === "link" && linkUrl.trim()) ||
    (tab === "note" && noteContent.trim());

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPin ? "Edit Pin" : "Add Inspiration"}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          {!editPin && (
            <TabsList className="w-full">
              <TabsTrigger value="image" className="flex-1">
                <Camera className="mr-1.5 size-3.5" />
                Image
              </TabsTrigger>
              <TabsTrigger value="link" className="flex-1">
                <Link2 className="mr-1.5 size-3.5" />
                Link
              </TabsTrigger>
              <TabsTrigger value="note" className="flex-1">
                <FileText className="mr-1.5 size-3.5" />
                Note
              </TabsTrigger>
            </TabsList>
          )}

          {/* IMAGE TAB */}
          <TabsContent value="image" className="space-y-4 mt-4">
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 size-7"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Camera capture - prominent on mobile */}
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 border-dashed"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="size-6" />
                  <span className="text-sm">Take a Photo</span>
                </Button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files)}
                />

                {/* Gallery upload */}
                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-1.5 border-dashed"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <ImageIcon className="size-5" />
                  <span className="text-xs">Choose from Gallery</span>
                </Button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files)}
                />
              </div>
            )}

            {uploadProgress && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Uploading...
              </div>
            )}
          </TabsContent>

          {/* LINK TAB */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* NOTE TAB */}
          <TabsContent value="note" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                placeholder="Write your design ideas, measurements, material notes..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={5}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Common fields */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Give it a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="modern, minimalist, IKEA (comma-separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                {editPin ? "Update Pin" : "Save Pin"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
