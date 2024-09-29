import { categoryGroupSchema } from "@/lib/schema/settings";
import prisma from "@/lib/server/db";
import {
  CustomHandler,
  customMiddleware,
  CustomNextRequest,
  HandlerContext,
} from "@/lib/server/middleware";
import { NextResponse } from "next/server";

const updateCategoryGroupHandler: CustomHandler = async (
  req: CustomNextRequest,
  context: HandlerContext,
) => {
  const { params } = context;

  if (!params?.categoryGroupId) {
    return NextResponse.json(
      { error: "Missing category group ID" },
      { status: 400 },
    );
  }

  const { user } = req;

  const body = await req.json();
  const { name } = categoryGroupSchema.parse(body);

  const categoryGroup = await prisma.categoryGroup.update({
    where: {
      id: params.categoryGroupId,
      userId: user!.id,
    },
    data: {
      name,
    },
  });

  return NextResponse.json(
    {
      message: "Category Group updated",
      categoryGroup,
    },
    { status: 200 },
  );
};

export const deleteCategoryGroupHandler: CustomHandler = async (
  req: CustomNextRequest,
  context: HandlerContext,
) => {
  const { params } = context;

  if (!params?.categoryGroupId) {
    return NextResponse.json(
      { error: "Missing category group ID" },
      { status: 400 },
    );
  }

  const { user } = req;

  await prisma.categoryGroup.delete({
    where: {
      id: params.categoryGroupId,
      userId: user!.id,
    },
  });

  return NextResponse.json(
    { message: "Category Group deleted" },
    { status: 200 },
  );
};

export const PUT = customMiddleware(updateCategoryGroupHandler);
export const DELETE = customMiddleware(deleteCategoryGroupHandler);
