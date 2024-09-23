import axiosInstance from "@/lib/axiosInstance";
import {
  BudgetSchema,
  CategorySchema,
  IncomeSchema,
  PaginationSchema,
  SettingsSchema,
} from "@/lib/schema/settings";
import { DefaultOptions } from "../types";
import {
  CategoriesResponse,
  DefaultSettingsResponse,
  MonthlyBudgetsResponse,
  MonthlyIncomesResponse,
} from "../types/settings";

export const getDefaultSettings = async (options: DefaultOptions) => {
  const { endpoint, signal } = options;

  const response = await axiosInstance.get<DefaultSettingsResponse>(endpoint, {
    signal,
  });

  return response.data;
};

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

export const getCategories = async (
  options: DefaultOptions<PaginationSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<CategoriesResponse>(
    endpoint ?? "/settings/category",
    {
      params: queryParams,
      signal,
    },
  );

  return response.data;
};

export const createOrUpdateSettings = async (
  options: DefaultOptions<never, SettingsSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(endpoint ?? "/settings", data, {
    signal,
  });
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

export const createCategory = async (
  options: DefaultOptions<never, CategorySchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(
    endpoint ?? "/settings/category",
    data,
    {
      signal,
    },
  );
  return response.data;
};

export const updateCategory = async (
  options: DefaultOptions<never, CategorySchema, { categoryId: string }>,
) => {
  const { endpoint, data, pathParams, signal } = options;

  const response = await axiosInstance.put(
    endpoint ?? `/settings/category/${pathParams?.categoryId}`,
    data,
    {
      signal,
    },
  );
  return response.data;
};

export const getCategory = async (
  options: DefaultOptions<never, never, { categoryId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.get(
    endpoint ?? `/settings/category"}/${pathParams?.categoryId}`,
    {
      signal,
    },
  );
  return response.data;
};

export const deleteCategory = async (
  options: DefaultOptions<never, never, { categoryId: string }>,
) => {
  const { endpoint, pathParams, signal, headers } = options;

  const response = await axiosInstance.delete(
    endpoint ?? `/settings/category"/${pathParams?.categoryId}`,
    {
      signal,
      headers,
    },
  );
  return response.data;
};
