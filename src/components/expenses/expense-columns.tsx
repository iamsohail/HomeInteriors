"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_COLORS } from "@/lib/constants/statuses";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateShort } from "@/lib/utils/date";
import type { Expense } from "@/lib/types/expense";

interface ColumnActions {
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function getExpenseColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => formatDateShort(row.getValue("date")),
    },
    {
      accessorKey: "category",
      header: "Category",
      filterFn: "equals",
    },
    {
      accessorKey: "room",
      header: "Room",
      filterFn: "equals",
    },
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium" title={row.getValue("item")}>
          {row.getValue("item")}
        </div>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => <span className="tabular-nums">{row.getValue("quantity")}</span>,
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Price
          <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{formatCurrency(row.getValue("unitPrice"))}</span>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-semibold">{formatCurrency(row.getValue("total"))}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equals",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={STATUS_COLORS[status] || ""}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const balance = row.getValue("balance") as number;
        return (
          <span className={`tabular-nums ${balance > 0 ? "text-orange-600 dark:text-orange-400" : ""}`}>
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(expense)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
