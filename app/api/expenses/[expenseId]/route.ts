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

  const expense = await prisma.expense.findUnique({
    where: { id: params.expenseId, userId: user!.id },
  });

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(expense, { status: 200 });
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
  } = updateExpenseSchema.parse(body);

  const updatedExpense = await prisma.expense.update({
    where: { id: params.expenseId, userId: user!.id },
    data: {
      description,
      amount,
      categoryId,
      recurring,
      frequency,
      startDate,
      endDate,
      dueDate,
      isPaid,
    },
  });

  return NextResponse.json(updatedExpense, { status: 200 });
};

const deleteExpenseHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const deletedExpense = await prisma.expense.delete({
    where: { id: params.expenseId, userId: user!.id },
  });

  return NextResponse.json(deletedExpense, { status: 200 });
};

export const GET = customMiddleware(getExpenseHandler);
export const PUT = customMiddleware(updateExpenseHandler);
export const DELETE = customMiddleware(deleteExpenseHandler);
