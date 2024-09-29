import { getCategoryGroups } from "@/api/services/settings/category-group-services";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryGroups = () => {
  return useQuery({
    queryKey: ["category-groups"],
    queryFn: ({ signal }) =>
      getCategoryGroups({
        endpoint: "/settings/category-group",
        signal,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
