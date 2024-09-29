import {
  createCategoryGroup,
  deleteCategoryGroup,
  updateCategoryGroup,
} from "@/api/services/settings/category-group-services";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategoryGroup = () => {
  return useMutation({
    mutationFn: createCategoryGroup,
  });
};

export const useUpdateCategoryGroup = () => {
  return useMutation({
    mutationFn: updateCategoryGroup,
  });
};

export const useDeleteCategoryGroup = () => {
  return useMutation({
    mutationFn: deleteCategoryGroup,
  });
};
