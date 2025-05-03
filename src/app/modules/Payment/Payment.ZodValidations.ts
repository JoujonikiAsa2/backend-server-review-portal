import { PaymentStatus, UserRole } from "@prisma/client";
import { z } from "zod";

// Enum for role
export const UserRoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]);

// Base schema
export const paymentCreationSchema = z.object({
  email: z.string(),
  reviewId: z.string(),
  amount: z.number().optional(),
  name: z.string(),
  transactionId: z.string(),
  paymentStatus: z.enum([
    PaymentStatus.CONFIRMED,
    PaymentStatus.PENDING,
    PaymentStatus.FAILED,
    PaymentStatus.CANCEL,
    PaymentStatus.REFUND,
  ]),
  paymentMethod: z.string().optional()
});

export type TPayment = z.infer<typeof paymentCreationSchema>;

export const PaymentSchemas = {
  paymentCreationSchema,
};
