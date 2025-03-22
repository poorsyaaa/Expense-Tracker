import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../services/expenses-services";
import { ExpenseSchema, UpdateExpenseSchema } from "@/lib/schema/expenses";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExpenseSchema) =>
      createExpense({
        endpoint: "/expenses",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-month-data"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: string;
      data: UpdateExpenseSchema;
    }) =>
      updateExpense({
        endpoint: `/expenses/${expenseId}`,
        pathParams: { expenseId },
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-month-data"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) =>
      deleteExpense({
        endpoint: `/expenses/${expenseId}`,
        pathParams: { expenseId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-month-data"] });
    },
  });
};
