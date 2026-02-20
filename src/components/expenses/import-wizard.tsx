"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { parseExpenseExcel, type ParseResult } from "@/lib/utils/excel-parser";
import { formatCurrency } from "@/lib/utils/currency";

interface ImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (result: ParseResult) => Promise<void>;
}

type Step = "upload" | "preview" | "importing" | "done";

export function ImportWizard({ open, onOpenChange, onImport }: ImportWizardProps) {
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const parsed = parseExpenseExcel(buffer);
        setResult(parsed);
        setStep("preview");
      } catch (err) {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!result) return;
    setStep("importing");
    setProgress(10);
    try {
      setProgress(30);
      await onImport(result);
      setProgress(100);
      setStep("done");
    } catch (err) {
      setError(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setStep("preview");
    }
  };

  const handleClose = () => {
    setStep("upload");
    setResult(null);
    setError(null);
    setProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import from Excel</DialogTitle>
          <DialogDescription>
            Upload your Home Interiors Expense Tracker spreadsheet.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the file here" : "Drag & drop your .xlsx file"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === "preview" && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
              <FileSpreadsheet className="size-8 text-green-600" />
              <div>
                <p className="font-medium">File parsed successfully</p>
                <p className="text-sm text-muted-foreground">
                  {result.expenses.length} expenses, {result.orders.length} orders
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total expenses:</span>
                <span className="font-semibold">{result.expenses.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grand total:</span>
                <span className="font-semibold">{formatCurrency(result.grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orders found:</span>
                <span className="font-semibold">{result.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories:</span>
                <span className="font-semibold">
                  {[...new Set(result.expenses.map((e) => e.category))].join(", ")}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleImport}>
                Import {result.expenses.length} Expenses
              </Button>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-center text-muted-foreground">
              Importing expenses to Firestore...
            </p>
            <Progress value={progress} />
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="size-12 text-green-600 mx-auto" />
            <div>
              <p className="font-medium">Import Complete</p>
              <p className="text-sm text-muted-foreground">
                {result?.expenses.length} expenses and {result?.orders.length} orders imported.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
