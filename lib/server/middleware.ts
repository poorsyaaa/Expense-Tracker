import { Prisma } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { User } from "lucia";
import authMiddleware from "./middleware/auth-middleware";

export type CustomNextRequest = NextRequest & {
  user?: User;
};

export type HandlerContext = {
  params?: { [key: string]: string };
  res?: NextResponse;
};

export type CustomHandler = (
  req: CustomNextRequest,
  context: HandlerContext,
) => Promise<NextResponse | void>;

// Implementation of the middleware
export function customMiddleware(...handlers: CustomHandler[]) {
  return async (
    req: CustomNextRequest,
    secondArg: NextResponse | { params: { [key: string]: string } },
  ) => {
    try {
      await authMiddleware(req);

      const context: HandlerContext = {};

      if ("params" in secondArg) {
        context.params = secondArg.params;
      } else {
        context.res = secondArg;
      }

      for (const handler of handlers) {
        const result = await handler(req, context);
        if (result instanceof NextResponse) return result;
      }
    } catch (error) {
      return handleError(error);
    }
  };
}

// Error handling function
function handleError(error: unknown): NextResponse {
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
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
