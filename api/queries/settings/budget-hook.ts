import {
  getMonthlyBudget,
  getMonthlyBudgets,
} from "@/api/services/settings/budget-services";
import { PaginationSchema } from "@/lib/schema/settings";
import { useQuery } from "@tanstack/react-query";

export const useGetMonthlyBudgets = (paginationParams: PaginationSchema) => {
  return useQuery({
    queryKey: ["monthly-budgets", paginationParams],
    queryFn: ({ signal }) =>
      getMonthlyBudgets({
        endpoint: "/settings/budget",
        queryParams: paginationParams,
        signal,
      }),
    enabled: !!paginationParams.page && !!paginationParams.pageSize,
  });
};

export const useGetMontlyBudget = (budgetId: string) => {
  return useQuery({
    queryKey: ["budget", budgetId],
    queryFn: ({ signal }) =>
      getMonthlyBudget({
        endpoint: "/settings/budget",
        pathParams: { budgetId },
        signal,
      }),
    enabled: !!budgetId,
  });
};
