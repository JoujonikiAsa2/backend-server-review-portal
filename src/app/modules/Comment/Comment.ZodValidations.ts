import { z } from "zod";

export const postCommentSchema = z.object({
  content: z.string().min(1, "Can't be empty"),
  reviewId: z
    .string({
      required_error: "Review id is required",
    })
    .uuid(),
});

export type TComment = z.infer<typeof postCommentSchema>;

export const CommentSchemas = {
  postCommentSchema,
};
