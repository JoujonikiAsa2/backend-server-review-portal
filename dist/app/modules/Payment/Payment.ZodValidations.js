"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchemas = exports.paymentCreationSchema = exports.UserRoleEnum = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Enum for role
exports.UserRoleEnum = zod_1.z.enum([client_1.UserRole.USER, client_1.UserRole.ADMIN]);
// Base schema
exports.paymentCreationSchema = zod_1.z.object({
    email: zod_1.z.string(),
    reviewId: zod_1.z.string(),
    amount: zod_1.z.number().optional(),
    name: zod_1.z.string(),
    transactionId: zod_1.z.string(),
    paymentStatus: zod_1.z.enum([
        client_1.PaymentStatus.CONFIRMED,
        client_1.PaymentStatus.PENDING,
        client_1.PaymentStatus.FAILED,
        client_1.PaymentStatus.CANCEL,
        client_1.PaymentStatus.REFUND,
    ]),
    paymentMethod: zod_1.z.string().optional()
});
exports.PaymentSchemas = {
    paymentCreationSchema: exports.paymentCreationSchema,
};
