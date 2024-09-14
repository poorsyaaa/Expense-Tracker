import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { profileSchema } from "@/lib/schema/profile";
import {
  CustomHandler,
  customMiddleware,
  CustomNextRequest,
} from "@/lib/server/middleware";
import { revalidatePath } from "next/cache";

const updateProfileHandler: CustomHandler = async (req: CustomNextRequest) => {
  const { user } = req;

  const body = await req.json();

  const { username, displayName, email } = profileSchema.parse(body);

  const profile = await prisma.user.update({
    where: {
      id: user!.id,
    },
    data: {
      username,
      displayName,
      email,
    },
  });

  revalidatePath("/");

  return NextResponse.json(
    { message: "Profile updated successfully", profile },
    { status: 200 },
  );
};

export const PUT = customMiddleware(updateProfileHandler);
