import { createOrUpdateSettings } from "@/api/services/settings/default-services";
import { useMutation } from "@tanstack/react-query";

export const useCreateOrUpdateSettings = () => {
  return useMutation({
    mutationFn: createOrUpdateSettings,
  });
};
