import axiosInstance from "@/lib/axiosInstance";
import {
  ExpenseSchema,
  QueryParamsSchema,
  UpdateExpenseSchema,
} from "@/lib/schema/expenses";
import { DefaultOptions } from "../types";

// Get expenses using the dynamic endpoint from options
export const getExpenses = async (
  options: DefaultOptions<QueryParamsSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get(endpoint, {
    params: queryParams,
    signal,
  });
  return response.data;
};

// Create a new expense using the dynamic endpoint from options
export const createExpense = async (
  options: DefaultOptions<never, ExpenseSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(endpoint, data, {
    signal,
  });
  return response.data;
};

// Get an expense by ID using the dynamic endpoint from options
export const getExpenseById = async (
  options: DefaultOptions<never, never, { expenseId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.get(
    endpoint ?? `/expenses/${pathParams?.expenseId}`,
    {
      signal,
    },
  );
  return response.data;
};

// Update an expense using the dynamic endpoint from options
export const updateExpense = async (
  options: DefaultOptions<never, UpdateExpenseSchema, { expenseId: string }>,
) => {
  const { endpoint, pathParams, data, signal } = options;

  const response = await axiosInstance.put(
    endpoint ?? `/expenses/${pathParams?.expenseId}`,
    data,
    {
      signal,
    },
  );
  return response.data;
};

// Delete an expense using the dynamic endpoint from options
export const deleteExpense = async (
  options: DefaultOptions<never, never, { expenseId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.delete(
    endpoint ?? `/expenses/${pathParams?.expenseId}`,
    {
      signal,
    },
  );
  return response.data;
};
