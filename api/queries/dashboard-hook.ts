import { DashboardParamsScehema } from "@/lib/schema/dashboard";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboard-services";

export const useGetDashboardData = (
  dashboardParams: DashboardParamsScehema,
) => {
  return useQuery({
    queryKey: ["dashboard-data", dashboardParams.month, dashboardParams.year],
    queryFn: ({ signal }) =>
      getDashboardData({
        endpoint: "/dashboard",
        queryParams: dashboardParams,
        signal,
      }),
    enabled: !!dashboardParams.month && !!dashboardParams.year,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
