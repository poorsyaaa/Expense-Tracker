import { useMutation } from "@tanstack/react-query";
import { createExpense, deleteExpense, updateExpense } from "../expenses";

export const useCreateExpense = () => {
  return useMutation({
    mutationFn: createExpense,
  });
};

export const useUpdateExpense = () => {
  return useMutation({
    mutationFn: updateExpense,
  });
};

export const useDeleteExpense = () => {
  return useMutation({
    mutationFn: deleteExpense,
  });
};
