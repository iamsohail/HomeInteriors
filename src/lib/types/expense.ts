export type ExpenseStatus = "Paid" | "Partially Paid" | "Pending" | "Cancelled";
export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer" | "EMI" | "Other";
export type Priority = "Must-Have" | "Nice-to-Have" | "Can Skip";

export interface Expense {
  id: string;
  date: string; // ISO date string
  category: string;
  room: string;
  item: string;
  vendor: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
  advancePaid: number;
  balance: number; // total - advancePaid
  status: ExpenseStatus;
  paymentMode: PaymentMode;
  priority: Priority;
  orderId?: string; // link to IKEA order
  receiptURL?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
