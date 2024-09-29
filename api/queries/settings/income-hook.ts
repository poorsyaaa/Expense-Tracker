import {
  getMonthlyIncomes,
  getMonthlyIncome,
} from "@/api/services/settings/income-services";
import { PaginationSchema } from "@/lib/schema/settings";
import { useQuery } from "@tanstack/react-query";

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
