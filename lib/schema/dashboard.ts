import { z } from "zod";

export const dashboardSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(3000),
});

export type DashboardParams = z.infer<typeof dashboardSchema>;
