import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { incomeSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const createOrUpdateIncomeHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = incomeSchema.parse(body);

  const upsertedIncome = await prisma.monthlyIncome.upsert({
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

  return NextResponse.json({ monthlyIncome: upsertedIncome }, { status: 200 });
};

export const POST = customMiddleware(createOrUpdateIncomeHandler);
