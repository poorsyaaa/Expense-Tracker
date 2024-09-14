import * as z from "zod";

export const profileSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  displayName: z.string().min(1, { message: "Display name is required" }),
  email: z
    .string()
    .optional()
    .or(z.literal("")) // Allow empty string
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email",
    }),
  avatarUrl: z.string().url({ message: "Invalid avatar URL" }).optional(),
});

export const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  logoutAllSessions: z.boolean().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
