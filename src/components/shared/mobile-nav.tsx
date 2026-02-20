"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Calendar,
  DoorOpen,
  Palette,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Mood", href: "/mood-board", icon: Palette },
  { label: "Timeline", href: "/timeline", icon: Calendar },
  { label: "Rooms", href: "/rooms", icon: DoorOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around h-16 px-1 overflow-x-auto scrollbar-hide">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors shrink-0",
                active
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-5", active && "text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
