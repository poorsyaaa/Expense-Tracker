import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { categorySchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

const createCategoryHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const body = await req.json();
  const { name, icon, color } = categorySchema.parse(body);

  const category = await prisma.category.create({
    data: {
      userId: user!.id,
      name,
      icon,
      color,
    },
  });

  return NextResponse.json(
    { message: "Category created", category },
    { status: 201 },
  );
};

export const POST = customMiddleware(createCategoryHandler);
