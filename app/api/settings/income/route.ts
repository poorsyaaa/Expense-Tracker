import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { incomeSchema, paginationSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

export const dynamic = "force-dynamic";

const createIncomeHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const body = await req.json();
  const { amount, month, year } = incomeSchema.parse(body);

  const income = await prisma.monthlyIncome.create({
    data: {
      userId: user!.id,
      amount,
      month,
      year,
    },
  });

  return NextResponse.json(
    { message: "Income created", monthly_income: income },
    { status: 200 },
  );
};

const getIncomesHandler: CustomHandler = async (req: CustomNextRequest) => {
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

  const incomes = await prisma.monthlyIncome.findMany({
    where: { userId: user!.id },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      [sortBy]: order,
    },
  });

  const totalItems = await prisma.monthlyIncome.count({
    where: { userId: user!.id },
  });

  return NextResponse.json({
    incomes,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: page,
  });
};

export const POST = customMiddleware(createIncomeHandler);
export const GET = customMiddleware(getIncomesHandler);
