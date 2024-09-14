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
  // avatarUrl: z.string().url({ message: "Invalid avatar URL" }).optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password is required",
    }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z.string(),
    logoutAllSessions: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
