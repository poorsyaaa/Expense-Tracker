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

export type DashboardParamsSchema = z.infer<typeof dashboardParamsSchema>;
