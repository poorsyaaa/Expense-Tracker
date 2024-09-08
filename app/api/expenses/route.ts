import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { expenseSchema, queryParamsSchema } from "@/lib/schema/expenses";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const createExpenseHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;
  const body = await req.json();
  const {
    description,
    amount,
    categoryId,
    recurring,
    frequency,
    startDate,
    endDate,
    dueDate,
    isPaid = false,
  } = expenseSchema.parse(body);

  const newExpense = await prisma.expense.create({
    data: {
      description,
      amount,
      categoryId,
      recurring,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      isPaid,
      userId: user!.id,
    },
  });

  return NextResponse.json(newExpense, { status: 201 });
};

const getExpensesHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const monthParam = req.nextUrl.searchParams.get("month") ?? "";
  const yearParam = req.nextUrl.searchParams.get("year") ?? "";

  const { month, year } = queryParamsSchema.parse({
    month: Number(monthParam),
    year: Number(yearParam),
  });

  const whereClause = {
    userId: user!.id,
    ...(month && year && { month, year }),
  };

  const expenses = await prisma.expense.findMany({
    where: whereClause,
  });

  return NextResponse.json(expenses, { status: 200 });
};

export const POST = customMiddleware(createExpenseHandler);
export const GET = customMiddleware(getExpensesHandler);
