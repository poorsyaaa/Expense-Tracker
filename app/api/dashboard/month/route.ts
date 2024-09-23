import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";
import {
  endOfMonth,
  format,
  getMonth,
  getYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import { dashboardMonthParamsSchema } from "@/lib/schema/dashboard";

const getDashboardMonthDataHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const monthParam = req.nextUrl.searchParams.get("month");
  const yearParam = req.nextUrl.searchParams.get("year");
  const returnFieldsParam = req.nextUrl.searchParams.getAll("returnFields");

  const { month, year, returnFields } = dashboardMonthParamsSchema.parse({
    month: monthParam ? Number(monthParam) : undefined,
    year: yearParam ? Number(yearParam) : undefined,
    returnFields:
      returnFieldsParam.length > 0 ? returnFieldsParam : ["card", "table"],
  });

  const currentDate = new Date();
  const selectedYear = year ? Number(year) : getYear(currentDate);
  const selectedMonth = month ? Number(month) : getMonth(currentDate) + 1;

  const startOfSelectedMonth = startOfMonth(
    new Date(selectedYear, selectedMonth - 1),
  );
  const endOfSelectedMonth = endOfMonth(startOfSelectedMonth);
  const startOfPreviousMonth = startOfMonth(subMonths(startOfSelectedMonth, 1));
  const endOfPreviousMonth = endOfMonth(startOfPreviousMonth);

  const response = {
    card: {},
    table: {},
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  };

  const settingsDefaults = await prisma.settingsDefaults.findUnique({
    where: { userId: user!.id },
    select: { defaultBudget: true, defaultIncome: true },
  });

  const fetchCardData = async () => {
    const [
      totalExpensesAllTime,
      currentBudget,
      expensesThisMonth,
      previousMonthExpenses,
    ] = await prisma.$transaction([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { userId: user!.id },
      }),
      prisma.monthlyBudget.findUnique({
        where: {
          userId_month_year: {
            userId: user!.id,
            month: selectedMonth,
            year: selectedYear,
          },
        },
        select: { amount: true },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId: user!.id,
          startDate: { gte: startOfSelectedMonth, lt: endOfSelectedMonth },
        },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId: user!.id,
          startDate: { gte: startOfPreviousMonth, lt: endOfPreviousMonth },
        },
      }),
    ]);

    const currentBudgetAmount =
      currentBudget?.amount ?? settingsDefaults?.defaultBudget ?? 0;
    const expensesThisMonthAmount = expensesThisMonth._sum.amount ?? 0;

    response.card = {
      totalExpensesAllTime: totalExpensesAllTime._sum.amount ?? 0,
      currentMonthlyBudget: currentBudgetAmount,
      expensesThisMonth: expensesThisMonthAmount,
      remainingBudget: currentBudgetAmount - expensesThisMonthAmount,
      previousMonthExpenses: previousMonthExpenses._sum.amount ?? 0,
    };
  };

  const fetchTableData = async () => {
    const [recentExpenses, upcomingExpenses] = await prisma.$transaction([
      prisma.expense.findMany({
        where: { userId: user!.id },
        orderBy: { startDate: "desc" },
        take: 5,
        select: {
          id: true,
          description: true,
          amount: true,
          category: { select: { name: true } },
          paymentMethod: true,
          startDate: true,
        },
      }),
      prisma.expense.findMany({
        where: {
          userId: user!.id,
          dueDate: { gte: startOfSelectedMonth },
          isPaid: false,
        },
        orderBy: { dueDate: "asc" },
        select: {
          id: true,
          description: true,
          amount: true,
          dueDate: true,
          category: { select: { name: true, icon: true } },
        },
      }),
    ]);

    response.table = {
      recentExpenses: recentExpenses.map((expense) => ({
        id: expense.id,
        description: expense.description ?? "No Description",
        amount: expense.amount,
        category: expense.category.name,
        paymentMethod: expense.paymentMethod,
        date: format(expense.startDate, "yyyy-MM-dd"),
      })),
      upcomingExpenses: upcomingExpenses.map((expense) => ({
        id: expense.id,
        name: expense.description ?? "No Description",
        dueDate: expense.dueDate ? format(expense.dueDate, "yyyy-MM-dd") : "",
        amount: expense.amount,
        icon: expense.category.icon ?? "/default-icon.png",
      })),
    };
  };

  const includeCard =
    returnFields.includes("card") ||
    returnFields.some((field) =>
      [
        "totalExpensesAllTime",
        "currentMonthlyBudget",
        "expensesThisMonth",
        "remainingBudget",
        "previousMonthExpenses",
      ].includes(field),
    );

  const includeTable =
    returnFields.includes("table") ||
    returnFields.some((field) =>
      ["recentExpenses", "upcomingExpenses"].includes(field),
    );

  await Promise.all([
    includeCard && fetchCardData(),
    includeTable && fetchTableData(),
  ]);

  return NextResponse.json(response, { status: 200 });
};

export const GET = customMiddleware(getDashboardMonthDataHandler);
