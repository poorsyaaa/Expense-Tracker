import { DashboardParamsSchema } from "@/lib/schema/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardData,
  getMonthlyDashboardData,
} from "../services/dashboard-services";

export const useGetDashboardData = (dashboardParams: DashboardParamsSchema) => {
  return useQuery({
    queryKey: [
      "dashboard-data",
      dashboardParams.dateRange,
      dashboardParams.startDate,
      dashboardParams.endDate,
    ],
    queryFn: ({ signal }) =>
      getDashboardData({
        endpoint: "/dashboard",
        queryParams: dashboardParams,
        signal,
      }),
    enabled:
      Boolean(dashboardParams.dateRange) ||
      (Boolean(dashboardParams.startDate) && Boolean(dashboardParams.endDate)),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useGetMonthlyDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-month-data"],
    queryFn: ({ signal }) =>
      getMonthlyDashboardData({
        endpoint: "/dashboard/month",
        signal,
      }),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
