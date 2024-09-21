import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";
import { dashboardParamsSchema } from "@/lib/schema/dashboard";
import { getDateRanges } from "@/lib/server/utils";

export const dynamic = "force-dynamic"; // Add this when using req.nextUrl.searchParams

const getDashboardDataHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;
  const { searchParams } = req.nextUrl;

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

  const adjustedMonth = (month ?? currentMonth) - 11;
  const adjustedYear = (year ?? currentYear) - (adjustedMonth <= 0 ? 1 : 0);
  const normalizedAdjustedMonth =
    adjustedMonth <= 0 ? 12 + adjustedMonth : adjustedMonth;

  const [
    // 1. Total Expenses (All-Time)
    totalExpensesAllTimeResult,
    // 2. Total Expenses (This Year)
    totalExpensesThisYearResult,
    // 3. Monthly Budget (Current Month)
    monthlyBudgetResult,
    // 4. Expenses This Month
    expensesThisMonthResult,
    // 5. Total Income (This Year)
    totalIncomeResult,
    // 6. Spending by Category
    spendingByCategoryResult,
    // 7. Income vs Expenses (Last 12 Months) - Income
    incomeVsExpensesIncomeResult,
    // 8. Income vs Expenses (Last 12 Months) - Expenses
    incomeVsExpensesExpensesResult,
    // 9. Recent Expenses (Last 5)
    recentExpensesResult,
    // 10. Upcoming Expenses (Due Date >= Today)
    upcomingExpensesResult,
    // 11. Settings Defaults
    settingsDefaultsResult,
    // 12. Previous Month Expenses
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
          gte: new Date(year ?? currentYear, 0, 1),
          lt: new Date((year ?? currentYear) + 1, 0, 1),
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
          gte: new Date(adjustedYear, normalizedAdjustedMonth - 1, 1),
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

  // Cards

  const totalExpensesAllTime = totalExpensesAllTimeResult?._sum.amount ?? 0;
  const totalExpensesThisYear = totalExpensesThisYearResult?._sum.amount ?? 0;
  const monthlyBudget =
    monthlyBudgetResult?.amount ?? settingsDefaultsResult?.defaultBudget ?? 0;
  const totalExpensesThisMonth = expensesThisMonthResult._sum.amount ?? 0;
  const remainingBudget = monthlyBudget - totalExpensesThisMonth;
  const previousMonthExpenses = previousMonthExpensesResult._sum.amount ?? 0;

  // Overviews

  const totalIncome =
    totalIncomeResult._sum.amount ?? settingsDefaultsResult?.defaultIncome ?? 0;
  const totalSavingsThisYear = totalIncome - totalExpensesThisYear;

  // Charts

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

  const incomeVsExpenses = Array.from({ length: 12 }, (_, i) => {
    const monthOffset = (month ?? currentMonth) - 12 + i + 1;
    let monthIndex = monthOffset;
    let queryYear = year ?? currentYear;

    if (monthOffset <= 0) {
      monthIndex = 12 + monthOffset;
      queryYear = (year ?? currentYear) - 1;
    }

    const monthName = new Date(queryYear, monthIndex - 1, 1).toLocaleString(
      "default",
      {
        month: "short",
      },
    );

    const income =
      incomeVsExpensesIncomeResult.find(
        (m) => m.month === monthIndex && m.year === queryYear,
      )?.amount ??
      settingsDefaultsResult?.defaultIncome ??
      0;

    const expenses = incomeVsExpensesExpensesResult
      .filter((expense) => {
        const expenseDate = new Date(expense.startDate);
        return (
          expenseDate.getMonth() + 1 === monthIndex &&
          expenseDate.getFullYear() === queryYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: monthName,
      income,
      expenses,
    };
  });

  const percentage = monthlyBudget
    ? ((totalExpensesThisMonth / monthlyBudget) * 100).toFixed(2)
    : "0.00";

  const expenseTrends = Array.from({ length: 12 }, (_, i) => {
    const monthOffset = (month ?? currentMonth) - 12 + i + 1;
    let monthIndex = monthOffset;
    let queryYear = year ?? currentYear;

    if (monthOffset <= 0) {
      monthIndex = 12 + monthOffset;
      queryYear = (year ?? currentYear) - 1;
    }

    const monthName = new Date(queryYear, monthIndex - 1, 1).toLocaleString(
      "default",
      {
        month: "long",
      },
    );

    const expenseData = incomeVsExpensesExpensesResult
      .filter((expense) => {
        const expenseDate = new Date(expense.startDate);
        return (
          expenseDate.getMonth() + 1 === monthIndex &&
          expenseDate.getFullYear() === queryYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: monthName,
      amount: expenseData ?? 0,
    };
  });

  // Tables

  const recentExpenses = recentExpensesResult.map((expense) => ({
    id: expense.id,
    description: expense.description ?? "No Description",
    amount: expense.amount,
    category: expense.category.name,
    paymentMethod: expense.paymentMethod,
    date: expense.startDate.toISOString().split("T")[0],
  }));

  const upcomingExpenses = upcomingExpensesResult.map((expense) => ({
    id: expense.id,
    name: expense.description ?? "No Description",
    dueDate: expense.dueDate?.toISOString().split("T")[0] ?? "",
    amount: expense.amount,
    icon: expense.category.icon ?? "/default-icon.png",
  }));

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
      updatedAt: new Date().toISOString(),
    },
    { status: 200 },
  );
};

// Export the GET handler with custom middleware
export const GET = customMiddleware(getDashboardDataHandler);
