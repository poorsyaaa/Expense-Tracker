import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { querySchema } from "@/lib/schema/settings";

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const monthParam = request.nextUrl.searchParams.get("month") ?? "";
    const yearParam = request.nextUrl.searchParams.get("year") ?? "";

    const result = querySchema.safeParse({
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

    const settingsDefaults = await prisma.settingsDefaults.findUnique({
      where: { userId: user.id },
    });

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    const monthlyBudget = await prisma.monthlyBudget.findFirst({
      where: {
        userId: user.id,
        month: month,
        year: year,
      },
    });

    // Fetch the income for the given month and year
    const income = await prisma.monthlyIncome.findFirst({
      where: {
        userId: user.id,
        month: month,
        year: year,
      },
    });

    return NextResponse.json(
      {
        settingsDefaults,
        categories,
        monthlyBudget,
        income,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching settings data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
