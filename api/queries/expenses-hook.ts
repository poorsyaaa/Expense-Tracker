import { useQuery } from "@tanstack/react-query";
import { getExpenseById, getExpenses } from "../services/expenses-services";
import { QueryParamsSchema } from "@/lib/schema/expenses";

export const useGetExpensesByDate = (queryParams: QueryParamsSchema) => {
  return useQuery({
    queryKey: ["expenses", queryParams.month, queryParams.year],
    queryFn: ({ signal }) =>
      getExpenses({
        endpoint: "/expenses",
        queryParams,
        signal,
      }),
    enabled: !!queryParams.month && !!queryParams.year,
  });
};

export const useGetAllExpenses = (queryParams: QueryParamsSchema) => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: ({ signal }) =>
      getExpenses({
        endpoint: "/expenses",
        queryParams,
        signal,
      }),
  });
};

export const useGetExpenseById = (expenseId: string) => {
  return useQuery({
    queryKey: ["expense", expenseId],
    queryFn: ({ signal }) =>
      getExpenseById({
        endpoint: `/expenses/${expenseId}`,
        signal,
      }),
  });
};
