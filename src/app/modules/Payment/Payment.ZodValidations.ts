import { UserRole } from "@prisma/client";
import { z } from "zod";

// Enum for role
export const UserRoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]);

// Base schema
export const paymentCreationSchema = z.object({});

export type TPayment = z.infer<typeof paymentCreationSchema>;

export const PaymentSchemas = {
  paymentCreationSchema,
};
