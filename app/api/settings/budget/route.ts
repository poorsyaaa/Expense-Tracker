import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { budgetSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

const createBudgetHandler: CustomHandler = async (req: CustomNextRequest) => {
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

  return NextResponse.json(
    { message: "Budget created", monthly_budget: budget },
    { status: 200 },
  );
};

export const POST = customMiddleware(createBudgetHandler);
