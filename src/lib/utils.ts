import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const INVITE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateInviteCode(length = 6): string {
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => INVITE_CHARS[v % INVITE_CHARS.length]).join("");
}
