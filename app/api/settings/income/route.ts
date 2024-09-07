import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { incomeSchema } from "@/lib/schema/settings";

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = incomeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { amount, month, year } = result.data;

    const upsertedIncome = await prisma.monthlyIncome.upsert({
      where: {
        userId_month_year: {
          userId: user.id,
          month: month,
          year: year,
        },
      },
      create: {
        userId: user.id,
        amount,
        month: month,
        year: year,
      },
      update: {
        amount,
      },
    });

    return NextResponse.json(
      { monthlyIncome: upsertedIncome },
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
