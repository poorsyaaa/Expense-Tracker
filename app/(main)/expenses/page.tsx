"use client";
import React, { useMemo, useState } from "react";
import DashboardCard from "../_components/dashboard/card/dashboard-card";
import { useGetMonthlyDashboardData } from "@/api/queries/dashboard-hook";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, PhilippinePeso } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useGetExpensesByDate } from "@/api/queries/expenses-hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ExpensesPage = () => {
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMMM yyyy"),
  );

  const { data: monthlyData } = useGetMonthlyDashboardData();
  const { data: expenses } = useGetExpensesByDate({ month: 9, year: 2024 }); // get all expenses per month
  console.log("data", expenses);
  const formattedMonthlyData = useMemo(() => {
    if (!monthlyData) return null;
    return {
      totalExpensesAllTime: monthlyData.card.totalExpensesAllTime,
      currentMonthlyBudget: monthlyData.card.currentMonthlyBudget,
      remainingBudget: monthlyData.card.remainingBudget,
      expensesThisMonth: monthlyData.card.expensesThisMonth,
      previousMonthExpenses: monthlyData.card.previousMonthExpenses,
      recentExpenses: monthlyData.table.recentExpenses,
      upcomingExpenses: monthlyData.table.upcomingExpenses,
    };
  }, [monthlyData]);

  return (
    <div className="text container mx-auto max-w-screen-xl px-4 py-8 text-center md:px-8 md:py-12">
      <div className="mb-4 flex flex-col-reverse items-start justify-center sm:flex-row sm:items-center">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <ChevronLeft />
        </Button>
        <span className="ml-2 mr-2">{currentMonth}</span>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <ChevronRight />
        </Button>
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {formattedMonthlyData && (
          <DashboardCard
            title="Income"
            amount={formattedMonthlyData.totalExpensesAllTime}
            currency="PHP"
            subtitle={`Updated on ${formatDate(new Date())}`}
            icon={<PhilippinePeso className="h-6 w-6 text-muted-foreground" />}
          />
        )}
        {formattedMonthlyData && (
          <DashboardCard
            title="Expenses"
            amount={formattedMonthlyData.totalExpensesAllTime}
            currency="PHP"
            subtitle={`Updated on ${formatDate(new Date())}`}
            icon={<PhilippinePeso className="h-6 w-6 text-muted-foreground" />}
          />
        )}
        {formattedMonthlyData && (
          <DashboardCard
            title="Balance"
            amount={formattedMonthlyData.totalExpensesAllTime}
            currency="PHP"
            subtitle={`Updated on ${formatDate(new Date())}`}
            icon={<PhilippinePeso className="h-6 w-6 text-muted-foreground" />}
          />
        )}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="grid gap-2">
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expenses.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead className="hidden xl:table-column">
                  Category
                </TableHead>
                <TableHead className="hidden xl:table-column">
                  Payment Method
                </TableHead>
                <TableHead className="hidden xl:table-column">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-left">
              {expenses &&
                expenses.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">
                        <span>{expense.category.icon}</span>
                        {expense.description}
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {expense.category.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      {expense.paymentMethod}
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      {new Date(expense.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {expense.amount.toFixed(2)} {"PHP"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
