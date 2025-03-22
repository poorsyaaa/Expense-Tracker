"use client";
import React, { useMemo, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  Plus,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMonthlyDashboardData } from "@/api/queries/dashboard-hook";
import { useGetExpensesByDate } from "@/api/queries/expenses-hook";
import { useCreateExpense } from "@/api/mutations/expenses-hook";
import { ExpenseSchema } from "@/lib/schema/expenses";
import ExpenseActions from "../_components/expenses/expense-actions";
import ExpenseForm from "../_components/expenses/expense-form";

const ExpensesPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  const currentMonth = format(currentDate, "MMMM yyyy");
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const year = currentDate.getFullYear();

  const { data: monthlyData, isLoading: monthlyLoading } =
    useGetMonthlyDashboardData();
  const { data: expenses, isLoading: expensesLoading } = useGetExpensesByDate({
    month,
    year,
  });
  const createExpense = useCreateExpense();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleCreateExpense = async (data: ExpenseSchema) => {
    try {
      await createExpense.mutateAsync(data);
      setAddExpenseOpen(false);
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

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

  const calculatePercentage = (amount: number, total: number) => {
    if (!total) return 0;
    return Math.round((amount / total) * 100);
  };

  const budgetUsagePercentage = formattedMonthlyData
    ? calculatePercentage(
        formattedMonthlyData.expensesThisMonth,
        formattedMonthlyData.currentMonthlyBudget,
      )
    : 0;

  return (
    <div className="container mx-auto max-w-screen-xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      {/* Header with month navigation and add expense button */}
      <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="mx-4 text-lg font-semibold">{currentMonth}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of your new expense.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              onSubmit={handleCreateExpense}
              onCancel={() => setAddExpenseOpen(false)}
              isSubmitting={createExpense.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Income Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Income
            </CardTitle>
            <div className="flex items-center">
              <ArrowDownCircle className="mr-2 h-4 w-4 text-green-500" />
              <CardDescription>{currentMonth}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formattedMonthlyData ? (
                  <>
                    ₱
                    {formattedMonthlyData.currentMonthlyBudget.toLocaleString()}
                  </>
                ) : (
                  <>₱0.00</>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expenses
            </CardTitle>
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4 text-red-500" />
              <CardDescription>{currentMonth}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formattedMonthlyData ? (
                  <>
                    ₱{formattedMonthlyData.expensesThisMonth.toLocaleString()}
                    <span className="ml-2 text-xs font-normal">
                      <Badge
                        variant={
                          budgetUsagePercentage > 80 ? "destructive" : "outline"
                        }
                      >
                        {budgetUsagePercentage}% of budget
                      </Badge>
                    </span>
                  </>
                ) : (
                  <>₱0.00</>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
            <div className="flex items-center">
              <PiggyBank className="mr-2 h-4 w-4 text-blue-500" />
              <CardDescription>{currentMonth}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formattedMonthlyData ? (
                  <>₱{formattedMonthlyData.remainingBudget.toLocaleString()}</>
                ) : (
                  <>₱0.00</>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              Your latest expenses for {currentMonth}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : expenses && expenses.expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {format(new Date(expense.startDate), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1"
                      >
                        <span>{expense.category.icon}</span>
                        <span>{expense.category.name}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {expense.paymentMethod}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(expense.startDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱{expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <ExpenseActions expense={expense} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-32 items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  No expenses recorded for this month
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddExpenseOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Expense
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpensesPage;
