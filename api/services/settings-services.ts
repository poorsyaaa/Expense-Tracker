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

export const createOrUpdateCategory = async (
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
