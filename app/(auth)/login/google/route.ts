import { google } from "@/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  cookies().set("state", state, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
  });

  return Response.redirect(url);
}
