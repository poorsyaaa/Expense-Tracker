import {
  createMonthlyBudget,
  updateMonthlyBudget,
} from "@/api/services/settings/budget-services";
import { useMutation } from "@tanstack/react-query";

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
