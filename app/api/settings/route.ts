import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { queryParamsSchema } from "@/lib/schema/settings";

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const month = request.nextUrl.searchParams.get("month");
    const year = request.nextUrl.searchParams.get("year");

    const result = queryParamsSchema.safeParse({
      month: month ? Number(month) : undefined, // If month is missing, set it as undefined
      year: year ? Number(year) : undefined, // If year is missing, set it as undefined
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { month: parsedMonth, year: parsedYear } = result.data;

    const [
      settingsDefaultsResult,
      categoriesResult,
      monthlyBudgetResult,
      incomeResult,
    ] = await Promise.allSettled([
      prisma.settingsDefaults.findUnique({ where: { userId: user.id } }),
      prisma.category.findMany({ where: { userId: user.id } }),
      parsedMonth && parsedYear
        ? prisma.monthlyBudget.findFirst({
            where: { userId: user.id, month: parsedMonth, year: parsedYear },
          })
        : prisma.monthlyBudget.findMany({ where: { userId: user.id } }),
      parsedMonth && parsedYear
        ? prisma.monthlyIncome.findFirst({
            where: { userId: user.id, month: parsedMonth, year: parsedYear },
          })
        : prisma.monthlyIncome.findMany({ where: { userId: user.id } }),
    ]);

    const settingsDefaults =
      settingsDefaultsResult.status === "fulfilled"
        ? settingsDefaultsResult.value
        : null;
    const categories =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
    const monthlyBudget =
      monthlyBudgetResult.status === "fulfilled"
        ? monthlyBudgetResult.value
        : [];
    const monthlyIncome =
      incomeResult.status === "fulfilled" ? incomeResult.value : [];

    return NextResponse.json(
      {
        default_settings: settingsDefaults,
        categories,
        monthly_budgets: monthlyBudget,
        monthly_incomes: monthlyIncome,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
