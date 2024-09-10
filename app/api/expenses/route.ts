import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { expenseSchema, queryParamsSchema } from "@/lib/schema/expenses";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

export const dynamic = "force-dynamic"; // Add this when using req.nextUrl.searchParams

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
      recurring,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
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
      expenseNote: {
        create: expenseNote?.map((note: string) => ({
          note,
        })),
      },
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
    ...(month &&
      year && {
        startDate: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      }),
  };

  const expenses = await prisma.expense.findMany({
    where: whereClause,
    include: {
      tags: true,
      expenseNote: true,
    },
  });

  return NextResponse.json(expenses, { status: 200 });
};

export const POST = customMiddleware(createExpenseHandler);
export const GET = customMiddleware(getExpensesHandler);
