import axiosInstance from "@/lib/axiosInstance";
import { PasswordSchema, ProfileSchema } from "@/lib/schema/profile";
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

export const resetPassword = async (
  options: DefaultOptions<never, PasswordSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post(
    endpoint ?? "/profile/reset-password",
    data,
    {
      signal,
    },
  );

  return response.data;
};
