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

  const monthParam = req.nextUrl.searchParams.get("month");
  const yearParam = req.nextUrl.searchParams.get("year");
  const pageParam = req.nextUrl.searchParams.get("page");
  const pageSizeParam = req.nextUrl.searchParams.get("pageSize");
  const sortByParam = req.nextUrl.searchParams.get("sortBy");
  const orderParam = req.nextUrl.searchParams.get("order");

  const { page, pageSize, sortBy, order, month, year } = paginationSchema.parse(
    {
      month: monthParam ? Number(monthParam) : undefined,
      year: yearParam ? Number(yearParam) : undefined,
      page: pageParam ? Number(pageParam) : 1,
      pageSize: pageSizeParam ? Number(pageSizeParam) : 10,
      sortBy: sortByParam ?? "createdAt",
      order: orderParam ?? "asc",
    },
  );

  const incomes =
    month && year
      ? await prisma.monthlyIncome.findMany({
          where: {
            userId: user!.id,
            month: month,
            year: year,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            [sortBy]: order,
          },
        })
      : await prisma.monthlyIncome.findMany({
          where: { userId: user!.id },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            [sortBy]: order,
          },
        });

  const totalItems =
    month && year
      ? await prisma.monthlyIncome.count({
          where: {
            userId: user!.id,
            month: month,
            year: year,
          },
        })
      : await prisma.monthlyIncome.count({
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
