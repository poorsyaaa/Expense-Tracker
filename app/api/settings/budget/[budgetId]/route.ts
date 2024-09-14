import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { budgetSchema } from "@/lib/schema/settings";
import {
  CustomHandlerWithParams,
  CustomNextRequest,
  ContextWithParams,
  customMiddleware,
} from "@/lib/server/middleware";

const getBudgetHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const budget = await prisma.monthlyBudget.findFirst({
    where: {
      id: params.budgetId,
      userId: user!.id,
    },
  });

  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json({ monthly_budget: budget }, { status: 200 });
};

const updateBudgetHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = budgetSchema.parse(body);

  const budget = await prisma.monthlyBudget.update({
    where: {
      id: params.budgetId,
      userId: user!.id,
    },
    data: {
      amount,
      month,
      year,
    },
  });

  return NextResponse.json(
    { message: "Budget updated", monthly_budget: budget },
    { status: 200 },
  );
};

export const GET = customMiddleware(getBudgetHandler);
export const PUT = customMiddleware(updateBudgetHandler);
