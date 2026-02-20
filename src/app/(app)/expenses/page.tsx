"use client";

import { useState } from "react";
import { Plus, FileUp } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { ExpenseDataTable } from "@/components/expenses/expense-data-table";
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog";
import { ImportWizard } from "@/components/expenses/import-wizard";
import { useExpenses } from "@/lib/hooks/use-expenses";
import { useOrders } from "@/lib/hooks/use-orders";
import type { Expense } from "@/lib/types/expense";
import type { ParseResult } from "@/lib/utils/excel-parser";

export default function ExpensesPage() {
  const { expenses, loading, addExpense, updateExpense, deleteExpense, batchImport } =
    useExpenses();
  const { batchImportOrders } = useOrders();
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAdd = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    if (!confirm(`Delete "${expense.item}"?`)) return;
    try {
      await deleteExpense(expense.id);
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const handleSubmit = async (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success("Expense updated");
      } else {
        await addExpense(data);
        toast.success("Expense added");
      }
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const handleImport = async (result: ParseResult) => {
    // Import expenses
    const expenseItems = result.expenses.map((e) => ({
      date: e.date,
      category: e.category,
      room: e.room,
      item: e.item,
      vendor: e.vendor,
      quantity: e.quantity,
      unitPrice: e.unitPrice,
      total: e.total,
      paymentMode: e.paymentMode as Expense["paymentMode"],
      status: e.status as Expense["status"],
      advancePaid: e.advancePaid,
      balance: e.balance,
      priority: "Must-Have" as const,
      orderId: e.orderId,
      notes: e.notes,
    }));
    await batchImport(expenseItems);

    // Import orders
    if (result.orders.length > 0) {
      const orderItems = result.orders.map((o) => {
        const isEMI = o.emiDetails.toLowerCase().includes("x");
        let emiMonths = 0;
        let emiPerMonth = 0;
        if (isEMI) {
          const match = o.emiDetails.match(/₹([\d,.]+)\s*x\s*(\d+)M/);
          if (match) {
            emiPerMonth = parseFloat(match[1].replace(/,/g, ""));
            emiMonths = parseInt(match[2]);
          }
        }
        return {
          orderId: o.orderId,
          vendor: "IKEA",
          orderDate: o.orderDate,
          totalAmount: o.amountPaid,
          isEMI,
          emiMonths: emiMonths || undefined,
          emiPerMonth: emiPerMonth || undefined,
          amountPaid: o.amountPaid,
          balance: 0,
          status: "Delivered" as const,
          items: [o.description],
          notes: o.notes,
        };
      });
      await batchImportOrders(orderItems);
    }

    toast.success(
      `Imported ${result.expenses.length} expenses and ${result.orders.length} orders`
    );
  };

  return (
    <>
      <Header
        title="Expenses"
        description={`${expenses.length} items tracked`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <FileUp className="mr-1 size-4" />
              Import
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-1 size-4" />
              Add
            </Button>
          </div>
        }
      />
      <div className="flex-1 p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Loading expenses...
          </div>
        ) : (
          <ExpenseDataTable
            data={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ExpenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        expense={editingExpense}
        onSubmit={handleSubmit}
      />

      <ImportWizard
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </>
  );
}
