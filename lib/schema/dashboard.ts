import { z } from "zod";

export type DateRangeOption =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

export const dateRangeOptions = [
  "today",
  "yesterday",
  "last_7_days",
  "last_30_days",
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "this_year",
  "last_year",
  "custom",
] as const;

export const dashboardParamsSchema = z.object({
  dateRange: z.enum(dateRangeOptions).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const dashboardMonthParamsSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(3000).optional(),
  returnFields: z
    .array(z.enum(["card", "table"]))
    .optional()
    .default(["card", "table"]),
});

export type DashboardParamsSchema = z.infer<typeof dashboardParamsSchema>;
export type DashboardMonthParamsSchema = z.infer<
  typeof dashboardMonthParamsSchema
>;
