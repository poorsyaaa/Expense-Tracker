"use server";

import { hash, verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia, validateRequest } from "@/lib/auth";
import prisma from "@/lib/server/db";
import {
  LoginSchema,
  loginSchema,
  SignUpSchema,
  signUpSchema,
} from "@/lib/schema/auth-validation";

export const signUpAction = async (
  credentials: SignUpSchema,
): Promise<{ error: string }> => {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // const userId = generateIdFromEntropySize(32);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // await prisma.$transaction(async (tx) => {}, {
    //   maxWait: 5000,
    //   timeout: 10000,
    //   isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    // });

    const user = await prisma.user.create({
      data: {
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // TODO: send email verification

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error(error);
    return {
      error: "Something went wrong. Please try again",
    };
  }
};

export const loginAction = async (
  credentials: LoginSchema,
): Promise<{ error: string }> => {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUsername?.passwordHash) {
      return {
        error: "Invalid username or password",
      };
    }

    const validPassword = await verify(
      existingUsername.passwordHash,
      password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      },
    );

    if (!validPassword) {
      return {
        error: "Invalid username or password",
      };
    }

    const session = await lucia.createSession(existingUsername.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error(error);
    return {
      error: "Something went wrong. Please try again",
    };
  }
};

export const logoutAction = async () => {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");

    // return redirect("/401");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
};
