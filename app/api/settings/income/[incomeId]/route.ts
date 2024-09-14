import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { incomeSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  customMiddleware,
  ContextWithParams,
  CustomHandlerWithParams,
} from "@/lib/server/middleware";

const getIncomeHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const income = await prisma.monthlyIncome.findFirst({
    where: {
      id: params.incomeId,
      userId: user!.id,
    },
  });

  if (!income) {
    return NextResponse.json({ error: "Income not found" }, { status: 404 });
  }

  return NextResponse.json({ monthly_income: income }, { status: 200 });
};

const updateIncomeHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = incomeSchema.parse(body);

  const income = await prisma.monthlyIncome.update({
    where: {
      id: params.incomeId,
      userId: user!.id,
    },
    data: {
      amount,
      month,
      year,
    },
  });

  return NextResponse.json(
    { message: "Income updated", monthly_income: income },
    { status: 200 },
  );
};

export const GET = customMiddleware(getIncomeHandler);
export const PUT = customMiddleware(updateIncomeHandler);
