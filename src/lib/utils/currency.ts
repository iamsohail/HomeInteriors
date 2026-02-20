const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_COMPACT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(amount: number): string {
  return INR.format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  return INR_COMPACT.format(amount);
}

export function parseCurrencyInput(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, "")) || 0;
}
