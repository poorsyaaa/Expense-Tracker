import { useQuery } from "@tanstack/react-query";
import { getCategory, getSettings } from "../services/settings-services";
import { QueryParamsSchema } from "@/lib/schema/settings";

export const useGetSettings = (queryParams: QueryParamsSchema) => {
  return useQuery({
    queryKey: ["settings", queryParams.month, queryParams.year],
    queryFn: ({ signal }) =>
      getSettings({
        endpoint: "/settings",
        queryParams,
        signal,
      }),
    enabled: !!queryParams.month && !!queryParams.year,
  });
};

export const useGetAllSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: ({ signal }) =>
      getSettings({
        endpoint: "/settings",
        signal,
      }),
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
    enabled: !!categoryId, // Only fetch if categoryId is valid
  });
};
