import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { categorySchema } from "@/lib/schema/settings";

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { name, icon, color } = result.data;

    const category = await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: {
        icon,
        color,
      },
      create: {
        userId: user.id,
        name,
        icon,
        color,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error during category upsert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
