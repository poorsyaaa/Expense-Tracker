import { z } from "zod";

export const budgetSchema = z.object({
  amount: z.number().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2023),
});

export const incomeSchema = z.object({
  amount: z.number().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2023),
});

export const settingsSchema = z.object({
  defaultBudget: z.number().positive(),
  defaultIncome: z.number().positive(),
  currency: z.string().optional().default("PHP"),
  locale: z.string().optional().default("en-US"),
  timeZone: z.string().optional().default("UTC"),
  dateFormat: z.string().optional().default("MM/DD/YYYY"),
  defaultPaymentMethod: z
    .enum([
      "CREDIT_CARD",
      "DEBIT_CARD",
      "CASH",
      "BANK_TRANSFER",
      "DIGITAL_BANK",
      "SAVINGS",
      "OTHER",
    ])
    .optional()
    .default("CASH"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryGroupId: z.string().min(1, "Category group ID is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
});

export const queryParamsSchema = z.object({
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2023).optional(),
});

export const paginationSchema = z
  .object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    sortBy: z.string(),
    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .merge(queryParamsSchema);

export const categoryGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const deleteCategorySchema = z.object({
  categoryId: z.string().min(1, { message: "Category ID is required" }),
});

export type BudgetSchema = z.infer<typeof budgetSchema>;
export type IncomeSchema = z.infer<typeof incomeSchema>;
export type SettingsSchema = z.infer<typeof settingsSchema>;
export type CategoryGroupSchema = z.infer<typeof categoryGroupSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;
export type PaginationSchema = z.infer<typeof paginationSchema>;
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;
