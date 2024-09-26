import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { expenseSchema, queryParamsSchema } from "@/lib/schema/expenses";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

export const dynamic = "force-dynamic"; // Add this when using req.nextUrl.searchParams

const createExpenseHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;
  const body = await req.json();

  const {
    description,
    amount,
    categoryId,
    startDate,
    dueDate,
    isPaid = false,
    type,
    paymentMethod,
    tags,
    expenseNote,
  } = expenseSchema.parse(body);

  const newExpense = await prisma.expense.create({
    data: {
      description,
      amount,
      categoryId,
      startDate: new Date(startDate),
      dueDate: dueDate ? new Date(dueDate) : null,
      isPaid,
      type,
      paymentMethod,
      userId: user!.id,
      tags: {
        connectOrCreate: tags?.map((tag: string) => ({
          where: {
            name_userId: {
              name: tag,
              userId: user!.id,
            },
          },
          create: { name: tag, userId: user!.id },
        })),
      },
      expenseNote: expenseNote
        ? {
            create: {
              note: expenseNote,
            },
          }
        : undefined,
    },
  });

  return NextResponse.json(
    { message: "Expense created", expense: newExpense },
    { status: 201 },
  );
};

const getExpensesHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const monthParam = req.nextUrl.searchParams.get("month") ?? "";
  const yearParam = req.nextUrl.searchParams.get("year") ?? "";

  const { month, year } = queryParamsSchema.parse({
    month: Number(monthParam),
    year: Number(yearParam),
  });

  const [expenses, monthlyBudget, monthlyIncome, settings] =
    await prisma.$transaction([
      prisma.expense.findMany({
        where: {
          userId: user!.id,
          startDate: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        },
        include: {
          tags: true,
          category: true,
        },
      }),
      prisma.monthlyBudget.findUnique({
        where: {
          userId_month_year: {
            userId: user!.id,
            month: month,
            year: year,
          },
        },
      }),
      prisma.monthlyIncome.findUnique({
        where: {
          userId_month_year: {
            userId: user!.id,
            month: month,
            year: year,
          },
        },
        select: { amount: true },
      }),
      prisma.settingsDefaults.findUnique({
        where: { userId: user!.id },
        select: { defaultBudget: true, defaultIncome: true },
      }),
    ]);

  const remainingBudget = monthlyBudget?.amount ?? settings?.defaultBudget ?? 0;
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return NextResponse.json(
    { expenses, remainingBudget, totalExpenses, monthlyIncome },
    { status: 200 },
  );
};

export const POST = customMiddleware(createExpenseHandler);
export const GET = customMiddleware(getExpensesHandler);
