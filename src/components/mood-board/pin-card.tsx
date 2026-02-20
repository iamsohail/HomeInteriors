"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pin } from "@/lib/types/pin";

interface PinCardProps {
  pin: Pin;
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
}

export function PinCard({ pin, onEdit, onDelete }: PinCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group glass-card glass-card-hover rounded-xl overflow-hidden break-inside-avoid mb-4">
      {/* Image */}
      {pin.type === "image" && pin.imageUrl && !imgError && (
        <div className="relative">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Link preview */}
      {pin.type === "link" && (
        <div className="relative">
          {pin.linkPreview?.image && !imgError ? (
            <img
              src={pin.linkPreview.image}
              alt={pin.linkPreview.title || pin.title}
              className="w-full h-40 object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-32 items-center justify-center bg-muted/30">
              <ExternalLink className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Note icon placeholder */}
      {pin.type === "note" && (
        <div className="flex h-12 items-center justify-center bg-primary/5 pt-4">
          <FileText className="size-6 text-primary/60" />
        </div>
      )}

      {/* Image fallback */}
      {pin.type === "image" && (!pin.imageUrl || imgError) && (
        <div className="flex h-32 items-center justify-center bg-muted/30">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight line-clamp-2">
            {pin.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(pin)}>
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(pin.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Note content preview */}
        {pin.type === "note" && pin.content && (
          <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {pin.content}
          </p>
        )}

        {/* Link preview text */}
        {pin.type === "link" && pin.linkPreview?.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {pin.linkPreview.description}
          </p>
        )}

        {/* Link URL */}
        {pin.type === "link" && pin.linkUrl && (
          <a
            href={pin.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="size-3" />
            {new URL(pin.linkUrl).hostname}
          </a>
        )}

        {/* Room + tags */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {pin.room}
          </Badge>
          {pin.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
