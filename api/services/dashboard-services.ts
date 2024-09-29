import axiosInstance from "@/lib/axiosInstance";
import { DashboardParamsSchema } from "@/lib/schema/dashboard";
import { DefaultOptions } from "../types";
import { DashboardMonthResponse, DashboardResponse } from "../types/dashboard";

export const getDashboardData = async (
  options: DefaultOptions<DashboardParamsSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<DashboardResponse>(
    endpoint ?? "/dashboard",
    {
      params: queryParams,
      signal,
    },
  );
  return response.data;
};

export const getMonthlyDashboardData = async (options: DefaultOptions) => {
  const { endpoint, signal } = options;

  const response = await axiosInstance.get<DashboardMonthResponse>(
    endpoint ?? `/dashboard/month`,
    {
      signal,
    },
  );
  return response.data;
};
