import axiosInstance from "@/lib/axiosInstance";
import {
  ExpenseSchema,
  QuerySchema,
  UpdateExpenseSchema,
} from "@/lib/schema/expenses";

export const getExpenses = async (params: QuerySchema) => {
  const response = await axiosInstance.get(`/expenses`, {
    params,
  });
  return response.data;
};

export const createExpense = async (expenseData: ExpenseSchema) => {
  const response = await axiosInstance.post("/expenses", expenseData);
  return response.data;
};

export const getExpenseById = async (expenseId: string) => {
  const response = await axiosInstance.get(`/expenses/${expenseId}`);
  return response.data;
};

export const updateExpense = async ({
  expenseId,
  expenseData,
}: {
  expenseId: string;
  expenseData: UpdateExpenseSchema;
}) => {
  const response = await axiosInstance.put(
    `/expenses/${expenseId}`,
    expenseData,
  );
  return response.data;
};

export const deleteExpense = async (expenseId: string) => {
  const response = await axiosInstance.delete(`/expenses/${expenseId}`);
  return response.data;
};
