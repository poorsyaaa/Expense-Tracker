import { Prisma } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "../auth";
import { User } from "lucia";

export type CustomNextRequest = NextRequest & {
  user?: User;
};

// Context includes params for dynamic routes
export type ContextWithParams = {
  params: { [key: string]: string };
};

// CustomHandler for dynamic routes
export type CustomHandlerWithParams = (
  req: CustomNextRequest,
  context: ContextWithParams,
) => Promise<NextResponse | void>;

// CustomHandler for non-dynamic routes
export type CustomHandlerWithResponse = (
  req: CustomNextRequest,
  res: NextResponse,
) => Promise<NextResponse | void>;

// Overload 1: Middleware that takes req and context with params (dynamic route)
export function customMiddleware(
  ...handlers: CustomHandlerWithParams[]
): (
  req: CustomNextRequest,
  context: { params: { [key: string]: string } },
) => Promise<NextResponse | void>;

// Overload 2: Middleware that takes req and res (non-dynamic route)
export function customMiddleware(
  ...handlers: CustomHandlerWithResponse[]
): (req: CustomNextRequest, res: NextResponse) => Promise<NextResponse | void>;

// Implementation of the middleware
export function customMiddleware(
  ...handlers: (CustomHandlerWithParams | CustomHandlerWithResponse)[]
) {
  return async (
    req: CustomNextRequest,
    secondArg: NextResponse | { params: { [key: string]: string } },
  ) => {
    try {
      await authMiddleware(req); // Run authentication middleware

      // Check if the second argument is a NextResponse (res) or context with params
      const isRes = secondArg instanceof NextResponse;

      for (const handler of handlers) {
        if (isRes) {
          // For non-dynamic routes, pass res
          const result = await (handler as CustomHandlerWithResponse)(
            req,
            secondArg,
          );
          if (result instanceof NextResponse) return result;
        } else {
          // For dynamic routes, pass context with params
          const result = await (handler as CustomHandlerWithParams)(
            req,
            secondArg as { params: { [key: string]: string } },
          );
          if (result instanceof NextResponse) return result;
        }
      }
    } catch (error) {
      console.error("Middleware Error:", error);

      // Handle Prisma errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          {
            error: "Database unique constraint violation.",
            message: error.message,
          },
          { status: 409 },
        );
      }

      // Handle validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation Error", issues: error.format() },
          { status: 400 },
        );
      }

      // Handle API errors
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: error.statusCode,
            statusText: error.message,
          },
        );
      }

      // Handle internal server errors
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}

// Authentication middleware function
async function authMiddleware(req: CustomNextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = user;
}
