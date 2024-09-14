import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../services/profile-services";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
