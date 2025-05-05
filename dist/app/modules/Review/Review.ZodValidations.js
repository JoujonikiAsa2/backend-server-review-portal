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
// import { Category } from "@prisma/client";
// import { z } from "zod";
// export const ratingSummarySchema = z.object({
//   oneStar: z.number().min(0).default(0),
//   twoStars: z.number().min(0).default(0),
//   threeStars: z.number().min(0).default(0),
//   fourStars: z.number().min(0).default(0),
//   fiveStars: z.number().min(0).default(0),
// });
// export const reviewCreationSchema = z.object({
//   userId: z.string().min(1, "User ID is required"),
//   category: z.nativeEnum(Category),
//   upVotes: z.number().min(0).default(0),
//   downVotes: z.number().min(0).default(0),
//   isPremium: z.boolean().default(false),
//   RatingSummary: z.number().optional(),
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   imageUrl: z.string().optional(),
//   price: z
//     .number({
//       required_error: "Price is required",
//     })
//     .min(1, "Price must be greater than 0")
//     .optional(),
// });
// export type TReview = z.infer<typeof reviewCreationSchema>;
// export const reviewUpdateSchema = reviewCreationSchema.partial();
// export type TReviewUpdate = z.infer<typeof reviewUpdateSchema>;
// export const ReviewSchemas = {
//   reviewCreationSchema,
//   reviewUpdateSchema,
// };
