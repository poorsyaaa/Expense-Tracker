import { useMutation } from "@tanstack/react-query";
import {
  createOrUpdateCategory,
  createOrUpdateMonthlyBudget,
  createOrUpdateMonthlyIncome,
  createOrUpdateSettings,
} from "../services/settingsServices";

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

export const useCreateOrUpdateCategory = () => {
  return useMutation({
    mutationFn: createOrUpdateCategory,
  });
};
