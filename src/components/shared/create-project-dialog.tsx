"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BHK_TYPES, CITIES, BUDGET_RANGES } from "@/lib/constants/apartment-types";
import { useProject, type CreateProjectInput } from "@/lib/providers/project-provider";
import { useCurrency } from "@/lib/hooks/use-currency";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  city: z.string().min(1, "City is required"),
  bhkType: z.string().min(1, "Apartment type is required"),
  address: z.string(),
  expectedBudget: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { createProject } = useProject();
  const { formatCurrency } = useCurrency();
  const [creating, setCreating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      bhkType: "",
      address: "",
      expectedBudget: undefined,
    },
  });

  const selectedBHK = form.watch("bhkType");
  const selectedCity = form.watch("city");
  const budgetRange = selectedBHK ? BUDGET_RANGES[selectedBHK] : null;
  const symbol = getCurrencySymbol(selectedCity || "");

  const handleSubmit = async (values: FormValues) => {
    setCreating(true);
    try {
      await createProject(values as CreateProjectInput);
      toast.success("Project created!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Set up your home interior project to start tracking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My 3BHK Interiors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bhkType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BHK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {budgetRange && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Suggested budget: </span>
                <span className="font-medium">
                  {formatCurrency(budgetRange.min)} – {formatCurrency(budgetRange.max)}
                </span>
              </div>
            )}

            <FormField
              control={form.control}
              name="expectedBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Budget (optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{symbol}</span>
                      <Input
                        type="number"
                        placeholder="e.g. 1500000"
                        className="pl-7"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Building name, flat number..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
