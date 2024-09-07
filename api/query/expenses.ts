import { useQuery } from "@tanstack/react-query";
import { getExpenseById, getExpenses } from "../expenses";
import { QuerySchema } from "@/lib/schema/expenses";

export const useGetExpensesByDate = (params: QuerySchema) => {
  return useQuery({
    queryKey: ["expenses", params.month, params.year],
    queryFn: () => getExpenses(params),
    enabled: !!params.month && !!params.year,
  });
};

export const useGetAllExpenses = (params: QuerySchema) => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(params),
  });
};

export const useGetExpenseById = (expenseId: string) => {
  return useQuery({
    queryKey: ["expense", expenseId],
    queryFn: () => getExpenseById(expenseId),
  });
};
