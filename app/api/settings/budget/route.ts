import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { budgetSchema, paginationSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

export const dynamic = "force-dynamic";

const createBudgetHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = budgetSchema.parse(body);

  const budget = await prisma.monthlyBudget.create({
    data: {
      userId: user!.id,
      amount,
      month,
      year,
    },
  });

  return NextResponse.json(
    { message: "Budget created", monthly_budget: budget },
    { status: 200 },
  );
};

const getBudgetsHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const pageParams = req.nextUrl.searchParams.get("page");
  const pageSizeParams = req.nextUrl.searchParams.get("pageSize");
  const sortByParams = req.nextUrl.searchParams.get("sortBy");
  const orderParams = req.nextUrl.searchParams.get("order");

  const { page, pageSize, sortBy, order } = paginationSchema.parse({
    page: pageParams ? Number(pageParams) : 1,
    pageSize: pageSizeParams ? Number(pageSizeParams) : 10,
    sortBy: sortByParams ?? "createdAt",
    order: orderParams ?? "asc",
  });

  const budgets = await prisma.monthlyBudget.findMany({
    where: { userId: user!.id },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      [sortBy]: order,
    },
  });

  const totalItems = await prisma.monthlyBudget.count({
    where: { userId: user!.id },
  });

  return NextResponse.json({
    budgets,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
  });
};

export const POST = customMiddleware(createBudgetHandler);
export const GET = customMiddleware(getBudgetsHandler);
