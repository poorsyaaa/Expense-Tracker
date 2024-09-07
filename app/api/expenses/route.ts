import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { expenseSchema, queryParamsSchema } from "@/lib/schema/expenses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = request.json();

    const result = expenseSchema.safeParse(body);

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
        userId: user.id,
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const monthParam = request.nextUrl.searchParams.get("month") ?? "";
    const yearParam = request.nextUrl.searchParams.get("year") ?? "";

    const result = queryParamsSchema.safeParse({
      month: Number(monthParam),
      year: Number(yearParam),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { month, year } = result.data;

    const whereClause = {
      userId: user.id,
      ...(month && year && { month, year }),
    };

    const expenses = await prisma.expense.findMany({
      where: whereClause,
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
