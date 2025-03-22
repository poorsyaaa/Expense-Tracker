import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string(),
  dueDate: z.string().optional(),
  isPaid: z.boolean().default(true),
  type: z.enum(["ONE_TIME", "RECURRING", "TRANSFER"]),
  paymentMethod: z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "CASH",
    "BANK_TRANSFER",
    "DIGITAL_BANK",
    "SAVINGS",
    "OTHER",
  ]),
  tags: z.array(z.string()).optional(),
  expenseNote: z.string().optional(),
});

export const updateExpenseSchema = expenseSchema.partial();

export const queryParamsSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2023),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>;
export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;
