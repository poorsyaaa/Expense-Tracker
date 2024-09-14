import { validateRequest } from "@/lib/auth";
import { ApiError } from "next/dist/server/api-utils";
import { CustomNextRequest } from "../middleware";

export default async function authMiddleware(req: CustomNextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = user;
}
