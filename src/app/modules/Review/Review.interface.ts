import { Category, Comment, RatingSummary, Review } from "@prisma/client";

export type ReviewWithRelations = Review & {
  RatingSummary: RatingSummary | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  Comment: Comment[];
};

export type CreateReviewInput = {
  category: Category;
  upVotes?: number;
  downVotes?: number;
  isPremium?: boolean;
  RatingSummary: number;
};
