import axiosInstance from "@/lib/axiosInstance";
import { DashboardParamsScehema } from "@/lib/schema/dashboard";
import { DefaultOptions } from "../types";
import { DashboardResponse } from "../types/dashboard";

export const getDashboardData = async (
  options: DefaultOptions<DashboardParamsScehema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<DashboardResponse>(endpoint, {
    params: queryParams,
    signal,
  });
  return response.data;
};
