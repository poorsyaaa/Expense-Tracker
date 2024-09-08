import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { queryParamsSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const getSettingsHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;
  const month = req.nextUrl.searchParams.get("month");
  const year = req.nextUrl.searchParams.get("year");

  const { month: parsedMonth, year: parsedYear } = queryParamsSchema.parse({
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : undefined,
  });

  const [settingsResult, categoriesResult, budgetResult, incomeResult] =
    await Promise.allSettled([
      prisma.settingsDefaults.findUnique({ where: { userId: user!.id } }),
      prisma.category.findMany({ where: { userId: user!.id } }),
      parsedMonth && parsedYear
        ? prisma.monthlyBudget.findFirst({
            where: { userId: user!.id, month: parsedMonth, year: parsedYear },
          })
        : prisma.monthlyBudget.findMany({ where: { userId: user!.id } }),
      parsedMonth && parsedYear
        ? prisma.monthlyIncome.findFirst({
            where: { userId: user!.id, month: parsedMonth, year: parsedYear },
          })
        : prisma.monthlyIncome.findMany({ where: { userId: user!.id } }),
    ]);

  const settings =
    settingsResult.status === "fulfilled" ? settingsResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const monthlyBudget =
    budgetResult.status === "fulfilled" ? budgetResult.value : [];
  const monthlyIncome =
    incomeResult.status === "fulfilled" ? incomeResult.value : [];

  return NextResponse.json(
    {
      default_settings: settings,
      categories,
      monthly_budgets: monthlyBudget,
      monthly_incomes: monthlyIncome,
    },
    { status: 200 },
  );
};

export const GET = customMiddleware(getSettingsHandler);
