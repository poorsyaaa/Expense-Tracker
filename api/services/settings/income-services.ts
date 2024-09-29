import { DefaultOptions } from "@/api/types";
import { MonthlyIncomesResponse } from "@/api/types/settings";
import axiosInstance from "@/lib/axiosInstance";
import { PaginationSchema, IncomeSchema } from "@/lib/schema/settings";

export const getMonthlyIncomes = async (
  options: DefaultOptions<PaginationSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<MonthlyIncomesResponse>(
    endpoint ?? "/settings/income",
    {
      params: queryParams,
      signal,
    },
  );

  return response.data;
};

export const getMonthlyIncome = async (
  options: DefaultOptions<never, never, { incomeId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.get(
    endpoint ?? `/settings/income/${pathParams?.incomeId}`,
    {
      signal,
    },
  );
  return response.data;
};

export const createMonthlyIncome = async (
  options: DefaultOptions<never, IncomeSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(
    endpoint ?? "/settings/income",
    data,
    {
      signal,
    },
  );
  return response.data;
};

export const updateMonthlyIncome = async (
  options: DefaultOptions<never, IncomeSchema, { incomeId: string }>,
) => {
  const { endpoint, data, pathParams, signal } = options;

  const response = await axiosInstance.put(
    endpoint ?? `/settings/income/${pathParams?.incomeId}`,
    data,
    {
      signal,
    },
  );
  return response.data;
};
