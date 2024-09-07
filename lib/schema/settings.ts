import { z } from "zod";

export const budgetSchema = z.object({
  amount: z.number().positive(),
  month: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const incomeSchema = z.object({
  amount: z.number().positive(),
  month: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const settingsSchema = z.object({
  defaultBudget: z.number().positive(),
  defaultIncome: z.number().positive(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const querySchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2023),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;
export type IncomeSchema = z.infer<typeof incomeSchema>;
export type SettingsSchema = z.infer<typeof settingsSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type QuerySchema = z.infer<typeof querySchema>;
