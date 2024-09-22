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
  next: () => Promise<NextResponse | void>,
) => Promise<NextResponse | void>;

// Main middleware function to handle multiple middleware functions
export function customMiddleware(...handlers: CustomHandler[]) {
  return async (
    req: CustomNextRequest,
    secondArg: NextResponse | { params: { [key: string]: string } },
  ): Promise<NextResponse | void> => {
    try {
      await authMiddleware(req);

      const context: HandlerContext = {};

      if ("params" in secondArg) {
        context.params = secondArg.params;
      } else {
        context.res = secondArg;
      }

      let index = -1;

      // Helper function to iterate through middleware functions
      const runner = async (): Promise<NextResponse | void> => {
        index++;
        if (index < handlers.length) {
          const handler = handlers[index];
          return handler(req, context, runner);
        }
        return NextResponse.next();
      };

      const response = await runner();

      return response;
    } catch (error) {
      return handleError(error);
    }
  };
}

// Centralized error handling function
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

  // Handle Zod validation errors
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

  // Fallback to internal server error
  return NextResponse.json(
    { error: (error as Error)?.message ?? "Internal Server Error" },
    { status: 500, statusText: (error as Error)?.message },
  );
}
