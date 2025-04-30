import { UserRole } from "@prisma/client";
import { z } from "zod";

// Enum for role
export const UserRoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]);

// Base schema
export const userCreationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"), // Secure length
});

export type TUser = z.infer<typeof userCreationSchema>;

export const UserSchemas = {
  userCreationSchema,
};
