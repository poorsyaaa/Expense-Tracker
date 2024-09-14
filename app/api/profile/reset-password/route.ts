import { NextResponse } from "next/server";
import prisma from "@/lib/server/db";
import { passwordSchema } from "@/lib/schema/profile";
import {
  CustomHandlerWithResponse,
  CustomNextRequest,
  customMiddleware,
} from "@/lib/server/middleware";
import { hash, verify } from "@node-rs/argon2";
import { revalidatePath } from "next/cache";

const resetPasswordHandler: CustomHandlerWithResponse = async (
  req: CustomNextRequest,
) => {
  const { user } = req;

  const body = await req.json();

  const { currentPassword, newPassword, logoutAllSessions } =
    passwordSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user!.id,
    },
  });

  if (!existingUser?.passwordHash) {
    return NextResponse.json(
      {
        error: "Invalid password",
      },
      { status: 400 },
    );
  }

  const validPassword = await verify(
    existingUser.passwordHash,
    currentPassword,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  );

  if (!validPassword) {
    return NextResponse.json(
      {
        error: "Invalid password",
      },
      { status: 400 },
    );
  }

  const passwordHash = await hash(newPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await prisma.user.update({
    where: {
      id: user!.id,
    },
    data: {
      passwordHash: passwordHash,
    },
  });

  if (logoutAllSessions) {
    await prisma.session.deleteMany({
      where: {
        userId: user!.id,
      },
    });
  }

  revalidatePath("/");

  return NextResponse.json(
    { message: "Password updated successfully" },
    {
      status: 200,
    },
  );
};

export const POST = customMiddleware(resetPasswordHandler);
