import { format, parseISO, isValid } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, "dd MMM yyyy") : "—";
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, "dd/MM/yy") : "—";
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseExcelDate(serial: number): Date {
  // Excel serial date to JS Date
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}
