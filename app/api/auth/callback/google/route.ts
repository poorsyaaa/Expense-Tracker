import { google, lucia } from "@/lib/auth";
import prisma from "@/lib/server/db";
import { generateUsername } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Add this when using req.nextUrl.searchParams

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUser = await axios.get<{
      id: string;
      name: string;
      email: string;
      picture?: string;
    }>("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const { id, name, picture, email } = googleUser.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const username = generateUsername(name);

    const user = await prisma.user.create({
      data: {
        username,
        displayName: username,
        googleEmail: email,
        passwordHash: "",
        googleId: id,
        avatarUrl: picture,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof OAuth2RequestError) {
      return new NextResponse(null, {
        status: 400,
      });
    }

    return new NextResponse(null, {
      status: 500,
    });
  }
}
