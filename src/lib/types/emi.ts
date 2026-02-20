export type OrderStatus = "Placed" | "Processing" | "Delivered" | "Partially Delivered" | "Cancelled";

export interface EMISchedule {
  month: number; // 1-indexed
  dueDate: string; // ISO date
  amount: number;
  paid: boolean;
  paidDate?: string;
}

export interface Order {
  id: string;
  orderId: string; // vendor order ID (e.g., IKEA order number)
  vendor: string;
  orderDate: string;
  totalAmount: number;
  isEMI: boolean;
  emiMonths?: number;
  emiPerMonth?: number;
  emiSchedule?: EMISchedule[];
  amountPaid: number;
  balance: number;
  status: OrderStatus;
  items: string[]; // brief description of items
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
