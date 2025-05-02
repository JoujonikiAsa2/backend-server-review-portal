import { z } from "zod";

// Enum for role

// Base schema
export const postUploadSchema = z.object({
  comment: z.string().min(1, "Can't be empty"),
  reviewId: z
    .string({
      required_error: "Post id is required",
    })
    .uuid(),
});

export type TComment = z.infer<typeof postUploadSchema>;

export const PaymentSchemas = {
  postUploadSchema,
};
