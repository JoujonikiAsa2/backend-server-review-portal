import { UserRole } from "@prisma/client";
import { z } from "zod";

// Enum for role
export const UserRoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]);

// Base schema
export const reviewCreationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"), // Secure length
});

export type TReview = z.infer<typeof reviewCreationSchema>;

export const ReviewSchemas = {
  reviewCreationSchema,
};
