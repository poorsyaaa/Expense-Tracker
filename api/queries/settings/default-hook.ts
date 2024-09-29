import { getDefaultSettings } from "@/api/services/settings/default-services";
import { useQuery } from "@tanstack/react-query";

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
