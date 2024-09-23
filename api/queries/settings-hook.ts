import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
  getDefaultSettings,
  getMonthlyBudget,
  getMonthlyBudgets,
  getMonthlyIncome,
  getMonthlyIncomes,
} from "../services/settings-services";
import { PaginationSchema } from "@/lib/schema/settings";

export const useGetDefaultSettings = () => {
  return useQuery({
    queryKey: ["default-settings"],
    queryFn: ({ signal }) =>
      getDefaultSettings({
        endpoint: "/settings/default",
        signal,
      }),
  });
};

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

export const useGetMonthlyIncomes = (paginationParams: PaginationSchema) => {
  return useQuery({
    queryKey: ["monthly-incomes", paginationParams],
    queryFn: ({ signal }) =>
      getMonthlyIncomes({
        endpoint: "/settings/income",
        queryParams: paginationParams,
        signal,
      }),
    enabled: !!paginationParams.page && !!paginationParams.pageSize,
  });
};

export const useGetCategories = (paginationParams: PaginationSchema) => {
  return useQuery({
    queryKey: ["categories", paginationParams],
    queryFn: ({ signal }) =>
      getCategories({
        endpoint: "/settings/category",
        queryParams: paginationParams,
        signal,
      }),
    enabled: !!paginationParams.page && !!paginationParams.pageSize,
  });
};

export const useGetCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: ({ signal }) =>
      getCategory({
        endpoint: "/settings/category",
        pathParams: { categoryId },
        signal,
      }),
    enabled: !!categoryId,
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

export const useGetMontlyIncome = (incomeId: string) => {
  return useQuery({
    queryKey: ["income", incomeId],
    queryFn: ({ signal }) =>
      getMonthlyIncome({
        endpoint: "/settings/income",
        pathParams: { incomeId },
        signal,
      }),
    enabled: !!incomeId,
  });
};
