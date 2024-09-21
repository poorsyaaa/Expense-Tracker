import { z } from "zod";

export const dashboardParamsSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(3000),
});

export type DashboardParamsScehema = z.infer<typeof dashboardParamsSchema>;
