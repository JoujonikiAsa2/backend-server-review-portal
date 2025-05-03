"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchemas = exports.reviewUpdateSchema = exports.reviewCreationSchema = exports.ratingSummarySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.ratingSummarySchema = zod_1.z.object({
    oneStar: zod_1.z.number().min(0).default(0),
    twoStars: zod_1.z.number().min(0).default(0),
    threeStars: zod_1.z.number().min(0).default(0),
    fourStars: zod_1.z.number().min(0).default(0),
    fiveStars: zod_1.z.number().min(0).default(0),
});
exports.reviewCreationSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    category: zod_1.z.nativeEnum(client_1.Category),
    upVotes: zod_1.z.number().min(0).default(0),
    downVotes: zod_1.z.number().min(0).default(0),
    isPremium: zod_1.z.boolean().default(false),
    RatingSummary: zod_1.z.number().optional(),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    price: zod_1.z
        .number({
        required_error: "Price is required",
    })
        .min(1, "Price must be greater than 0")
        .optional(),
});
exports.reviewUpdateSchema = exports.reviewCreationSchema.partial();
exports.ReviewSchemas = {
    reviewCreationSchema: exports.reviewCreationSchema,
    reviewUpdateSchema: exports.reviewUpdateSchema,
};
