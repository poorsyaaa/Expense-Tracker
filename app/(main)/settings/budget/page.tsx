"use client";

import { useSettings } from "@/context/settingsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  useGetMonthlyBudgets,
  useGetMonthlyIncomes,
} from "@/api/queries/settings-hook";
import { MonthlyIncome } from "@/api/types/settings";
import {
  CustomModal,
  CustomModalBody,
  CustomModalContent,
  CustomModalDescription,
  CustomModalHeader,
  CustomModalTitle,
} from "@/components/ui/custom-modal";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@radix-ui/react-label";
import { budgetColumns, incomeColumns } from "./column";
import IncomeSettingsForm from "../../_components/forms/income-settings-form";
import BudgetSettingsForm from "../../_components/forms/budget-settings-form";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function Page() {
  const queryClient = useQueryClient();
  const { default_settings, isLoading } = useSettings();

  const [paginationIncomes, setPaginationIncomes] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sortingIncomes, setSortingIncomes] = useState<
    SortingState | undefined
  >(undefined);

  const { data: monthly_incomes, isLoading: isLoadingIncomes } =
    useGetMonthlyIncomes({
      page: paginationIncomes.pageIndex + 1,
      pageSize: paginationIncomes.pageSize,
      sortBy: sortingIncomes?.[0]?.id ?? "createdAt",
      order: sortingIncomes?.[0]?.desc ? "desc" : "asc",
    });

  const [paginationBudgets, setPaginationBudgets] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sortingBudgets, setSortingBudgets] = useState<
    SortingState | undefined
  >(undefined);

  const { data: monthly_budgets, isLoading: isLoadingBudgets } =
    useGetMonthlyBudgets({
      page: paginationBudgets.pageIndex + 1,
      pageSize: paginationBudgets.pageSize,
      sortBy: sortingBudgets?.[0]?.id ?? "createdAt",
      order: sortingBudgets?.[0]?.desc ? "desc" : "asc",
    });

  const [selectedIncome, setSelectedIncome] = useState<MonthlyIncome | null>(
    null,
  );
  const [selectedBudget, setSelectedBudget] = useState<MonthlyIncome | null>(
    null,
  );
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);

  const handleIncomeSelect = (income: MonthlyIncome) => {
    setSelectedIncome(income);
    setOpenIncomeDialog(true);
  };

  const handleBudgetSelect = (budget: MonthlyIncome) => {
    setSelectedBudget(budget);
    setOpenBudgetDialog(true);
  };

  const handleAddNewIncome = () => {
    setSelectedIncome(null);
    setOpenIncomeDialog(true);
  };

  const handleAddNewBudget = () => {
    setSelectedBudget(null);
    setOpenBudgetDialog(true);
  };

  const handleDialogClose = (
    invalidate: boolean = false,
    queryKey?: string,
  ) => {
    if (invalidate && queryKey)
      queryClient.invalidateQueries({ queryKey: [queryKey] });

    setSelectedBudget(null);
    setSelectedIncome(null);
    setOpenIncomeDialog(false);
    setOpenBudgetDialog(false);
  };

  return (
    <>
      <Card className="w-full overflow-auto">
        <div className="flex flex-col p-6 pb-4 md:flex-row md:items-center md:justify-between">
          <CardHeader className="p-0">
            <CardTitle>Monthly Income Settings</CardTitle>
            <CardDescription>Manage your monthly income</CardDescription>
          </CardHeader>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddNewIncome} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add monthly income
            </Button>
          </div>
        </div>
        <CardContent>
          <DataTable
            columns={incomeColumns(handleIncomeSelect)}
            data={monthly_incomes?.incomes ?? []}
            isLoading={isLoading || isLoadingIncomes}
            emptyDisplay={
              <div className="flex flex-col items-center py-10">
                <FilePlus className="mb-4 h-12 w-12" />
                <Label>No Monthly Income found</Label>
                <Label>
                  Click on the plus button to add a new monthly income.
                </Label>
              </div>
            }
            state={{
              totalCount: monthly_incomes?.totalItems ?? 0,
              pagination: paginationIncomes,
              sortBy: sortingIncomes,
            }}
            onPaginationChange={setPaginationIncomes}
            onSortingChange={setSortingIncomes}
          />
        </CardContent>
      </Card>
      <Card className="w-full overflow-auto">
        <div className="flex flex-col p-6 pb-4 md:flex-row md:items-center md:justify-between">
          <CardHeader className="p-0">
            <CardTitle>Monthly Budget Settings</CardTitle>
            <CardDescription>Manage your monthly budget</CardDescription>
          </CardHeader>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddNewBudget} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add monthly budget
            </Button>
          </div>
        </div>
        <CardContent>
          <DataTable
            columns={budgetColumns(handleBudgetSelect)}
            data={monthly_budgets?.budgets ?? []}
            isLoading={isLoading || isLoadingBudgets}
            emptyDisplay={
              <div className="flex flex-col items-center py-10">
                <FilePlus className="mb-4 h-12 w-12" />
                <Label>No Monthly Budget found</Label>
                <Label>
                  Click on the plus button to add a new monthly budget.
                </Label>
              </div>
            }
            state={{
              totalCount: monthly_budgets?.totalItems ?? 0,
              pagination: paginationBudgets,
              sortBy: sortingBudgets,
            }}
            onPaginationChange={setPaginationBudgets}
            onSortingChange={setSortingBudgets}
          />
        </CardContent>
      </Card>

      {/* Dialog for Income Form */}
      <CustomModal open={openIncomeDialog} onOpenChange={handleDialogClose}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>
              {selectedIncome
                ? "Update Monthly Income"
                : "Add New Monthly Income"}
            </CustomModalTitle>
            <CustomModalDescription>
              {selectedIncome
                ? "Update your monthly income"
                : "Add a new monthly income"}
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:pb-0 sm:text-left">
            <IncomeSettingsForm
              selectedIncome={selectedIncome}
              onFormReset={handleDialogClose}
              defaultIncome={default_settings?.defaultIncome}
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>

      {/* Dialog for Budget Form */}
      <CustomModal open={openBudgetDialog} onOpenChange={handleDialogClose}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>
              {selectedBudget
                ? "Update Monthly Budget"
                : "Add New Monthly Budget"}
            </CustomModalTitle>
            <CustomModalDescription>
              {selectedBudget
                ? "Update your monthly budget"
                : "Add a new monthly budget"}
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:pb-0 sm:text-left">
            <BudgetSettingsForm
              selectedBudget={selectedBudget}
              onFormReset={handleDialogClose}
              defaultBudget={default_settings?.defaultBudget}
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>
    </>
  );
}
