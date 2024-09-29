import { useMutation } from "@tanstack/react-query";
import { resetPassword, updateProfile } from "../services/profile-services";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
