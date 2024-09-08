import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { categorySchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  customMiddleware,
  ContextWithParams,
  CustomHandlerWithParams,
} from "@/lib/server/middleware";

const getCategoryHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const category = await prisma.category.findFirst({
    where: {
      id: params.categoryId,
      userId: user!.id,
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category, { status: 200 });
};

const updateCategoryHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  const body = await req.json();
  const { name, icon, color } = categorySchema.parse(body);

  const category = await prisma.category.update({
    where: {
      id: params.categoryId,
      userId: user!.id,
    },
    data: {
      name,
      icon,
      color,
    },
  });

  return NextResponse.json(category, { status: 200 });
};

const deleteCategoryHandler: CustomHandlerWithParams = async (
  req: CustomNextRequest,
  { params }: ContextWithParams,
) => {
  const { user } = req;

  await prisma.category.delete({
    where: {
      id: params.categoryId,
      userId: user!.id,
    },
  });

  return NextResponse.json({ message: "Category deleted" }, { status: 200 });
};

export const GET = customMiddleware(getCategoryHandler);
export const PUT = customMiddleware(updateCategoryHandler);
export const DELETE = customMiddleware(deleteCategoryHandler);
