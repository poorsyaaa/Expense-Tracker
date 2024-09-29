import {
  createMonthlyIncome,
  updateMonthlyIncome,
} from "@/api/services/settings/income-services";
import { useMutation } from "@tanstack/react-query";

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
