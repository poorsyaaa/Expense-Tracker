import { useMutation } from "@tanstack/react-query";
import {
  createCategory,
  createMonthlyBudget,
  createMonthlyIncome,
  createOrUpdateSettings,
  deleteCategory,
  updateCategory,
  updateMonthlyBudget,
  updateMonthlyIncome,
} from "../services/settings-services";

export const useCreateOrUpdateSettings = () => {
  return useMutation({
    mutationFn: createOrUpdateSettings,
  });
};

export const useCreateMonthlyBudget = () => {
  return useMutation({
    mutationFn: createMonthlyBudget,
  });
};
export const useUpdateMonthlyBudget = () => {
  return useMutation({
    mutationFn: updateMonthlyBudget,
  });
};

export const useCreateMonthlyIncome = () => {
  return useMutation({
    mutationFn: createMonthlyIncome,
  });
};

export const useUpdateMonthlyIncome = () => {
  return useMutation({
    mutationFn: updateMonthlyIncome,
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
