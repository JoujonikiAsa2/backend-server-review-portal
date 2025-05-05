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
export const reviewUpdateSchema = z.object({
  category: z.nativeEnum(Category).optional(),
  RatingSummary: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().optional(),
});

export type TReview = z.infer<typeof reviewCreationSchema>;

// export const reviewUpdateSchema = reviewCreationSchema.partial();

export type TReviewUpdate = z.infer<typeof reviewUpdateSchema>;

export const ReviewSchemas = {
  reviewCreationSchema,
  reviewUpdateSchema,
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



