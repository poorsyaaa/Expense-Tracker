import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { updateExpenseSchema } from "@/lib/schema/expenses";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
  HandlerContext,
} from "@/lib/server/middleware";

const getExpenseHandler: CustomHandler = async (
  req: CustomNextRequest,
  context: HandlerContext,
) => {
  const { params } = context;

  if (!params?.expenseId) {
    return NextResponse.json(
      { error: "Expense ID is missing" },
      { status: 400 },
    );
  }

  const { user } = req;

  const expense = await prisma.expense.findFirst({
    where: {
      id: params.expenseId,
      userId: user!.id,
    },
    include: {
      tags: true,
      expenseNote: true,
      category: true,
    },
  });

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json({ expense }, { status: 200 });
};

const updateExpenseHandler: CustomHandler = async (
  req: CustomNextRequest,
  context: HandlerContext,
) => {
  const { params } = context;

  if (!params?.expenseId) {
    return NextResponse.json(
      { error: "Expense ID is missing" },
      { status: 400 },
    );
  }

  const { user } = req;

  const body = await req.json();
  const {
    description,
    amount,
    categoryId,
    startDate,
    dueDate,
    isPaid = false,
    tags,
    expenseNote,
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
      startDate: startDate ? new Date(startDate) : undefined,
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
      expenseNote: expenseNote
        ? {
            upsert: {
              create: {
                note: expenseNote,
              },
              update: {
                note: expenseNote,
              },
            },
          }
        : undefined,
    },
  });

  return NextResponse.json(
    { message: "Expense updated", expense: updatedExpense },
    { status: 200 },
  );
};

const deleteExpenseHandler: CustomHandler = async (
  req: CustomNextRequest,
  context: HandlerContext,
) => {
  const { params } = context;

  if (!params?.expenseId) {
    return NextResponse.json(
      { error: "Expense ID is missing" },
      { status: 400 },
    );
  }

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
