import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { updateExpenseSchema } from "@/lib/schema/expenses";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { expenseId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.expenseId },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { expenseId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = updateExpenseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

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
    } = result.data;

    const updatedExpense = await prisma.expense.update({
      where: { id: params.expenseId },
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { expenseId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: params.expenseId },
    });

    return NextResponse.json(deletedExpense, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
