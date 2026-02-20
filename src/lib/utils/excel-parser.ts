import * as XLSX from "xlsx";
import { parseExcelDate } from "./date";

export interface ParsedExpense {
  sno: number;
  date: string;
  category: string;
  room: string;
  item: string;
  vendor: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMode: string;
  status: string;
  advancePaid: number;
  balance: number;
  receiptURL: string;
  notes: string;
  orderId: string;
}

export interface ParsedOrder {
  orderId: string;
  description: string;
  orderDate: string;
  mrpTotal: number;
  discount: number;
  amountPaid: number;
  emiDetails: string;
  notes: string;
}

export interface ParseResult {
  expenses: ParsedExpense[];
  orders: ParsedOrder[];
  grandTotal: number;
}

function extractOrderId(notes: string): string {
  const match = notes.match(/Order\s*#(\d+)/i);
  return match ? match[1] : "";
}

function mapStatus(status: string): string {
  const s = status?.trim();
  if (s === "Advance Paid") return "Partially Paid";
  if (["Paid", "Partially Paid", "Pending", "Cancelled"].includes(s)) return s;
  return "Pending";
}

export function parseExpenseExcel(buffer: ArrayBuffer): ParseResult {
  const wb = XLSX.read(buffer, { type: "array" });

  // Parse Expense Log
  const expenseSheet = wb.Sheets["Expense Log"];
  const rawExpenses = XLSX.utils.sheet_to_json<unknown[]>(expenseSheet, {
    header: 1,
    raw: true,
  }) as unknown[][];

  const expenses: ParsedExpense[] = [];
  let grandTotal = 0;

  // Skip title rows (0, 1) and header row (2), data starts at index 3
  for (let i = 3; i < rawExpenses.length; i++) {
    const row = rawExpenses[i];
    if (!row || !row[0] || typeof row[0] !== "number") continue;

    const sno = row[0] as number;
    const dateRaw = row[1];
    const category = (row[2] as string) || "";
    const room = (row[3] as string) || "";
    const item = (row[4] as string) || "";
    const vendor = (row[5] as string) || "";
    const quantity = (row[6] as number) || 1;
    const unitPrice = (row[7] as number) || 0;
    const paymentMode = (row[9] as string) || "";
    const status = (row[10] as string) || "";
    const advancePaid = (row[11] as number) || 0;
    const receiptURL = (row[13] as string) || "";
    const notes = (row[14] as string) || "";

    // Compute total and balance (formula columns are null in parsed data)
    const total = quantity * unitPrice;
    const balance = total - advancePaid;
    grandTotal += total;

    // Parse date
    let date = "";
    if (typeof dateRaw === "number") {
      date = parseExcelDate(dateRaw).toISOString().split("T")[0];
    } else if (typeof dateRaw === "string") {
      date = dateRaw;
    }

    const orderId = extractOrderId(notes);

    expenses.push({
      sno,
      date,
      category,
      room,
      item,
      vendor,
      quantity,
      unitPrice,
      total,
      paymentMode,
      status: mapStatus(status),
      advancePaid,
      balance,
      receiptURL,
      notes,
      orderId,
    });
  }

  // Parse Payment & EMI Tracker
  const emiSheet = wb.Sheets["Payment & EMI Tracker"];
  const orders: ParsedOrder[] = [];

  if (emiSheet) {
    const rawOrders = XLSX.utils.sheet_to_json<unknown[]>(emiSheet, {
      header: 1,
      raw: true,
    }) as unknown[][];

    // Skip title (0) and header (1), data starts at 2
    for (let i = 2; i < rawOrders.length; i++) {
      const row = rawOrders[i];
      if (!row || !row[0] || row[0] === "TOTAL") break;

      const orderId = String(row[0]);
      const description = (row[1] as string) || "";
      const dateRaw = row[2];
      const mrpTotal = (row[3] as number) || 0;
      const discount = (row[4] as number) || 0;
      const amountPaid = (row[5] as number) || 0;
      const emiDetails = (row[6] as string) || "";
      const notes = (row[7] as string) || "";

      let orderDate = "";
      if (typeof dateRaw === "number") {
        orderDate = parseExcelDate(dateRaw).toISOString().split("T")[0];
      }

      orders.push({
        orderId,
        description,
        orderDate,
        mrpTotal,
        discount,
        amountPaid,
        emiDetails,
        notes,
      });
    }
  }

  return { expenses, orders, grandTotal };
}
