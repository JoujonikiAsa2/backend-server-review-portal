import { Category } from "@prisma/client";
import { z } from "zod";

export const reviewCreationSchema = z.object({
  category: z.nativeEnum(Category),
  RatingSummary: z.number({
    required_error: "Rating rating is required",
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Title is required"),
  imageUrl: z.string({ required_error: "Image url is required" }),
  price: z
    .number({
      required_error: "Price is required",
    })
    .min(1, "Price must be greater than 0")
    .optional(),
});

export type TReview = z.infer<typeof reviewCreationSchema>;

export const reviewUpdateSchema = reviewCreationSchema.partial();

export type TReviewUpdate = z.infer<typeof reviewUpdateSchema>;

export const ReviewSchemas = {
  reviewCreationSchema,
  reviewUpdateSchema,
};
