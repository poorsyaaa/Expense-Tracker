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

const getDashboardMonthDataHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate) + 1;

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));

  const [
    totalExpensesAllTimeResult,
    currentMonthlyBudget,
    currentExpensesThisMonth,
    previousMonthExpenses,
    recentExpenses,
    upcomingExpenses,
    settingsDefaults,
  ] = await prisma.$transaction([
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId: user!.id },
    }),
    prisma.monthlyBudget.findUnique({
      where: {
        userId_month_year: {
          userId: user!.id,
          month: currentMonth,
          year: currentYear,
        },
      },
      select: { amount: true },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        startDate: {
          gte: startOfCurrentMonth,
          lt: endOfCurrentMonth,
        },
      },
    }),
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
    prisma.expense.findMany({
      where: {
        userId: user!.id,
        dueDate: {
          gte: currentDate,
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
    prisma.settingsDefaults.findUnique({
      where: { userId: user!.id },
      select: { defaultBudget: true, defaultIncome: true },
    }),
  ]);

  const totalExpensesAllTimeAmount =
    totalExpensesAllTimeResult?._sum.amount ?? 0;
  const currentBudget =
    currentMonthlyBudget?.amount ?? settingsDefaults?.defaultBudget ?? 0;
  const expensesThisMonthAmount = currentExpensesThisMonth._sum.amount ?? 0;
  const remainingBudget = currentBudget - expensesThisMonthAmount;
  const previousMonthExpensesAmount = previousMonthExpenses._sum.amount ?? 0;

  const formattedRecentExpenses = recentExpenses.map((expense) => ({
    id: expense.id,
    description: expense.description ?? "No Description",
    amount: expense.amount,
    category: expense.category.name,
    paymentMethod: expense.paymentMethod,
    date: format(expense.startDate, "yyyy-MM-dd"),
  }));

  const formattedUpcomingExpenses = upcomingExpenses.map((expense) => ({
    id: expense.id,
    name: expense.description ?? "No Description",
    dueDate: expense.dueDate ? format(expense.dueDate, "yyyy-MM-dd") : "",
    amount: expense.amount,
    icon: expense.category.icon ?? "/default-icon.png",
  }));

  return NextResponse.json(
    {
      card: {
        totalExpensesAllTime: totalExpensesAllTimeAmount,
        currentMonthlyBudget: currentBudget,
        expensesThisMonth: expensesThisMonthAmount,
        remainingBudget,
        previousMonthExpenses: previousMonthExpensesAmount,
      },
      table: {
        recentExpenses: formattedRecentExpenses,
        upcomingExpenses: formattedUpcomingExpenses,
      },
      updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    { status: 200 },
  );
};

export const GET = customMiddleware(getDashboardMonthDataHandler);
