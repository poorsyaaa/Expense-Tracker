import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { settingsSchema } from "@/lib/schema/settings";

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { defaultBudget, defaultIncome } = result.data;

    const defaults = await prisma.settingsDefaults.upsert({
      where: { userId: user.id },
      update: {
        defaultBudget,
        defaultIncome,
      },
      create: {
        userId: user.id,
        defaultBudget,
        defaultIncome,
      },
    });

    return NextResponse.json(defaults, { status: 200 });
  } catch (error) {
    console.error("Error updating settings defaults:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
