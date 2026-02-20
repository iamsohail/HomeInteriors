"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 hidden size-7 md:flex"
            onClick={toggleSidebar}
          >
            {isExpanded ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            <span className="sr-only">
              {isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
