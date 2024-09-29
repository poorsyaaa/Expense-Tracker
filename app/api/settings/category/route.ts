import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { categorySchema, paginationSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

export const dynamic = "force-dynamic";

const createCategoryHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const body = await req.json();
  const { name, icon, color, categoryGroupId } = categorySchema.parse(body);

  const category = await prisma.category.create({
    data: {
      userId: user!.id,
      name,
      icon,
      color,
      categoryGroupId,
    },
  });

  return NextResponse.json(
    { message: "Category created", category },
    { status: 201 },
  );
};

const getCategoriesHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const pageParams = req.nextUrl.searchParams.get("page");
  const pageSizeParams = req.nextUrl.searchParams.get("pageSize");
  const sortByParams = req.nextUrl.searchParams.get("sortBy");
  const orderParams = req.nextUrl.searchParams.get("order");

  const { page, pageSize, sortBy, order } = paginationSchema.parse({
    page: pageParams ? Number(pageParams) : 1,
    pageSize: pageSizeParams ? Number(pageSizeParams) : 10,
    sortBy: sortByParams ?? "year",
    order: orderParams ?? "asc",
  });

  const categories = await prisma.category.findMany({
    where: { userId: user!.id },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      [sortBy]: order,
    },
  });

  const totalItems = await prisma.category.count({
    where: { userId: user!.id },
  });

  return NextResponse.json({
    categories,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
  });
};

export const POST = customMiddleware(createCategoryHandler);
export const GET = customMiddleware(getCategoriesHandler);
