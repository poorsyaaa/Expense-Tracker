import axiosInstance from "@/lib/axiosInstance";
import { ProfileSchema } from "@/lib/schema/profile";
import { DefaultOptions } from "../types";

export const updateProfile = async (
  options: DefaultOptions<never, ProfileSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.put(endpoint ?? "/profile", data, {
    signal,
  });

  return response.data;
};
