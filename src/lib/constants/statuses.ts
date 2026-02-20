import type { ExpenseStatus } from "@/lib/types/expense";
import type { TaskStatus } from "@/lib/types/task";
import type { OrderStatus } from "@/lib/types/emi";

export const EXPENSE_STATUSES: ExpenseStatus[] = [
  "Paid",
  "Partially Paid",
  "Pending",
  "Cancelled",
];

export const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Completed",
  "On Hold",
  "Skipped",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "Placed",
  "Processing",
  "Delivered",
  "Partially Delivered",
  "Cancelled",
];

export const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Card",
  "Bank Transfer",
  "EMI",
  "Other",
] as const;

export const PRIORITY_OPTIONS = [
  "Must-Have",
  "Nice-to-Have",
  "Can Skip",
] as const;

export const STATUS_COLORS: Record<string, string> = {
  // Expense
  "Paid": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Partially Paid": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Pending": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Cancelled": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // Task
  "Not Started": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "On Hold": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "Skipped": "bg-gray-100 text-gray-500 dark:bg-gray-900/30 dark:text-gray-500",
  // Order
  "Placed": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Processing": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "Delivered": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Partially Delivered": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  // Priority
  "Must-Have": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "Nice-to-Have": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Can Skip": "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
};
