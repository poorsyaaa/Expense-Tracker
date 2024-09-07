import { z } from "zod";

const requiredString = z.string().trim().min(1);

export const signUpSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9]+$/,
    "Username can only contain letters and numbers",
  ),
  email: requiredString.email("Invalid email"),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});

export const loginSchema = signUpSchema.omit({ email: true });

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
