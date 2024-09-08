import axiosInstance from "@/lib/axiosInstance";
import {
  BudgetSchema,
  CategorySchema,
  IncomeSchema,
  QueryParamsSchema,
  SettingsSchema,
} from "@/lib/schema/settings";
import { DefaultOptions } from "../types";
import { SettingsResponse } from "../types/settings";

export const getSettings = async (
  options: DefaultOptions<QueryParamsSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<SettingsResponse>(endpoint, {
    params: queryParams,
    signal,
  });
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

export const createOrUpdateMonthlyBudget = async (
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

export const createOrUpdateMonthlyIncome = async (
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
