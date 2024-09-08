import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { budgetSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const createOrUpdateBudgetHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = budgetSchema.parse(body);

  const upsertedBudget = await prisma.monthlyBudget.upsert({
    where: {
      userId_month_year: {
        userId: user!.id,
        month,
        year,
      },
    },
    create: {
      userId: user!.id,
      amount,
      month,
      year,
    },
    update: {
      amount,
    },
  });

  return NextResponse.json({ monthlyBudget: upsertedBudget }, { status: 200 });
};

export const POST = customMiddleware(createOrUpdateBudgetHandler);
