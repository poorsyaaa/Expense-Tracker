import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";
import { dashboardParamsSchema } from "@/lib/schema/dashboard";
import { getDateRanges, getLast12Months } from "@/lib/server/utils";
import {
  format,
  subMonths,
  addMonths,
  getMonth,
  getYear,
  startOfMonth,
  endOfMonth,
  differenceInMonths,
} from "date-fns";

export const dynamic = "force-dynamic";

const getDashboardDataHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;
  const { searchParams } = req.nextUrl;

  // Validate query parameters
  const { dateRange, startDate, endDate } = dashboardParamsSchema.parse({
    dateRange: searchParams.get("dateRange") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  });

  const { filterStartDate, filterEndDate } = getDateRanges(
    dateRange,
    startDate,
    endDate,
  );

  // Current Range Calculations
  const currentRangeDuration =
    differenceInMonths(filterEndDate, filterStartDate) + 1;
  const last12Months = getLast12Months(startOfMonth(filterEndDate));

  // Previous Range Calculations
  const previousEndDate = subMonths(filterStartDate, 1);
  const previousStartDate = subMonths(filterStartDate, currentRangeDuration);

  // Prisma Transaction
  const [
    totalIncomeAggregate,
    spendingByCategory,
    incomeLast12Months,
    expensesLast12Months,
    totalExpensesAggregate,
    selectedBudgets,
    previousBudgets,
    settingsDefaults,
  ] = await prisma.$transaction([
    // Total Income (Last 12 Months)
    prisma.monthlyIncome.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        OR: last12Months.map(({ year, month }) => ({ year, month })),
      },
    }),

    // Spending by Category (Current Range)
    prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: { gte: filterStartDate, lte: filterEndDate },
      },
      orderBy: { _sum: { amount: "desc" } },
    }),

    // Income Last 12 Months Details
    prisma.monthlyIncome.findMany({
      where: {
        userId: user!.id,
        OR: last12Months.map(({ year, month }) => ({ year, month })),
      },
      select: { month: true, amount: true, year: true },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    }),

    // Expenses Last 12 Months Details
    prisma.expense.findMany({
      where: {
        userId: user!.id,
        startDate: {
          gte: subMonths(startOfMonth(filterEndDate), 11),
          lte: endOfMonth(filterEndDate),
        },
      },
      select: { startDate: true, amount: true },
    }),

    // Total Expenses (Current Range)
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: { gte: filterStartDate, lte: filterEndDate },
      },
    }),

    // Budgets for Current Range
    prisma.monthlyBudget.findMany({
      where: {
        userId: user!.id,
        OR: Array.from({ length: currentRangeDuration }, (_, i) => {
          const date = addMonths(filterStartDate, i);
          return { year: getYear(date), month: getMonth(date) + 1 };
        }),
      },
      select: { month: true, year: true, amount: true },
    }),

    // Budgets for Previous Range
    prisma.monthlyBudget.findMany({
      where: {
        userId: user!.id,
        OR: Array.from({ length: currentRangeDuration }, (_, i) => {
          const date = addMonths(previousStartDate, i);
          return { year: getYear(date), month: getMonth(date) + 1 };
        }),
      },
      select: { month: true, year: true, amount: true },
    }),

    // Settings Defaults
    prisma.settingsDefaults.findUnique({
      where: { userId: user!.id },
      select: { defaultBudget: true, defaultIncome: true },
    }),
  ]);

  // Calculations
  const totalIncome =
    totalIncomeAggregate._sum.amount ?? settingsDefaults?.defaultIncome ?? 0;
  const totalExpenses = totalExpensesAggregate._sum.amount ?? 0;
  const totalSavings = totalIncome - totalExpenses;

  const currentBudget = selectedBudgets.reduce((sum, b) => sum + b.amount, 0);
  const previousBudget = previousBudgets.reduce((sum, b) => sum + b.amount, 0);

  // Fetch Existing Categories Outside Transaction
  const existingCategories = await prisma.category.findMany({
    where: {
      userId: user!.id,
      id: { in: spendingByCategory.map((cat) => cat.categoryId) },
    },
    select: { id: true, name: true, color: true, icon: true },
  });

  // Format Spending by Category
  const spendingFormatted = spendingByCategory.map((cat) => {
    const category = existingCategories.find((c) => c.id === cat.categoryId);
    return {
      categoryId: category?.id ?? cat.categoryId,
      categoryName: category?.name ?? "Unknown",
      amount: cat._sum?.amount ?? 0,
      fill: category?.color ?? "#000000",
      icon: category?.icon ?? "/default-icon.png",
    };
  });

  // Map Income and Expenses for Last 12 Months
  const incomeMap = new Map(
    incomeLast12Months.map((inc) => [`${inc.year}-${inc.month}`, inc.amount]),
  );
  const expensesMap = new Map<string, number>();
  expensesLast12Months.forEach((exp) => {
    const key = `${getYear(exp.startDate)}-${getMonth(exp.startDate) + 1}`;
    expensesMap.set(key, (expensesMap.get(key) ?? 0) + exp.amount);
  });

  // Income vs Expenses Last 12 Months (Including Missing Months)
  const incomeVsExpenses = last12Months.map(({ year, month }) => {
    const key = `${year}-${month}`;
    const date = new Date(year, month - 1, 1);
    const monthName = format(date, "MMM");
    const income = incomeMap.get(key) ?? settingsDefaults?.defaultIncome ?? 0;
    const expenses = expensesMap.get(key) ?? 0;
    return { month: monthName, income, expenses };
  });

  // Expense Trends (Including Missing Months)
  const expenseTrends = last12Months.map(({ year, month }) => {
    const key = `${year}-${month}`;
    const date = new Date(year, month - 1, 1);
    const monthName = format(date, "MMMM");
    const amount = expensesMap.get(key) ?? 0;
    return { month: monthName, amount };
  });

  // Budget Utilization Calculations
  const selectedExpensesTotal = expensesLast12Months
    .filter(
      (exp) =>
        filterStartDate <= exp.startDate && exp.startDate <= filterEndDate,
    )
    .reduce((sum, exp) => sum + exp.amount, 0);
  const selectedBudgetUtilization = currentBudget
    ? ((selectedExpensesTotal / currentBudget) * 100).toFixed(2)
    : "0.00";

  const previousExpensesTotal = expensesLast12Months
    .filter(
      (exp) =>
        previousStartDate <= exp.startDate && exp.startDate <= previousEndDate,
    )
    .reduce((sum, exp) => sum + exp.amount, 0);
  const previousBudgetUtilization = previousBudget
    ? ((previousExpensesTotal / previousBudget) * 100).toFixed(2)
    : "0.00";

  // Response
  return NextResponse.json(
    {
      overview: {
        savingsOverview: {
          totalIncome,
          totalExpenses,
          totalSavings,
        },
      },
      chart: {
        spendingByCategory: spendingFormatted,
        incomeVsExpenses,
        budgetUtilized: {
          selected: {
            totalBudget: currentBudget,
            totalExpenses: selectedExpensesTotal,
            percentage: selectedBudgetUtilization,
          },
          previous: {
            totalBudget: previousBudget,
            totalExpenses: previousExpensesTotal,
            percentage: previousBudgetUtilization,
          },
        },
        expenseTrends,
      },
      updatedAt: new Date().toISOString(),
    },
    { status: 200 },
  );
};

export const GET = customMiddleware(getDashboardDataHandler);
