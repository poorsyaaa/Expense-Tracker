import { useMutation } from "@tanstack/react-query";
import {
  createCategory,
  createOrUpdateMonthlyBudget,
  createOrUpdateMonthlyIncome,
  createOrUpdateSettings,
  deleteCategory,
  updateCategory,
} from "../services/settings-services";

export const useCreateOrUpdateSettings = () => {
  return useMutation({
    mutationFn: createOrUpdateSettings,
  });
};

export const useCreateOrUpdateMonthlyBudget = () => {
  return useMutation({
    mutationFn: createOrUpdateMonthlyBudget,
  });
};

export const useCreateOrUpdateMonthlyIncome = () => {
  return useMutation({
    mutationFn: createOrUpdateMonthlyIncome,
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategory,
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategory,
  });
};
