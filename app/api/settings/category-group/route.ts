import { categoryGroupSchema } from "@/lib/schema/settings";
import prisma from "@/lib/server/db";
import {
  CustomHandler,
  customMiddleware,
  CustomNextRequest,
} from "@/lib/server/middleware";
import { NextResponse } from "next/server";

const createCategoryGroupHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();

  const { name } = categoryGroupSchema.parse(body);

  const categoryGroup = await prisma.categoryGroup.create({
    data: {
      userId: user!.id,
      name,
    },
  });

  return NextResponse.json(
    { message: "Category group created", categoryGroup },
    { status: 200 },
  );
};

const getCategoryGroupsHandler: CustomHandler = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const categoryGroups = await prisma.categoryGroup.findMany({
    where: { userId: user!.id },
    orderBy: { name: "asc" },
    include: {
      categories: true,
    },
  });

  return NextResponse.json({ categoryGroups }, { status: 200 });
};

export const POST = customMiddleware(createCategoryGroupHandler);
export const GET = customMiddleware(getCategoryGroupsHandler);
