import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { incomeSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const createIncomeHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = incomeSchema.parse(body);

  const income = await prisma.monthlyIncome.create({
    data: {
      userId: user!.id,
      amount,
      month,
      year,
    },
  });

  return NextResponse.json(
    { message: "Income created", monthly_income: income },
    { status: 200 },
  );
};

export const POST = customMiddleware(createIncomeHandler);
