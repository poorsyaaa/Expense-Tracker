import {
  getCategories,
  getCategory,
} from "@/api/services/settings/category-services";
import { PaginationSchema } from "@/lib/schema/settings";
import { useQuery } from "@tanstack/react-query";

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
        pathParams: { categoryId },
        signal,
      }),
    enabled: !!categoryId,
  });
};
