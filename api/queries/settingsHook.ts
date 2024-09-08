import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/settingsServices";
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
