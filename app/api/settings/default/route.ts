import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { settingsSchema } from "@/lib/schema/settings";
import {
  CustomNextRequest,
  CustomHandler,
  customMiddleware,
} from "@/lib/server/middleware";

const updateSettingsHandler: CustomHandler = async (req: CustomNextRequest) => {
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

  return NextResponse.json(
    { message: "Settings updated", default_settings: defaults },
    { status: 200 },
  );
};

const getSettingsHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const settings = await prisma.settingsDefaults.findUnique({
    where: { userId: user!.id },
  });

  return NextResponse.json({ settings }, { status: 200 });
};

export const POST = customMiddleware(updateSettingsHandler);
export const GET = customMiddleware(getSettingsHandler);
