"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchemas = exports.reviewUpdateSchema = exports.reviewCreationSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.reviewCreationSchema = zod_1.z.object({
    category: zod_1.z.nativeEnum(client_1.Category),
    RatingSummary: zod_1.z.number({
        required_error: "Rating rating is required",
    }),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(10, "Title is required"),
    imageUrl: zod_1.z.string({ required_error: "Image url is required" }),
    price: zod_1.z
        .number({
        required_error: "Price is required",
    })
        .min(1, "Price must be greater than 0")
        .optional(),
});
exports.reviewUpdateSchema = zod_1.z.object({
    category: zod_1.z.nativeEnum(client_1.Category).optional(),
    RatingSummary: zod_1.z.number().optional(),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
});
exports.ReviewSchemas = {
    reviewCreationSchema: exports.reviewCreationSchema,
    reviewUpdateSchema: exports.reviewUpdateSchema,
};
