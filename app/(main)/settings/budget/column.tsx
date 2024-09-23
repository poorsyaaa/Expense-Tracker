import { ColumnDef } from "@tanstack/react-table";
import { MonthlyBudget, MonthlyIncome } from "@/api/types/settings";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const incomeColumns: (
  handleIncomeSelect: (income: MonthlyIncome) => void,
) => ColumnDef<MonthlyIncome>[] = (handleIncomeSelect) => [
  {
    accessorKey: "amount",
    accessorFn: (row) => row.amount,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "month",
    accessorFn: (row) => row.month,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
  },
  {
    accessorKey: "year",
    accessorFn: (row) => row.year,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleIncomeSelect(row.original)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    ),
  },
];

export const budgetColumns: (
  handleBudgetSelect: (budget: MonthlyBudget) => void,
) => ColumnDef<MonthlyBudget>[] = (handleBudgetSelect) => [
  {
    accessorKey: "amount",
    accessorFn: (row) => row.amount,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "month",
    accessorFn: (row) => row.month,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
  },
  {
    accessorKey: "year",
    accessorFn: (row) => row.year,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleBudgetSelect(row.original)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    ),
  },
];
