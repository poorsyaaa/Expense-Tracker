import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive(),
  categoryId: z.string(),
  recurring: z.boolean(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  startDate: z.string(), // We'll parse this as a date
  endDate: z.string().optional(),
  dueDate: z.string().optional(),
  isPaid: z.boolean().optional(),
});

export const updateExpenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  categoryId: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  startDate: z.string().optional(), // We'll parse this as a date
  endDate: z.string().optional(),
  dueDate: z.string().optional(),
  isPaid: z.boolean().optional(),
});

export const queryParamsSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2023),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>;
export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;
