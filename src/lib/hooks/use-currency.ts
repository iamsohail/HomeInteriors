"use client";

import { useCallback } from "react";
import { useProject } from "@/lib/providers/project-provider";
import {
  formatCurrency as fmt,
  formatCurrencyCompact as fmtCompact,
  getCurrencySymbol as getSymbol,
} from "@/lib/utils/currency";

export function useCurrency() {
  const { project } = useProject();
  const city = project?.city || "";

  const formatCurrency = useCallback(
    (amount: number) => fmt(amount, city),
    [city]
  );

  const formatCurrencyCompact = useCallback(
    (amount: number) => fmtCompact(amount, city),
    [city]
  );

  const currencySymbol = getSymbol(city);

  return { formatCurrency, formatCurrencyCompact, currencySymbol };
}
