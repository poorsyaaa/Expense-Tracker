import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { updateExpenseSchema } from "@/lib/schema/expenses";
import {
  CustomNextRequest,
  CustomHandlerWithParams,
  customMiddleware,
  ContextWithParams,
} from "@/lib/server/middleware";

const getExpenseHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const expense = await prisma.expense.findFirst({
    where: {
      id: params.expenseId,
      userId: user!.id,
    },
    include: {
      tags: true,
      expenseNote: true,
    },
  });

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json({ expense }, { status: 200 });
};

const updateExpenseHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
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
    tags, // New field: tags to be updated
    expenseNote, // New field: expense notes to be updated
  } = updateExpenseSchema.parse(body);

  const updatedExpense = await prisma.expense.update({
    where: {
      id: params.expenseId,
      userId: user!.id, // Ensuring the expense belongs to the user
    },
    data: {
      description,
      amount,
      categoryId,
      recurring,
      frequency,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      isPaid,
      tags: {
        connectOrCreate: tags?.map((tag: string) => ({
          where: {
            name_userId: { name: tag, userId: user!.id },
          },
          create: { name: tag, userId: user!.id },
        })),
      },
      expenseNote: {
        deleteMany: {},
        create: expenseNote?.map((note: string) => ({
          note,
        })),
      },
    },
  });

  return NextResponse.json(
    { message: "Expense updated", expense: updatedExpense },
    { status: 200 },
  );
};

const deleteExpenseHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const deletedExpense = await prisma.expense.deleteMany({
    where: {
      id: params.expenseId,
      userId: user!.id,
    },
  });

  if (!deletedExpense.count) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Expense deleted successfully" },
    { status: 200 },
  );
};

export const GET = customMiddleware(getExpenseHandler);
export const PUT = customMiddleware(updateExpenseHandler);
export const DELETE = customMiddleware(deleteExpenseHandler);
