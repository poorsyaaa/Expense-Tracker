// /pages/api/dashboard.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";
import { dashboardParamsSchema } from "@/lib/schema/dashboard";
import { getDateRanges } from "@/lib/server/utils";
import {
  startOfYear,
  endOfYear,
  subMonths,
  format,
  getMonth,
  getYear,
} from "date-fns";

export const dynamic = "force-dynamic"; // Required when using req.nextUrl.searchParams

const getDashboardDataHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;
  const { searchParams } = req.nextUrl;

  // Parse and validate query parameters
  const { year, month } = dashboardParamsSchema.parse({
    year: searchParams.get("year")
      ? Number(searchParams.get("year"))
      : undefined,
    month: searchParams.get("month")
      ? Number(searchParams.get("month"))
      : undefined,
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const {
    startOfMonth,
    endOfMonth,
    previousYear,
    startOfPreviousMonth,
    endOfPreviousMonth,
  } = getDateRanges(year ?? currentYear, month ?? currentMonth);

  const adjustedDate = subMonths(startOfMonth, 11);
  const normalizedAdjustedMonth = adjustedDate.getMonth() + 1;

  // Execute multiple Prisma queries in a transaction
  const [
    totalExpensesAllTimeResult,
    totalExpensesThisYearResult,
    monthlyBudgetResult,
    expensesThisMonthResult,
    totalIncomeResult,
    spendingByCategoryResult,
    incomeVsExpensesIncomeResult,
    incomeVsExpensesExpensesResult,
    recentExpensesResult,
    upcomingExpensesResult,
    settingsDefaultsResult,
    previousMonthExpensesResult,
  ] = await prisma.$transaction([
    // 1. Total Expenses (All-Time)
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId: user!.id },
    }),
    // 2. Total Expenses (This Year)
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: {
          gte: startOfYear(year ? new Date(year, 0, 1) : currentDate),
          lt: endOfYear(year ? new Date(year, 0, 1) : currentDate),
        },
      },
    }),
    // 3. Monthly Budget (Current Month)
    prisma.monthlyBudget.findUnique({
      where: {
        userId_month_year: {
          userId: user!.id,
          month: month ?? currentMonth,
          year: year ?? currentYear,
        },
      },
      select: { amount: true },
    }),
    // 4. Expenses This Month
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    }),
    // 5. Total Income (This Year)
    prisma.monthlyIncome.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        year: year ?? currentYear,
      },
    }),
    // 6. Spending by Category
    prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: { userId: user!.id },
      orderBy: { _sum: { amount: "desc" } },
    }),
    // 7. Income vs Expenses (Last 12 Months) - Income
    prisma.monthlyIncome.findMany({
      where: {
        userId: user!.id,
        OR: [
          {
            year: previousYear,
            month: {
              gte: normalizedAdjustedMonth,
            },
          },
          {
            year: year ?? currentYear,
            month: {
              lte: month ?? currentMonth,
            },
          },
        ],
      },
      select: { month: true, amount: true, year: true },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    }),
    // 8. Income vs Expenses (Last 12 Months) - Expenses
    prisma.expense.findMany({
      where: {
        userId: user!.id,
        startDate: {
          gte: adjustedDate,
          lt: endOfMonth,
        },
      },
      select: {
        startDate: true,
        amount: true,
      },
    }),
    // 9. Recent Expenses (Last 5)
    prisma.expense.findMany({
      where: { userId: user!.id },
      orderBy: { startDate: "desc" },
      take: 5,
      select: {
        id: true,
        description: true,
        amount: true,
        category: {
          select: { name: true },
        },
        paymentMethod: true,
        startDate: true,
      },
    }),
    // 10. Upcoming Expenses (Due Date >= Today)
    prisma.expense.findMany({
      where: {
        userId: user!.id,
        dueDate: {
          gte: new Date(),
        },
        isPaid: false,
      },
      orderBy: { dueDate: "asc" },
      select: {
        id: true,
        description: true,
        amount: true,
        dueDate: true,
        category: {
          select: { name: true, icon: true },
        },
      },
    }),
    // 11. Settings Defaults
    prisma.settingsDefaults.findUnique({
      where: { userId: user!.id },
      select: { defaultBudget: true, defaultIncome: true },
    }),
    // 12. Previous Month Expenses
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: {
          gte: startOfPreviousMonth,
          lt: endOfPreviousMonth,
        },
      },
    }),
  ]);

  // **Cards Calculation**

  const totalExpensesAllTime = totalExpensesAllTimeResult?._sum.amount ?? 0;
  const totalExpensesThisYear = totalExpensesThisYearResult?._sum.amount ?? 0;
  const monthlyBudget =
    monthlyBudgetResult?.amount ?? settingsDefaultsResult?.defaultBudget ?? 0;
  const totalExpensesThisMonth = expensesThisMonthResult._sum.amount ?? 0;
  const remainingBudget = monthlyBudget - totalExpensesThisMonth;
  const previousMonthExpenses = previousMonthExpensesResult._sum.amount ?? 0;

  // **Overviews Calculation**

  const totalIncome =
    totalIncomeResult._sum.amount ?? settingsDefaultsResult?.defaultIncome ?? 0;
  const totalSavingsThisYear = totalIncome - totalExpensesThisYear;

  // **Charts Calculation**

  // Fetch existing categories for spending by category
  const existingCategories = await prisma.category.findMany({
    where: {
      userId: user!.id,
      id: {
        in: spendingByCategoryResult.map((category) => category.categoryId),
      },
    },
    select: { id: true, name: true, color: true, icon: true },
  });

  const spendingByCategory = spendingByCategoryResult.map((category) => {
    const existingCategory = existingCategories.find(
      (c) => c.id === category.categoryId,
    );

    return {
      categoryId: existingCategory?.id,
      categoryName: existingCategory?.name,
      amount: category._sum?.amount ?? 0,
      fill: existingCategory?.color,
      icon: existingCategory?.icon,
    };
  });

  // Income vs Expenses for the last 12 months
  const incomeVsExpenses = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(startOfMonth, 11 - i);
    const queryYear = date.getFullYear();
    const monthIndex = date.getMonth() + 1;

    const monthName = format(date, "MMM");

    const income =
      incomeVsExpensesIncomeResult.find(
        (m) => m.month === monthIndex && m.year === queryYear,
      )?.amount ??
      settingsDefaultsResult?.defaultIncome ??
      0;

    const expenses = incomeVsExpensesExpensesResult
      .filter((expense) => {
        return (
          getMonth(expense.startDate) + 1 === monthIndex &&
          getYear(expense.startDate) === queryYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: monthName,
      income,
      expenses,
    };
  });

  // Calculate budget utilization percentage
  const percentage = monthlyBudget
    ? ((totalExpensesThisMonth / monthlyBudget) * 100).toFixed(2)
    : "0.00";

  // Expense trends for the last 12 months
  const expenseTrends = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(startOfMonth, 11 - i);
    const monthName = format(date, "MMMM");

    const expenseData = incomeVsExpensesExpensesResult
      .filter((expense) => {
        return (
          getMonth(expense.startDate) + 1 === date.getMonth() + 1 &&
          getYear(expense.startDate) === date.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: monthName,
      amount: expenseData ?? 0,
    };
  });

  // **Tables Formatting**

  const recentExpenses = recentExpensesResult.map((expense) => ({
    id: expense.id,
    description: expense.description ?? "No Description",
    amount: expense.amount,
    category: expense.category.name,
    paymentMethod: expense.paymentMethod,
    date: format(expense.startDate, "yyyy-MM-dd"),
  }));

  const upcomingExpenses = upcomingExpensesResult.map((expense) => ({
    id: expense.id,
    name: expense.description ?? "No Description",
    dueDate: expense.dueDate ? format(expense.dueDate, "yyyy-MM-dd") : "",
    amount: expense.amount,
    icon: expense.category.icon ?? "/default-icon.png",
  }));

  // **Response Construction**

  return NextResponse.json(
    {
      card: {
        totalExpenses: totalExpensesAllTime,
        totalExpensesThisYear,
        monthlyBudget,
        totalExpensesThisMonth,
        remainingBudget,
        previousMonthExpenses,
      },
      overview: {
        savingsOverview: {
          totalIncome,
          totalExpenses: totalExpensesThisYear,
          totalSavings: totalSavingsThisYear,
        },
      },
      chart: {
        spendingByCategory,
        incomeVsExpenses,
        budgetUtilized: {
          budget: monthlyBudget,
          utilized: totalExpensesThisMonth,
          percentage,
        },
        expenseTrends,
      },
      table: {
        recentExpenses,
        upcomingExpenses,
      },
      updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    { status: 200 },
  );
};

// Export the GET handler with custom middleware
export const GET = customMiddleware(getDashboardDataHandler);
