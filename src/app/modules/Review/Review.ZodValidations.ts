import { Category } from "@prisma/client";
import { z } from "zod";

export const ratingSummarySchema = z.object({
  oneStar: z.number().min(0).default(0),
  twoStars: z.number().min(0).default(0),
  threeStars: z.number().min(0).default(0),
  fourStars: z.number().min(0).default(0),
  fiveStars: z.number().min(0).default(0),
});

export const reviewCreationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  category: z.nativeEnum(Category),
  upVotes: z.number().min(0).default(0),
  downVotes: z.number().min(0).default(0),
  isPremium: z.boolean().default(false),
  RatingSummary: ratingSummarySchema.optional(),
});

export type TReview = z.infer<typeof reviewCreationSchema>;

export const reviewUpdateSchema = reviewCreationSchema.partial();

export type TReviewUpdate = z.infer<typeof reviewUpdateSchema>;

export const ReviewSchemas = {
  reviewCreationSchema,
  reviewUpdateSchema,
};
