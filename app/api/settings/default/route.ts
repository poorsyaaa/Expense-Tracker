import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { settingsSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandlerWithResponse,
  customMiddleware,
} from "@/lib/server/middleware";

const updateSettingsHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();
  const {
    defaultBudget,
    defaultIncome,
    currency,
    locale,
    timeZone,
    dateFormat,
    defaultPaymentMethod,
  } = settingsSchema.parse(body);

  const defaults = await prisma.settingsDefaults.upsert({
    where: { userId: user!.id },
    update: {
      defaultBudget,
      defaultIncome,
      currency,
      locale,
      timeZone,
      dateFormat,
      defaultPaymentMethod,
    },
    create: {
      userId: user!.id,
      defaultBudget,
      defaultIncome,
      currency,
      locale,
      timeZone,
      dateFormat,
      defaultPaymentMethod,
    },
  });

  return NextResponse.json(defaults, { status: 200 });
};

export const POST = customMiddleware(updateSettingsHandler);
