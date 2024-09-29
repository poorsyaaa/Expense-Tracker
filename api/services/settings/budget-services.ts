import { DefaultOptions } from "@/api/types";
import { MonthlyBudgetsResponse } from "@/api/types/settings";
import axiosInstance from "@/lib/axiosInstance";
import { BudgetSchema, PaginationSchema } from "@/lib/schema/settings";

export const getMonthlyBudgets = async (
  options: DefaultOptions<PaginationSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<MonthlyBudgetsResponse>(
    endpoint ?? "/settings/budget",
    {
      params: queryParams,
      signal,
    },
  );

  return response.data;
};

export const getMonthlyBudget = async (
  options: DefaultOptions<never, never, { budgetId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.get(
    endpoint ?? `/settings/budget/${pathParams?.budgetId}`,
    {
      signal,
    },
  );
  return response.data;
};

export const createMonthlyBudget = async (
  options: DefaultOptions<never, BudgetSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(
    endpoint ?? "/settings/budget",
    data,
    {
      signal,
    },
  );
  return response.data;
};

export const updateMonthlyBudget = async (
  options: DefaultOptions<never, BudgetSchema, { budgetId: string }>,
) => {
  const { endpoint, data, pathParams, signal } = options;

  const response = await axiosInstance.put(
    endpoint ?? `/settings/budget/${pathParams?.budgetId}`,
    data,
    {
      signal,
    },
  );
  return response.data;
};
