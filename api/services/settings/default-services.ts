import axiosInstance from "@/lib/axiosInstance";
import { SettingsSchema } from "@/lib/schema/settings";
import { DefaultOptions } from "../../types";
import { DefaultSettingsResponse } from "../../types/settings";

export const getDefaultSettings = async (options: DefaultOptions) => {
  const { endpoint, signal } = options;

  const response = await axiosInstance.get<DefaultSettingsResponse>(
    endpoint ?? "/settings/default",
    {
      signal,
    },
  );

  return response.data;
};

export const createOrUpdateSettings = async (
  options: DefaultOptions<never, SettingsSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(endpoint ?? "/settings", data, {
    signal,
  });
  return response.data;
};
