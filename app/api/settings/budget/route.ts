import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { budgetSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const createBudgetHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = budgetSchema.parse(body);

  const budget = await prisma.monthlyBudget.create({
    data: {
      userId: user!.id,
      amount,
      month,
      year,
    },
  });

  return NextResponse.json({ monthly_budget: budget }, { status: 200 });
};

export const POST = customMiddleware(createBudgetHandler);
